FROM ubuntu:20.04
RUN apt-get update && apt-get install -y \
  build-essential \
  cmake \
  libboost-all-dev \
  && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY . .
RUN mkdir build && cd build && cmake .. && make
EXPOSE 8080
CMD ["./build/kanban_microservice"]