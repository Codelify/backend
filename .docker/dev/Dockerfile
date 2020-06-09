FROM node:12

WORKDIR /var/www

COPY . .

EXPOSE 3000

RUN npm install

RUN npm audit fix

COPY dev.docker-entrypoint.sh /var/www/

RUN ["chmod", "+x", "/var/www/dev.docker-entrypoint.sh"]

ENTRYPOINT [ "./dev.docker-entrypoint.sh" ]

