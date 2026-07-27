# Node dependencies
FROM node:22.14.0

WORKDIR /app

COPY package*.json ./

RUN npm install;

COPY . .

ENV PORT=7000

EXPOSE 7000

CMD ["npm", "start"]