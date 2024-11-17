cc_library(
    name = "mock_wiringpi_lib",
    hdrs = [
        "wiringPi.h",
        "wiringPiI2C.h",
        ],
    srcs = [
        "wiringPi.c",
        "wiringPiI2C.c",
        ],
    includes = ["."],
    linkstatic = 0,
    visibility = [
        "//fill:__subpackages__",
    ],
)

cc_binary(
    name = "mock_wiringpi",
    srcs = [
        "wiringPi.c",
        "wiringPiI2C.c",
        ],
    deps = ["mock_wiringpi_lib",],
    includes = ["."],
    linkshared = True,
    visibility = [
        "//fill:__subpackages__",
    ],
)