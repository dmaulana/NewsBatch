FROM node:16-alpine
COPY . /app
WORKDIR /app

RUN npm install 
RUN npm run build
RUN npm run package 
ENTRYPOINT ["/app/generator"]
