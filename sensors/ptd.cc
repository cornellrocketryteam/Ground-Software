#include "ptd.h"

float PTD::Read() {
  float reading = 3.14;
  cache_.push_back(reading);
  return reading;
}
