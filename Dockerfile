FROM node:18-alpine as build
WORKDIR /app
COPY *.json ./
RUN npm install
ADD . .
RUN npx prisma generate
RUN npm run build

FROM node:18-alpine
WORKDIR /app
ADD package.json ./
RUN npm i --only=prod
COPY --from=build /app/prisma ./prisma
RUN npx prisma generate
RUN npx prisma migrate dev --name init
COPY --from=build /app/dist ./dist
CMD ["node", "./dist/main.js"]


# FROM node:18-alpine as build
# WORKDIR /app
# COPY *.json ./
# RUN npm install
# ADD . .
# RUN npx prisma generate
# RUN npm run build
# CMD ["node", "./dist/main.js"]