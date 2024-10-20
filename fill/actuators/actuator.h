#ifndef ACTUATOR_H
#define ACTUATOR_H

class Actuator {
public: 
    // Actuates the actuator 
    virtual bool Actuate() = 0;
    
    // Returns actuating
    virtual bool isActuating() = 0; 
protected:
    bool actuating;
};

#endif 
