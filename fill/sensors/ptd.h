#ifndef PTD_H
#define PTD_H

#define PTD_CHANNEL 1

#include "sensor.h"

class PTD : public Sensor {
 public:
  uint16_t Read(Adafruit_ADS1015* adc);
};

#endif 