FROM node:22.4-alpine
RUN mkdir -p var/app
WORKDIR /var/app
COPY . .
RUN npm install
RUN npm run build
EXPOSE 5005
CMD [ "node", "dist/main.js" ]