
#ifndef TASK_H
#define TASK_H

#include <string>

class Task {
public:
    Task(const std::string& title, const std::string& description);
    std::string getTitle() const;
    std::string getDescription() const;

private:
    std::string title;
    std::string description;
};

#endif
