#include "telemetry_reader.h"
#include "sensors/mock_sensor.h"

#include <gmock/gmock.h>
#include <gtest/gtest.h>

namespace {

using ::testing::Return;

TEST(TelemetryReaderTest, BasicTest) {
    float test_val = 3.14;
    MockSensor sensor;
    EXPECT_CALL(sensor, Read()).Times(1).WillOnce(Return(test_val));
    TelemetryReader reader(sensor);
    Telemetry telem = reader.read();
    EXPECT_EQ(telem.temp(), 3);
}

} //namespace
