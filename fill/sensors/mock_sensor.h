#ifndef SENSORS_MOCK_SENSOR_H_
#define SENSORS_MOCK_SENSOR_H_

#include "sensor.h"

#include <gmock/gmock.h>  // Brings in gMock.

class MockSensor : public Sensor {
 public:
  MOCK_METHOD(float, Read, (), (override));
};
#endif
