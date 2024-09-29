import numpy as np
import librosa
import whisper
import pyphen
import textstat
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import KMeans
from typing import Dict, Any

import numpy as np

def clean_array(arr):
    """
    Zamienia wartości NaN i inf w tablicy na None.
    """
    cleaned_list = []
    for x in arr:
        if np.isnan(x) or np.isinf(x):
            cleaned_list.append(None)
        else:
            cleaned_list.append(float(x))
    return cleaned_list


def analyze_audio(audio_path: str) -> Dict[str, Any]:
    # Wczytaj plik audio
    y, sr = librosa.load(audio_path, sr=None)
    duration = librosa.get_duration(y=y, sr=sr)

    # Transkrypcja mowy z użyciem Whisper
    model = whisper.load_model("base")
    result = model.transcribe(audio_path, language='pl', word_timestamps=True)
    segments = result['segments']
    transcription = result['text']

    # Ekstrakcja słów z czasami i liczbą sylab
    dic = pyphen.Pyphen(lang='pl_PL')
    words = []
    for segment in segments:
        for word_info in segment['words']:
            word = word_info['word'].strip()
            start_time = word_info['start']
            end_time = word_info['end']
            syllables = dic.inserted(word)
            syllable_count = len(syllables.split('-')) if syllables else 1
            words.append({
                'word': word,
                'start_time': start_time,
                'end_time': end_time,
                'syllable_count': syllable_count
            })

    # Analiza tempa mówienia (sylaby na sekundę)
    speaking_rate_segments = []
    window_size = 5  # w sekundach
    step_size = 1    # w sekundach
    current_time = 0
    while current_time < duration:
        window_words = [w for w in words if current_time <= w['start_time'] < current_time + window_size]
        total_syllables = sum(w['syllable_count'] for w in window_words)
        speaking_rate = total_syllables / window_size if window_words else 0
        speaking_rate_segments.append({
            'start_time': current_time,
            'end_time': min(current_time + window_size, duration),
            'speaking_rate': speaking_rate
        })
        current_time += step_size

    # Wykrywanie fragmentów z za szybkim tempem mówienia
    threshold_fast = 6  # sylab na sekundę
    fast_speech_segments = [seg for seg in speaking_rate_segments if seg['speaking_rate'] > threshold_fast]

    # Analiza głośności w czasie
    frame_length = int(sr * 0.025)  # 25 ms
    hop_length = int(sr * 0.010)    # 10 ms
    rms = librosa.feature.rms(y=y, frame_length=frame_length, hop_length=hop_length)[0]
    rms_db = librosa.amplitude_to_db(rms, ref=np.max)
    times_rms = librosa.frames_to_time(range(len(rms_db)), sr=sr, hop_length=hop_length)

    # Wykrywanie fragmentów zbyt cichych lub zbyt głośnych
    threshold_quiet = -35  # dB
    threshold_loud = -5    # dB
    quiet_times = times_rms[rms_db < threshold_quiet]
    loud_times = times_rms[rms_db > threshold_loud]

    def group_times(times_array, min_duration=0.2):
        segments = []
        if len(times_array) == 0:
            return segments
        start_time = times_array[0]
        prev_time = times_array[0]
        for t in times_array[1:]:
            if t - prev_time > hop_length / sr:
                if prev_time - start_time >= min_duration:
                    segments.append({'start_time': start_time, 'end_time': prev_time})
                start_time = t
            prev_time = t
        if prev_time - start_time >= min_duration:
            segments.append({'start_time': start_time, 'end_time': prev_time})
        return segments

    quiet_segments = group_times(quiet_times)
    loud_segments = group_times(loud_times)

    # Wykrywanie pauz (ciszy)
    top_db = 30  # Próg w dB dla ciszy
    non_silent_intervals = librosa.effects.split(y, top_db=top_db)
    silent_intervals = []
    prev_end = 0
    for interval in non_silent_intervals:
        start, end = interval
        if start > prev_end:
            silent_intervals.append({
                'start_time': prev_end / sr,
                'end_time': start / sr,
                'duration': (start - prev_end) / sr
            })
        prev_end = end
    if prev_end < len(y):
        silent_intervals.append({
            'start_time': prev_end / sr,
            'end_time': len(y) / sr,
            'duration': (len(y) - prev_end) / sr
        })

    # Wykrywanie za długich pauz
    threshold_pause = 2  # sekundy
    long_pauses = [pause for pause in silent_intervals if pause['duration'] >= threshold_pause]

    # Wykrywanie słów-wypełniaczy (przerywników)
    filler_words = ['yyy', 'eee', 'no', 'wiesz', 'tak', 'jakby', 'prawda']
    filler_segments = [w for w in words if w['word'].lower() in filler_words]

    # Analiza intonacji (F0)
    try:
        f0, voiced_flag, voiced_probs = librosa.pyin(
            y, fmin=librosa.note_to_hz('C2'), fmax=librosa.note_to_hz('C7')
        )
        times_f0 = librosa.times_like(f0)
    except Exception as e:
        f0 = np.array([])
        times_f0 = np.array([])
        print(f"Błąd podczas analizy intonacji: {e}")

        # Czyszczenie tablic f0 i times_f0
    if f0.size > 0:
        f0_list = clean_array(f0)
        times_f0_list = times_f0.tolist()
    else:
        f0_list = []
        times_f0_list = []

    # Wykrywanie niepłynności mowy (powtórzenia)
    disfluencies = []
    for i in range(len(words) - 1):
        if words[i]['word'].lower() == words[i+1]['word'].lower():
            disfluencies.append({
                'type': 'Powtórzenie',
                'start_time': words[i]['start_time'],
                'end_time': words[i+1]['end_time'],
                'word': words[i]['word']
            })

    # Analiza czytelności tekstu
    readability_score = textstat.flesch_reading_ease(transcription)

    # Wykrywanie szumów tła (zakłóceń)
    noise_levels = []
    for pause in silent_intervals:
        start_sample = int(pause['start_time'] * sr)
        end_sample = int(pause['end_time'] * sr)
        pause_segment = y[start_sample:end_sample]
        if len(pause_segment) > 0:
            noise_rms = np.sqrt(np.mean(pause_segment**2))
            noise_db = 20 * np.log10(noise_rms + 1e-6)
            noise_levels.append({
                'start_time': pause['start_time'],
                'end_time': pause['end_time'],
                'noise_level_db': noise_db
            })
    rms_db_list = clean_array(rms_db) if rms_db.size > 0 else []
    # Zebranie wszystkich wyników
    analysis_results = {
        'duration': duration,
        'transcription': transcription,
        'words': words,
        #'speaking_rate_segments': speaking_rate_segments,
        #'fast_speech_segments': fast_speech_segments,
        #'quiet_segments': quiet_segments,
        #'loud_segments': loud_segments,
        'long_pauses': long_pauses,
        #'filler_segments': filler_segments,
        #'disfluencies': disfluencies,
        'readability_score': readability_score,
        #'noise_levels': noise_levels,
        #'rms_db': rms_db_list,
        #'intonation': {
        #    'f0': f0_list,
        #    'times_f0': times_f0_list
        #}
    }

    return analysis_results
