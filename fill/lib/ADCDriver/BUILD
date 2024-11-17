cc_library(
    name = "adc_driver",
    hdrs = ["Adafruit_ADS1015.h"],
    srcs  = ["Adafruit_ADS1015.cpp"], 
    deps = ["//fill/lib/MockWiringPi:mock_wiringpi"],
    includes = ["."],
    linkopts = ["-lwiringPi"],
    visibility = [
        "//fill:__subpackages__",
        ],
)