
#ifndef PRIORITIZER_H
#define PRIORITIZER_H

#include "task.h"

class Prioritizer {
public:
    static int calculatePriority(const Task& task);
};

#endif
