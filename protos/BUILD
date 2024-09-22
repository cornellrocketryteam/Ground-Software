load("@com_github_grpc_grpc//bazel:cc_grpc_library.bzl", "cc_grpc_library")
load("@rules_proto//proto:defs.bzl", "proto_library")

package(default_visibility = ["//visibility:public"])

proto_library(
    name = "command_proto",
    srcs = ["command.proto"],
)

cc_proto_library(
    name = "command_cc_proto",
    deps = [":command_proto"],
)

cc_grpc_library(
    name = "command_cc_grpc",
    srcs = [":command_proto"],
    grpc_only = True,
    deps = [":command_cc_proto"],
)
