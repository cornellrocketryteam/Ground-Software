#ifndef IGNITOR_H
#define IGNITOR_H

#include "actuator.h"
#include "wiringPi.h"
#include <spdlog/spdlog.h>

#define IG_0 17
#define IG_1 27

class Ignitor : public Actuator{
    public: 
        Ignitor();
        ~Ignitor();
        bool Actuate();
        bool isActuating();
};
#endif 