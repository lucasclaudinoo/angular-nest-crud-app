FROM node:20.14.0

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install


RUN npm install -g @angular/cli


COPY . .


EXPOSE 4200

CMD ["ng", "serve", "--host", "0.0.0.0", "--poll", "--disable-host-check"]