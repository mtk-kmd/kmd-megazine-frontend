FROM node:18.20.5-alpine3.21

WORKDIR /app
COPY . .
RUN npm install --legacy-peer-deps
RUN npm cache clean --force

EXPOSE 3000

CMD ["npm", "run", "dev"]
