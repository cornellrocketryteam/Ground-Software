#ifndef QD_H
#define QD_H

//TODO: Update COIL based on specs 
#define COIL1 30
#define COIL2 21
#define COIL3 22
#define COIL4 23

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