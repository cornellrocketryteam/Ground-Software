#include "telemetry_reader.h"

using command::Telemetry;
using command::RocketTelemetry;

Telemetry TelemetryReader::read() {
    Telemetry telem;
    // TODO(Zach) add telemetry parameters
    RocketTelemetry* rocket_telem = telem.mutable_rock_telem();
    rocket_telem->set_temp(sensor_.Read());
    return telem;
}