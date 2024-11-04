#include "load_cell.h"

uint16_t LoadCell::Read(Adafruit_ADS1015* adc) {
    return adc->readADC_SingleEnded(LC_CHANNEL);
}
