#include "sensor.h"

Sensor::Sensor(){
    Adafruit_ADS1015* adc1 = new Adafruit_ADS1015(ADC1_ADDRESS);
    adc1->begin();
    adc1->setGain(GAIN_ONE);

    ADC_vector.push_back(adc1); 

    Adafruit_ADS1015* adc2 = new Adafruit_ADS1015(ADC2_ADDRESS);
    adc2->begin();
    adc2->setGain(GAIN_ONE);

    ADC_vector.push_back(adc2);
}

float Sensor::Read(uint8_t channel, uint8_t index){
    uint16_t reading; 
    float voltage;

    reading = ADC_vector[index]->readADC_SingleEnded(channel);
    voltage = static_cast<float>(reading);
    return voltage;
}

float Sensor::ReadPT1(){
    float voltage = Read(PT1_CHANNEL, ADC1_INDEX);

    return 1000*voltage/1349; 
}

float Sensor::ReadPT2(){
    float voltage = Read(PT2_CHANNEL, ADC1_INDEX);

    return 1000*voltage/1338;
}

float Sensor::ReadLoadCell(){
    float voltage = Read(LC_CHANNEL, ADC1_INDEX);

    // TODO: Update after load cell calibration 
    return voltage; 
}