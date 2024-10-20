#ifndef LOAD_CELL_H
#define LOAD_CELL_H

#define LC_CHANNEL 2

#include "sensor.h"

class LoadCell : public Sensor {
 public:
  uint16_t Read(Adafruit_ADS1015* adc);
};

#endif 