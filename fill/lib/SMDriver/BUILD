cc_library(
    name = "smdriver",
    hdrs = ["steppermotor.h"],
    srcs  = ["steppermotor.cpp"], 
    deps = ["//fill/lib/MockWiringPi:mock_wiringpi"],
    includes = ["."],
    linkopts = ["-lwiringPi"],
    visibility = [
        "//fill:__subpackages__",
        ],
)

cc_binary(
    name = "stepper_test",
    srcs = ["main.cpp"],
    deps = [":smdriver", "//fill/lib/MockWiringPi:mock_wiringpi"],
)