cc_library(
    name = "sensor",
    hdrs = ["sensor.h"],
    deps = [],
    visibility = [
        "//fill:__subpackages__",
        ],
)

cc_library(
    name = "load_cell",
    srcs = ["load_cell.cc"],
    hdrs = ["load_cell.h"],
    deps = [":sensor"],
    visibility = [
        "//fill:__subpackages__",
        ],
)

cc_library(
    name = "ptd",
    srcs = ["ptd.cc"],
    hdrs = ["ptd.h"],
    deps = [":sensor"],
    visibility = [
        "//fill:__subpackages__",
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