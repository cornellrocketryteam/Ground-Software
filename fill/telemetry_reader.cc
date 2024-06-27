#include "telemetry_reader.h"

using telemetry::Telemetry;

Telemetry TelemetryReader::read() {
    Telemetry telem;
    // TODO(Zach) add telemetry parameters
    telem.set_temp("It works!");
    return telem;
}