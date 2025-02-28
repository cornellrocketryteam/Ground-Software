cc_binary(
    name = "fill_station",
    srcs = ["fill_station.cc"],
    deps = [
        # PROTO DEFINITIONS 
        "//protos:command_cc_grpc",
        # ACTUATORS 
        "//fill/actuators:qd",
        "//fill/actuators:ball_valve",
        "//fill/actuators:sol_valve",
        "//fill/actuators:ignitor",
        # UMBILICAL
        "//fill/umbilical:rocket_proto_builder",
        # SENSORS 
        "//fill/sensors:sensor",
        # INFLUXDB STORAGE
        "//fill/storage:storage",
        # LOGGING 
        "//fill/lib/spdlog:spdlog",
        # GRPC 
        "@com_github_grpc_grpc//:grpc++",
        "@com_github_grpc_grpc//:grpc++_reflection",
    ],
    copts = ["-std=c++17"], # necessary for influxdb C++ interface 
)