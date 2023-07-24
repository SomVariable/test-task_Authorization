FROM node:18-alpine
WORKDIR /app
COPY *.json ./
RUN npm install
ADD . .
RUN npm run build api
CMD ["node", "./dist/main.js"]