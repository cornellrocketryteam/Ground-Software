cc_library(
    name = "telemetry_reader",
    srcs = ["telemetry_reader.cc"],
    hdrs = ["telemetry_reader.h"],
    deps = [
        "//protos:command_cc_proto",
        "//sensors:sensor"],
)

cc_test(
    name = "telemetry_reader_test",
    size = "small",
    srcs = ["telemetry_reader_test.cc"],
    deps = [
        ":telemetry_reader",
        "//sensors:mock_sensor",
        "@googletest//:gtest_main",
    ],
)

cc_binary(
    name = "fill_station",
    srcs = ["fill_station.cc"],
    deps = [
        ":telemetry_reader",
        "//protos:command_cc_grpc",
        "//sensors:ducer",
        "@abseil-cpp//absl/flags:flag",
        "@abseil-cpp//absl/flags:parse",
        "@abseil-cpp//absl/strings:str_format",
        "@com_github_grpc_grpc//:grpc++",
        "@com_github_grpc_grpc//:grpc++_reflection",
    ],
)
