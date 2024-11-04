#ifndef QD_H
#define QD_H

#include "steppermotor.h"
#include "actuator.h"

class QD : public Actuator {
    public: 
        QD();
        ~QD();
        bool Actuate();
        bool isActuated();
    protected:
};

#endif 