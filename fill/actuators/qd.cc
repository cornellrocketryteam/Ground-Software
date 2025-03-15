#include "qd.h"

QD::QD(){
    actuating = false; 

    wiringPiSetupGpio();

    pinMode(PUL_PIN, OUTPUT); 
    pinMode(DIR_PIN, OUTPUT);
    pinMode(ENA_PIN, OUTPUT);

    // TEMPORARY FIX: Set ENABLE to HIGH on default, b/c arduino will rely on falling edge 
    digitalWrite(ENA_PIN, HIGH);
    // pulse should be default high
    digitalWrite(PUL_PIN, HIGH); 

    digitalWrite(DIR_PIN, HIGH); // default clockwise 
}

QD::~QD(){}

bool QD::Actuate(){
    spdlog::info("Actuating the QD\n");
    if (actuating){
        return false; // cannot actuate a sensor that is already actuating 
    }

    std::thread actuate_thread(&QD::turnMotor, this);
    actuate_thread.detach(); // we want to continue normal operation 

    return true; // Has been actuated successfully 
}

void QD::turnMotor(){
    actuating = true; 

    // Enable the driver 
    digitalWrite(ENA_PIN, LOW);

    delay(500); 

    digitalWrite(ENA_PIN, HIGH);
    actuating = false; 

    return;
}

bool QD::isActuating(){
    return actuating;
}