#include "qd.h"

QD::QD() {
    stepperMotor = new StepperMotor(COIL1, COIL2, COIL3, COIL4);
}

QD::~QD(){
    delete stepperMotor;
}

bool QD::Actuate(){
    if (actuating){
        return false; // cannot actuate a sensor that is already actuating 
    }

    std::thread actuate_thread(turnMotor);

    actuate_thread.detach(); // we want to continue normal operation 

    return true; // Has been actuated successfully 
}

void QD::turnMotor(){
    actuating = true; 
    
    stepperMotor->Enable(); // enable sensor motor 
    stepperMotor->Rotate(stepperMotor->CLOCKWISE, 50); // Rotate the motor clockwise, 50ms time delay

    delay(60000); // We need 1200 steps

    stepperMotor->StopRotation(); // Holds in current location 
    stepperMotor->Disable();

    actuating = false; 
}

bool QD::isActuating(){
    return actuating;
}