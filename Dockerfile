# Stage 0 - Pull app repo
FROM alpine/git:latest
WORKDIR /
COPY ./ ./innovativeproject-hashiplayero 

# Stage 1 - Build web app from artifacts from previous stage
FROM node:lts-alpine
COPY --from=0 /innovativeproject-hashiplayero/ui /ui
WORKDIR /ui
RUN npm install \
    && npm run build

# Stage 2 - Run rice to generate go file containing all asset and compile go sources into an executable file
FROM golang:alpine
RUN apk add --update git build-base
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
COPY --from=2 /innovativeproject-hashiplayero/hashiplayero /app/hashiplayero
WORKDIR /app
ENTRYPOINT ["/app/hashiplayero"]

