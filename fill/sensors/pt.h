#include "sensor.h"
#include "Adafruit_ADS1015.h"

class PT : public Sensor {
 public:
  PT(int address, uint8_t adc_channel);
  float Read();
 private:
  Adafruit_ADS1015 *adc;
  uint8_t channel;
};