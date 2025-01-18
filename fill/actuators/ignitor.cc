#include "ignitor.h"

Ignitor::Ignitor(){
    wiringPiSetupGpio();
    pinMode(IG_0, OUTPUT);
    pinMode(IG_1, OUTPUT);

    // write low initially 
    digitalWrite(IG_0, LOW);
    digitalWrite(IG_1, LOW);
}

Ignitor::~Ignitor(){}

bool Ignitor::Actuate(){
    digitalWrite(IG_0, HIGH);
    digitalWrite(IG_1, HIGH);
    delay(1000);
    digitalWrite(IG_0, LOW);
    digitalWrite(IG_1, LOW);
}

bool Ignitor::isActuating(){}