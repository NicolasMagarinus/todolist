FROM node:22

WORKDIR /usr/src/app

COPY package*.json ./ 
COPY tsconfig.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3002

CMD ["npm", "run", "dev"]
