# Stage 0 - Pull app repo
FROM alpine/git:latest
WORKDIR /
#RUN git clone https://github.com/nokia-wroclaw/innovativeproject-hashiplayero.git
RUN git clone -b many_logs https://github.com/nokia-wroclaw/innovativeproject-hashiplayero.git

# Stage 1 - Build web app from artifacts from previous stage
FROM node:lts-alpine
COPY --from=0 /innovativeproject-hashiplayero/ui /ui
WORKDIR /ui
RUN npm install \
    && npm run build

# Stage 2 - Run rice to generate go file containing all asset and compile go sources into an executable file
FROM golang:alpine
RUN apk add --update git
WORKDIR /innovativeproject-hashiplayero/
COPY --from=0 /innovativeproject-hashiplayero/ .
COPY --from=1 /ui/build ui/build
RUN go get github.com/GeertJohan/go.rice \
    && go get github.com/GeertJohan/go.rice/rice \
    && go build -o /usr/bin/rice /go/pkg/mod/github.com/\!geert\!johan/go.rice\@v1.0.2/rice/ \
    && /usr/bin/rice embed-go --import-path ./internal/server/ \
    && go build -o hashiplayero ./cmd/app/

# Stage 3 - Copy binary file and setup entry point
FROM alpine:latest
COPY --from=2 /innovativeproject-hashiplayero/hashiplayero /usr/bin/hashiplayero
ENTRYPOINT ["/usr/bin/hashiplayero"]

