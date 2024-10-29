#ifndef FILL_TELEMETRY_READER_H_
#define FILL_TELEMETRY_READER_H_

#include "protos/command.pb.h"
#include "sensors/sensor.h"

using command::FillStationTelemetry;

class TelemetryReader {
  public:
    TelemetryReader(Sensor& sensor) : sensor_(sensor) {}
    FillStationTelemetry read();
  private:
    Sensor& sensor_;
};
#endif
