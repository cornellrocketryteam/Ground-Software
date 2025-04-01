#include "ball_valve.h"

BallValve::BallValve(){
    wiringPiSetupGpio();
    
    pinMode(BV_ON_OFF, OUTPUT);
    pinMode(BV_SIGNAL, OUTPUT);

    // starting state set to low 
    digitalWrite(BV_ON_OFF, LOW);
    digitalWrite(BV_SIGNAL, LOW);

    spdlog::info("BV: Initialized");
}

BallValve::~BallValve(){}

void BallValve::powerOff(){
    spdlog::info("BV: Turning off");
    digitalWrite(BV_ON_OFF, HIGH);
}

void BallValve::powerOn(){
    spdlog::info("BV: Turning on");
    digitalWrite(BV_ON_OFF, LOW);
}

void BallValve::open(){
    spdlog::info("BV: Opening");
    digitalWrite(BV_SIGNAL, HIGH);
}

void BallValve::close(){
    spdlog::info("BV: Closing");
    digitalWrite(BV_SIGNAL, LOW);
}


