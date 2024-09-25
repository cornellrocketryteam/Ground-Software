#ifndef SENSORS_SENSOR_H_
#define SENSORS_SENSOR_H_

#include <vector>

class Sensor {
  public:
    virtual Sensor() {}
    virtual ~Sensor() {}
    virtual float Read() = 0;
  protected:
    // cache for rolling averages
    std::vector<float> cache_;
};
#endif
