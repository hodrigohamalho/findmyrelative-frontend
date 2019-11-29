FROM node:12-alpine

COPY package.json package.json
COPY src src
COPY public public
COPY tsconfig.json tsconfig.json

RUN npm install
RUN npm run build
RUN npm install -g serve

EXPOSE 8080
CMD npm run build && serve -s build -l 8080
