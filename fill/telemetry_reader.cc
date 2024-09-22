#include "telemetry_reader.h"

using command::Telemetry;

Telemetry TelemetryReader::read() {
    Telemetry telem;
    // TODO(Zach) add telemetry parameters
    telem.set_temp(sensor_.Read());
    return telem;
}