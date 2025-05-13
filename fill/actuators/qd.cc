#include "qd.h"

QD::QD(){
    actuating = false; 

    wiringPiSetupGpio();

    pinMode(PUL_PIN, OUTPUT); 
    pinMode(DIR_PIN, OUTPUT);
    pinMode(ENA_PIN, OUTPUT);

    pullUpDnControl(PUL_PIN, PUD_DOWN);
    pullUpDnControl(DIR_PIN, PUD_DOWN);
    pullUpDnControl(ENA_PIN, PUD_DOWN);

    // Disable the driver by setting the enable pin low
    digitalWrite(ENA_PIN, LOW);
    // pulse should be default high
    digitalWrite(PUL_PIN, HIGH); 

    digitalWrite(DIR_PIN, HIGH); // default clockwise 

    spdlog::info("QD: Initialized");
}

QD::~QD(){}

bool QD::Actuate(){
    spdlog::info("QD: Actuating");

    if (actuating) {
        spdlog::error("QD: Already actuating");
        return false; // cannot actuate a sensor that is already actuating 
    }

    std::thread actuate_thread(&QD::turnMotor, this);
    actuate_thread.detach(); // we want to continue normal operation 

    return true; // Has been actuated successfully 
}

void QD::turnMotor(){
    actuating = true; 

    // Enable the driver 
    digitalWrite(ENA_PIN, HIGH);
    delay(201); // necessary to set enable correctly 
    
    for (int step = 0; step < 7000; step++) {
        // Generate one pulse with 50% duty cycle
        digitalWrite(PUL_PIN, LOW);  
        delayMicroseconds(350);             
        digitalWrite(PUL_PIN, HIGH);  
        delayMicroseconds(350);                
    }

    digitalWrite(ENA_PIN, LOW);
    actuating = false; 

    return;
}

bool QD::isActuating(){
    return actuating;
}