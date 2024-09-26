cc_library(
    name = "actuator",
    hdrs = ["actuator.h"],
    deps = [],
    visibility = [
        "//fill:__subpackages__",
        "//ground:__subpackages__",
        ],
)

cc_library(
    name = "ball_valve",
    srcs = ["ball_valve.cc"],
    hdrs = ["ball_valve.h"],
    deps = [":actuator"],
    visibility = [
        "//fill:__subpackages__",
        "//ground:__subpackages__",
        ],
)

cc_library(
    name = "sol_valve",
    srcs = ["sol_valve.cc"],
    hdrs = ["sol_valve.h"],
    deps = [":actuator"],
    visibility = [
        "//fill:__subpackages__",
        "//ground:__subpackages__",
        ],
)