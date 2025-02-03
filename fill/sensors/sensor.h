#ifndef SENSORS_SENSOR_H_
#define SENSORS_SENSOR_H_

#include <vector>
#include "Adafruit_ADS1015.h"
#include <spdlog/spdlog.h>

#define ADC1_ADDRESS 0x48
#define ADC2_ADDRESS 0x4A

#define PT1_CHANNEL 3
#define PT2_CHANNEL 2
#define LC_CHANNEL 0
#define IGN_1_CONT_CHANNEL 3 // change later
#define IGN_2_CONT_CHANNEL 2

#define ADC1_INDEX 0
#define ADC2_INDEX 1

class Sensor {
  public:
    // initializes the ADCs
    Sensor();
    virtual ~Sensor() {}

    float ReadPT1(); 
    float ReadPT2(); 
    float ReadLoadCell();

    float ReadIgnitorOneContinuity();
    float ReadIgnitorTwoContinuity();

  protected:
    // cache for rolling averages
    std::vector<float> cache_;

    float Read(uint8_t channel, uint8_t index);

    std::vector<Adafruit_ADS1015*> ADC_vector; 
};
#endif