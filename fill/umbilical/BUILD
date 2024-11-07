cc_library(
    name = "rocket_proto_builder",
    srcs = ["proto_build.cc"],
    hdrs = ["proto_build.h"],
    deps = [
        "//protos:command_cc_grpc",
        "@com_github_grpc_grpc//:grpc++",
        "@com_github_grpc_grpc//:grpc++_reflection",
    ],
    visibility = [
        "//fill:__subpackages__",
        ],
)