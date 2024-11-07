#include "ball_valve.h"

BallValve::BallValve(){
    wiringPiSetupGpio();
    
    pinMode(BV_ON_OFF, OUTPUT);
    pinMode(BV_SIGNAL, OUTPUT);

    // starting state set to low 
    digitalWrite(BV_ON_OFF, LOW);
    digitalWrite(BV_SIGNAL, LOW);
}

BallValve::~BallValve(){}

void BallValve::powerOff(){
    digitalWrite(BV_ON_OFF, HIGH);
}

void BallValve::powerOn(){
    digitalWrite(BV_ON_OFF, LOW);
}

void BallValve::open(){
    digitalWrite(BV_SIGNAL, HIGH);
}

void BallValve::close(){
    digitalWrite(BV_SIGNAL, LOW);
}


