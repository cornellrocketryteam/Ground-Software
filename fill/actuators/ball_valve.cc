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
    spdlog::info("Powering off the Ball Valve\n");
    digitalWrite(BV_ON_OFF, HIGH);
}

void BallValve::powerOn(){
    spdlog::info("Powering on the Ball Valve\n");
    digitalWrite(BV_ON_OFF, LOW);
}

void BallValve::open(){
    spdlog::info("Opening the Ball Valve\n");
    digitalWrite(BV_SIGNAL, HIGH);
}

void BallValve::close(){
    spdlog::info("Closing the Ball Valve\n");
    digitalWrite(BV_SIGNAL, LOW);
}


