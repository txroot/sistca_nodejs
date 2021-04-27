FROM debian:stretch-slim

# Update Repositories
RUN apt-get -y update --fix-missing
RUN apt-get -y upgrade

# General Libraries
RUN apt-get install -y apt-utils build-essential git

# Install common libs
RUN apt install -y wget curl libusb-1.0-0-dev libudev-dev udev python

# Install Nodejs
RUN curl -fsSL https://deb.nodesource.com/setup_current.x --output setup.x
RUN bash setup.x
RUN apt update
RUN apt-get install -y nodejs

# Update NPM
RUN npm install -g npm@7.11.1

# Verify Node and NPM versions
CMD node -v
CMD npm -v

WORKDIR /app
COPY . .

CMD npm install
CMD ls
CMD npm start