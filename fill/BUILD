cc_binary(
    name = "fill_station",
    srcs = ["fill_station.cc"],
    deps = [
        "//protos:command_cc_grpc",
        "//fill/actuators:qd",
        "//fill/actuators:ball_valve",
        "//fill/umbilical:rocket_proto_builder",
        "//fill/actuators:sol_valve",
        "//fill/actuators:ignitor",
        "//fill/sensors:sensor",
        "//fill/lib/spdlog:spdlog",
        "@abseil-cpp//absl/flags:flag",
        "@abseil-cpp//absl/flags:parse",
        "@abseil-cpp//absl/strings:str_format",
        "@com_github_grpc_grpc//:grpc++",
        "@com_github_grpc_grpc//:grpc++_reflection",
    ],
)