
#include "task.h"

Task::Task(const std::string& title, const std::string& description)
    : title(title), description(description) {}

std::string Task::getTitle() const {
    return title;
}

std::string Task::getDescription() const {
    return description;
}
