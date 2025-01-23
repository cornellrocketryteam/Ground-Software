#include "sensor.h"

Sensor::Sensor(){
    adc1 = new Adafruit_ADS1015(ADC1_ADDRESS);
    adc1->begin();
    adc1->setGain(GAIN_ONE);

    adc2 = new Adafruit_ADS1015(ADC2_ADDRESS);
    adc2->begin();
    adc2->setGain(GAIN_ONE);
}

float Sensor::Read(uint8_t channel, bool isADC1){
    uint16_t reading; 
    float voltage;

    if (isADC1){
        reading = adc1->readADC_SingleEnded(channel);
    } else {
        reading = adc2->readADC_SingleEnded(channel);
    }
    voltage = static_cast<float>(reading);
    printf("Reading from channel [%u] with voltage value: %f\n", channel, voltage);
    return voltage;
}