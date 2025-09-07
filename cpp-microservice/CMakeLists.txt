cmake_minimum_required(VERSION 3.10)
project(KanbanMicroservice)

set(CMAKE_CXX_STANDARD 17)

find_package(Threads REQUIRED)
find_package(spdlog REQUIRED)

add_executable(kanban_microservice
  src/main.cpp
  src/task.cpp
  src/prioritizer.cpp
)

target_include_directories(kanban_microservice PRIVATE include)
target_link_libraries(kanban_microservice PRIVATE Threads::Threads spdlog::spdlog)