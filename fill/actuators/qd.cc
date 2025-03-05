#include "qd.h"

QD::QD(){
    actuating = false; 

    pinMode(PUL_PIN, OUTPUT); 
    pinMode(DIR_PIN, OUTPUT);
    pinMode(ENA_PIN, OUTPUT);

    wiringPiSetupGpio();

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
    
    pinMode(PUL_PIN, OUTPUT);

    // avoiding pwm for now just to test qd 
    for (int step = 0; step < 1200; step++) {
        // Generate one pulse with 50% duty cycle at 20 Hz:
        digitalWrite(PUL_PIN, HIGH);  
        delay(25);             
        digitalWrite(PUL_PIN, LOW);  
        delay(25);                
    }

    actuating = false; 

    return;
}

bool QD::isActuating(){
    return actuating;
}