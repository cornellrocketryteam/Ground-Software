load(":cc_toolchain_config.bzl", "cc_toolchain_config")

package(default_visibility = ["//visibility:public"])

cc_toolchain_config(name = "linux_arm64_osx_toolchain_config")
filegroup(name = "empty")

cc_toolchain(
    name = "linux_arm64_osx_toolchain",
    all_files = ":empty",
    compiler_files = ":empty",
    dwp_files = ":empty",
    linker_files = ":empty",
    objcopy_files = ":empty",
    strip_files = ":empty",
    supports_param_files = 0,
    toolchain_config = ":linux_arm64_osx_toolchain_config",
    toolchain_identifier = "linux_arm64-osx_toolchain",
)

toolchain(
    name = "cc_osx_toolchain_for_linux_arm64",
    exec_compatible_with = [
        "@platforms//cpu:aarch64",
        "@platforms//os:osx",
    ],
    target_compatible_with = [
        "@platforms//cpu:aarch64",
        "@platforms//os:linux",
    ],
    toolchain = ":linux_arm64_osx_toolchain",
    toolchain_type = "@bazel_tools//tools/cpp:toolchain_type",
)