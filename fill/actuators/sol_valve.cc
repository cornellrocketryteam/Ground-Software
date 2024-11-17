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
    pinMode(SV_SIGNAL, OUTPUT);
    digitalWrite(SV_SIGNAL, HIGH);
    delay(150);
    pwmSetMode(PWM_MODE_MS);
    pwmSetClock(2);
    pwmSetRange(4096);
    pinMode(SV_SIGNAL, PWM_MS_OUTPUT);
    pwmWrite(SV_SIGNAL, 1707); 
}
void SolValve::openAsync(){
    if (isOpen){
     return; // cannot actuate a sensor that is already actuating 
    }

    std::thread open_thread(&SolValve::open, this);
    open_thread.detach(); // we want to continue normal operation 

    return;
}
void SolValve::close(){
    pinMode(SV_SIGNAL, OUTPUT);
    digitalWrite(SV_SIGNAL, LOW);
    isOpen=false;
}