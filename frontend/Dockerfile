FROM node:18-alpine

WORKDIR /usr/src/app

COPY . .
RUN npm install
ENV NEXT_PUBLIC_API_URL="http://159.69.15.185:8000"
RUN npm run build

COPY . /usr/src/app
EXPOSE 3000
CMD [ "npm", "run", "start" ]