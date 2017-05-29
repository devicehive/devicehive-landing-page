FROM phusion/passenger-nodejs

ARG SOURCE_REPOSITORY_URL
ARG SOURCE_BRANCH

# Set correct environment variables.
ENV HOME /root

# Use baseimage-docker's init process.
CMD ["/sbin/my_init"]

# Expose Nginx HTTP service
EXPOSE 8080

# Enable nginx and remove the default site
RUN rm -f /etc/service/nginx/down \
    && rm /etc/nginx/sites-enabled/default

# copy landing page website files
RUN curl -L "${SOURCE_REPOSITORY_URL:-https://github.com/devicehive/devicehive-landing-page}/archive/${SOURCE_BRANCH:-master}.tar.gz" | tar -zxf- -C /tmp \
    && mv /tmp/devicehive-landing-page-master /home/app/landingpage \
    && cd /home/app/landingpage \
    && npm install . \
    && npm cache clean \
    && chown -R app:app /home/app/landingpage

# register landing page website in nginx
ADD landingpage.conf /etc/nginx/sites-enabled/landingpage.conf
