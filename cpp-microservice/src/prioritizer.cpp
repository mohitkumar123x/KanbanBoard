
#include "prioritizer.h"
#include <algorithm>

int Prioritizer::calculatePriority(const Task& task) {
    // Simple priority based on title and description length
    size_t titleLength = task.getTitle().length();
    size_t descLength = task.getDescription().length();
    return std::min(static_cast<int>(titleLength + descLength) / 10, 10);
}
