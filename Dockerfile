FROM node:latest
RUN mkdir /home/node_boilerplate
WORKDIR /home/node_boilerplate
COPY package.json .
RUN npm install
COPY . .
EXPOSE 9090
CMD [ "npm", "start" ]