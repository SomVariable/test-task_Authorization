FROM node:18 as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY ./prisma ./prisma
RUN npx prisma generate
ADD . .
RUN npm run build
EXPOSE 3000 
ENTRYPOINT ["node", "./dist/main.js"]
