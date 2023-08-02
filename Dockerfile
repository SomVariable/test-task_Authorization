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
COPY --from=build /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=build /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=build /app/dist ./dist