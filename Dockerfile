FROM node:18.20.5-alpine3.21

WORKDIR /app
COPY . .
RUN npm install --legacy-peer-deps
RUN npm run build
RUN npm cache clean --force

EXPOSE 4700

CMD ["npm", "run", "prod"]
