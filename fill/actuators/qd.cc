#include "qd.h"

QD::QD(){
    actuating = false; 

    pinMode(PUL_PIN, OUTPUT); 
    pinMode(DIR_PIN, OUTPUT);
    pinMode(ENA_PIN, OUTPUT);

    // Disable the driver by setting the enable pin high
    digitalWrite(ENA_PIN, HIGH);
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

    // Clockwise rotation 
    digitalWrite(DIR_PIN, HIGH); 
    
    // will take two minutes to finish turning the motor 
    for (int i = 0; i < 1200; i++){
        digitalWrite(PUL_PIN, HIGH);
        delayMicroseconds(50); 
        digitalWrite(PUL_PIN, LOW);
        delayMicroseconds(50);  
    }

    actuating = false; 

    return;
}

bool QD::isActuating(){
    return actuating;
}