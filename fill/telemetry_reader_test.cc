#include "telemetry_reader.h"

#include "gtest/gtest.h"

namespace {

TEST(TelemetryReaderTest, BasicTest) {
    TelemetryReader reader;
    Telemetry telem = reader.read();
    EXPECT_EQ(telem.temp(), "It works!");
}

} //namespace
