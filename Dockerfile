FROM node:18-alpine
WORKDIR /app
COPY *.json ./
RUN npm install
ADD . .
RUN npx prisma generate
RUN npm run build
CMD ["node", "./dist/main.js"]