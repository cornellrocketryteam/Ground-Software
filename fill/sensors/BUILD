cc_library(
    name = "sensor",
    hdrs = ["sensor.h"],
    srcs = ["sensor.cc"],
    deps = [ "//fill/lib/ADCDriver:adc_driver",
            "//fill/lib/spdlog:spdlog", 
            ],
    visibility = [
        "//visibility:public",
        ],
)

cc_library(
    name = "mock_sensor",
    hdrs = ["mock_sensor.h"],
    deps = [
        ":sensor", 
        "@googletest//:gtest_main",
        ],
    visibility = [
        "//fill:__subpackages__",
        ],
)