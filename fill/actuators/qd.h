#ifndef QD_H
#define QD_H

//TODO: Update COIL based on specs 
#define COIL1 5
#define COIL2 6
#define COIL3 22
#define COIL4 26

#include "steppermotor.h"
#include "actuator.h"
#include <spdlog/spdlog.h>

#include <thread> 

class QD : public Actuator {
    public: 
        QD();
        ~QD();
        bool Actuate();
        bool isActuating();
    protected:
        StepperMotor* stepperMotor;
    private:
        void turnMotor();
};

#endif 