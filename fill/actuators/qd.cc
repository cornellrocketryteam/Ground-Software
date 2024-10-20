#include <unistd.h>
#include "qd.h"

QD::QD(){
    stepperMotor = new StepperMotor(COIL1, COIL2, COIL3, COIL4, false);
    actuating = false; 
}

QD::~QD(){
    delete stepperMotor;
}

bool QD::Actuate(){
    if (actuating){
        return false; // cannot actuate a sensor that is already actuating 
    }

    std::thread actuate_thread(&QD::turnMotor, this);

    actuate_thread.detach(); // we want to continue normal operation 

    return true; // Has been actuated successfully 
}

void QD::turnMotor(){
    actuating = true; 

    stepperMotor->Enable(); // enable sensor motor 
    stepperMotor->Rotate(stepperMotor->CLOCKWISE, 1200, 50); // Rotate the motor clockwise, 50ms time delay

    stepperMotor->StopRotation(); // Holds in current location 
    stepperMotor->Disable();

    actuating = false; 

    return;
}

bool QD::isActuating(){
    return actuating;
}