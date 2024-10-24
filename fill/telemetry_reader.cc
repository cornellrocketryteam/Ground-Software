#include "telemetry_reader.h"

using command::FillStationTelemetry;
using command::RocketTelemetry;

FillStationTelemetry TelemetryReader::read() {
    FillStationTelemetry telem;
    telem.set_pt1(sensor_.Read());
    return telem;
}