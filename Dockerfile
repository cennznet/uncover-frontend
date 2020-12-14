FROM node:10.17.0-alpine as builder

WORKDIR /app
COPY package.json /app
COPY yarn.lock /app
RUN yarn install
ADD . /app
RUN yarn run staticbuild

FROM nginx:latest
COPY --from=builder /app/web /usr/share/nginx/html
COPY --from=builder /app/default.conf /etc/nginx/conf.d/default.conf

# # production images
# FROM node:10.17.0-alpine

# RUN apk add --no-cache --update tini
# RUN apk add --no-cache --update curl

# WORKDIR /workdir
# RUN mkdir /build
# COPY --from=builder /app ./build
