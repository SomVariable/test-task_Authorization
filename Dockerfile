FROM node:18-alpine
WORKDIR /app
COPY *.json ./
RUN npm install
ADD . .
RUN npm run build
CMD ["node", "./dist/main.js"]