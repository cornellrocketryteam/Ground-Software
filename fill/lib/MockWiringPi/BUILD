cc_library(
    name = "mock_wiringpi_lib",
    hdrs = ["wiringPi.h"],
    srcs = ["wiringPi.c"],
    includes = ["."],
    linkstatic = 0, # make it clear that it's not statically linked
    # linkshared = True,
    visibility = [
        "//fill:__subpackages__",
    ],
)

cc_binary(
    name = "mock_wiringpi",
    srcs = ["wiringPi.c"],
    deps = ["mock_wiringpi_lib",],
    includes = ["."],
    # linkstatic = 0, # make it clear that it's not statically linked
    linkshared = True,
    visibility = [
        "//fill:__subpackages__",
    ],
)