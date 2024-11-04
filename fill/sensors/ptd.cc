#include "ptd.h"

uint16_t PTD::Read(Adafruit_ADS1015* adc) {
    return adc->readADC_SingleEnded(PTD_CHANNEL);
}
