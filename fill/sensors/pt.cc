#include "pt.h"

PT::PT(int address, uint8_t adc_channel) {
  adc = new Adafruit_ADS1015(address);
  adc->begin();
  adc->setGain(GAIN_ONE);
  channel = adc_channel;
}

float PT::Read() {
  uint16_t reading = adc->readADC_SingleEnded(channel);
  // TODO: Convert reading to voltage
  float voltage = static_cast<float>(reading);
  cache_.push_back(voltage);
  return voltage;
}