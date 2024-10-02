#ifndef QD_H
#define QD_H

//TODO: Update COIL based on specs 
#define COIL1 1
#define COIL2 2
#define COIL3 3
#define COIL4 4

#include "steppermotor.h"
#include "actuator.h"

class QD : public Actuator {
    public: 
        QD();
        ~QD();
        bool Actuate();
        bool isActuated();
    protected:
        StepperMotor* stepperMotor;
};

#endif 