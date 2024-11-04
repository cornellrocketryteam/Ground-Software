#ifndef ACTUATOR_H
#define ACTUATOR_H

class Actuator {
public: 
    /* Actuates the actuator. 
    Returns true if activation is successful, and false otherwise. 
    Sets isActuating to true if activation is successful.*/  
    virtual bool Actuate() = 0;
    
    /* Returns isActuating */
    virtual bool isActuated() = 0; 
protected:
    bool isActuating;
};

#endif 
