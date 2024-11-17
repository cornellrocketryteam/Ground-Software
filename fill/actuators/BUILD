cc_library(
    name = "actuator",
    hdrs = ["actuator.h"],
    deps = [],
    includes = ["/usr/local/lib"],
    visibility = [
        "//fill:__subpackages__",
        ],
)

cc_library(
    name = "qd",
    srcs = ["qd.cc"],
    hdrs = ["qd.h"],
    deps = [":actuator", "//fill/lib/SMDriver:smdriver"],
    visibility = [
        "//fill:__subpackages__",
        ],
)

cc_library(
    name = "ball_valve",
    hdrs = ["ball_valve.h"],
    srcs  = ["ball_valve.cc"], 
    deps = ["//fill/lib/MockWiringPi:mock_wiringpi"],
    includes = ["."],
    linkopts = ["-lwiringPi"],
    visibility = [
        "//fill:__subpackages__",
        ],
)

cc_library(
    name = "sol_valve",
    srcs = ["sol_valve.cc"],
    hdrs = ["sol_valve.h"],
    deps = ["//fill/lib/MockWiringPi:mock_wiringpi"],
    includes = ["."],
    linkopts = ["-lwiringPi"],
    visibility = [
        "//fill:__subpackages__",
        ],
)