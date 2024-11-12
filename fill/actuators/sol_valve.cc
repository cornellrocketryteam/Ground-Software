#include <cstdio>
#include "sol_valve.h"

SolValve::SolValve(){
    wiringPiSetupGpio();
    pinMode(SV_SIGNAL, OUTPUT);

    // starting state set to low 
    digitalWrite(SV_SIGNAL, LOW);
    isOpen=false;
}

SolValve::~SolValve(){}



void SolValve::open(){
    printf("In open. Setting high");
    pinMode(SV_SIGNAL, OUTPUT);
    digitalWrite(SV_SIGNAL, HIGH);
    delay(150);
    printf("In open. Setting pwm");
    pinMode(SV_SIGNAL, PWM_OUTPUT);
    pwmWrite(SV_SIGNAL, 430); 
}
void SolValve::openAsync(){
    printf("In openAsync");
    if (isOpen){
        printf("Already open");
        return; // cannot actuate a sensor that is already actuating 
    }
    
    printf("Starting open thread");
    std::thread open_thread(&SolValve::open, this);
    open_thread.detach(); // we want to continue normal operation 

    return;
}
void SolValve::close(){
    printf("Closing");
    pinMode(SV_SIGNAL, OUTPUT);
    digitalWrite(SV_SIGNAL, LOW);
    isOpen=false;
}


