FROM node:23-alpine
WORKDIR /app
COPY package*.json ./
RUN npm i
COPY . .
EXPOSE 3001
CMD [ "npm", "start" ]