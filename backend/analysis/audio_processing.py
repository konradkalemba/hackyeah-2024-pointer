import numpy as np
import librosa
import whisper
import pyphen
import textstat
from sklearn.preprocessing import StandardScaler
from typing import Dict, Any


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

    # Analiza czytelności tekstu
    readability_score = textstat.flesch_reading_ease(transcription)

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

    # Czyszczenie tablic (jeśli masz tablice numeryczne, które zwracasz)
    # W tym przypadku nie zwracamy tablic, które mogą zawierać NaN

    # Zebranie wszystkich wyników
    analysis_results = {
        'duration': duration,
        'transcription': transcription,
        'words': words,
        'long_pauses': long_pauses,
        'readability_score': readability_score,
    }

    return analysis_results
