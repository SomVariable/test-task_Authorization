FROM node:18-alpine as build
WORKDIR /app
COPY *.json ./
RUN npm install
ADD . .
RUN npx prisma generate
RUN npm run build

FROM node:18-alpine
WORKDIR /app
COPY package.json ./
RUN npm install --only=prod
COPY --from=build /app/dist ./dist
CMD ["node", "./dist/main.js"]