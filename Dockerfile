FROM node:12-alpine

COPY package.json package.json
COPY src src
COPY public public
COPY tsconfig.json tsconfig.json

ENV REACT_APP_BACKEND_URL "http://localhost:8080"

RUN npm install --silent

RUN npm run build

RUN npm install -g serve

CMD serve -s build -l 5000

EXPOSE 5000
