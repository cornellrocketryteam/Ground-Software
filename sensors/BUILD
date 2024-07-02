cc_library(
    name = "sensor",
    hdrs = ["sensor.h"],
    deps = [],
    visibility = [
        "//fill:__subpackages__",
        "//ground:__subpackages__",
        ],
)

cc_library(
    name = "ducer",
    srcs = ["ducer.cc"],
    hdrs = ["ducer.h"],
    deps = [":sensor"],
    visibility = [
        "//fill:__subpackages__",
        "//ground:__subpackages__",
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
        "//ground:__subpackages__",
        ],
)