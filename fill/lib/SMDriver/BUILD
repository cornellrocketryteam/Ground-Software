cc_library(
    name = "smdriver",
    hdrs = ["steppermotor.h"],
    srcs  = ["steppermotor.cpp"], 
    deps = ["//fill/lib/MockWiringPi:mock_wiringpi"],
    includes = ["."],
    # copts = select({
    #     ":mock_wiringpi": ["-DMOCK_WIRINGPI"], # Define MOCK_WIRINGPI when using the mock
    #     "//conditions:default": [], # Empty for other cases (production)
    # }),
    linkopts = ["-lwiringPi"],
    visibility = [
        "//fill:__subpackages__",
        ],
)

cc_binary(
    name = "stepper_test",
    srcs = ["main.cpp"],
    deps = [":smdriver", "//fill/lib/MockWiringPi:mock_wiringpi"],
    # copts = select({
    #     ":mock_wiringpi_config": ["-DMOCK_WIRINGPI"],
    #     "//conditions:default": [],
    # }),
)

# config_setting(
#     name = "mock_wiringpi",
#     values = {"define": "mock_wiringpi=true"},
# )