FROM node:10

COPY . .

ENV REACT_APP_BACKEND_URL "http://localhost:8080"

RUN npm run build

RUN npm install -g serve

CMD serve -s build -l 5000

EXPOSE 5000
