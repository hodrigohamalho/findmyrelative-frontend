FROM node:12-alpine

COPY . .

RUN npm install && \
    npm run build && \
    npm install -g serve

EXPOSE 8080
CMD npm run build && serve -s build -l 8080
