#ifndef QD_H
#define QD_H

#define PUL_PIN 5
#define DIR_PIN 6
#define ENA_PIN 26

#include "actuator.h"
#include "wiringPi.h"
#include <spdlog/spdlog.h>

#include <thread> 

class QD : public Actuator {
    public: 
        QD();
        ~QD();
        bool Actuate();
        bool isActuating();
    protected:
    private:
        void turnMotor();
};

#endif 