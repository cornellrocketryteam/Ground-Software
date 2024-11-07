#ifndef BALL_VALVE_H
#define BALL_VALVE_H

#define BV_SIGNAL 23
#define BV_ON_OFF 24

#include "wiringPi.h"

class BallValve {
    private:
        
    public: 
        BallValve();
        ~BallValve();
        
        void powerOff();
        void powerOn();

        void open();
        void close();
};

#endif