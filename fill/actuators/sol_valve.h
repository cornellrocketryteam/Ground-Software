#ifndef SOL_VALVE_H
#define SOL_VALVE_H

#define SV_SIGNAL 13

#include <thread>
#include "wiringPi.h"
#include <spdlog/spdlog.h>


class SolValve {
    private:
        bool isOpen; 
        void open();
        
    public: 
        SolValve();
        ~SolValve();
        

        void openAsync();
        void close();
};

#endif