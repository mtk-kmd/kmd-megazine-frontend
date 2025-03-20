FROM node:19-alpine

WORKDIR /app
COPY . .
RUN npm install
RUN npm run build
RUN npm cache clean --force

EXPOSE 4700

CMD ["npm", "run", "prod"]
