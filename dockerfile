FROM 172.16.100.39/docker/nginx:spa
RUN mkdir -p /home/web
COPY ./www /home/web
WORKDIR /home/web
RUN mkdir -p /usr/share/nginx/html/
RUN cp -prf . /usr/share/nginx/html/
CMD ["nginx", "-g", "daemon off;"]