cc_binary(
    name = "fill_station",
    srcs = ["fill_station.cc"],
    deps = [
        "//protos:command_cc_grpc",
        "//fill/sensors:ptd",
        "//fill/actuators:qd",
        "@abseil-cpp//absl/flags:flag",
        "@abseil-cpp//absl/flags:parse",
        "@abseil-cpp//absl/strings:str_format",
        "@com_github_grpc_grpc//:grpc++",
        "@com_github_grpc_grpc//:grpc++_reflection",
    ],
)
