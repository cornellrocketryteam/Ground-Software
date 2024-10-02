#include "qd.h"

QD::QD() {
    stepperMotor = new StepperMotor(COIL1, COIL3);
}

QD::~QD(){
    delete stepperMotor;
}

bool QD::Actuate(){
    if (actuated){
        return false; // sensor did not actuate 
    }

    stepperMotor->Enable(); // enable sensor motor 
    stepperMotor->Rotate(stepperMotor->CLOCKWISE, 50); // Rotate the motor clockwise, 50ms time delay

    delay(60000); // We need 1200 steps

    stepperMotor->StopRotation(); // Holds in current location 
    stepperMotor->Disable();

    actuated = true;
    return actuated;
}

bool QD::isActuated(){
    return actuated;
}



