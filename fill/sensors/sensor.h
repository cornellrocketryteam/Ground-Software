#ifndef SENSORS_SENSOR_H_
#define SENSORS_SENSOR_H_

#include <vector>
#include "Adafruit_ADS1015.h"

#define ADC1_ADDRESS 0x48
#define ADC2_ADDRESS

#define PT1_CHANNEL 3
#define PT2_CHANNEL 2
#define LC_CHANNEL 0

class Sensor {
  public:
    // initializes the ADC
    Sensor();
    virtual ~Sensor() {}

    float Read(uint8_t channel, bool isADC1);
  protected:
    // cache for rolling averages
    std::vector<float> cache_;

    Adafruit_ADS1015 *adc1;
    Adafruit_ADS1015 *adc2;
};
#endif