#ifndef QD_H
#define QD_H

//TODO: Update COIL based on specs 
#define COIL1 22
#define COIL2 23
#define COIL3 24
#define COIL4 25

#include "steppermotor.h"
#include "actuator.h"

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