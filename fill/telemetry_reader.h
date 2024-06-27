#include "protos/telemetry.pb.h"

using telemetry::Telemetry;

class TelemetryReader {
 public:
    Telemetry read();
};