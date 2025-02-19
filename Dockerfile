FROM node:alpine

WORKDIR /usr/src/app

COPY . /usr/src/app

RUN npm install -g @angular/cli

RUN npm install 
RUN npm install bootstrap
RUN npm firebase @angular/fire 
RUN npm @emailjs/browser

CMD ["ng", "serve", "--host", "0.0.0.0"]
