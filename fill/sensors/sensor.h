#ifndef SENSORS_SENSOR_H_
#define SENSORS_SENSOR_H_

#include <vector>
#include "Adafruit_ADS1015.h"

class Sensor {
  public:
    // Read from the sensor 
    virtual uint16_t Read(Adafruit_ADS1015* adc) = 0;
  protected:
    // cache for rolling averages
    std::vector<uint16_t> cache_;
};
#endif