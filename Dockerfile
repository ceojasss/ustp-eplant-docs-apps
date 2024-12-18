FROM node:16
WORKDIR /app/frontend
COPY package.json ./
RUN npm install
RUN mkdir node_modules/.cache && chmod -R 777 node_modules/.cache
EXPOSE 3000
