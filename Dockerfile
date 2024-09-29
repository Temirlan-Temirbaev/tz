FROM node

RUN apt-get update && apt-get install -y python3 python3-pip

RUN pip3 install awscli --break-system-packages

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

CMD [ "npm", "run", "dev" ]