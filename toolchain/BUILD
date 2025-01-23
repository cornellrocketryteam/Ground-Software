load(":cc_linux_toolchain_config.bzl", "cc_linux_toolchain_config")
load(":cc_macos_toolchain_config.bzl", "cc_macos_toolchain_config")

package(default_visibility = ["//visibility:public"])

cc_linux_toolchain_config(
    name = "linux_arm64_toolchain_config"
)

cc_macos_toolchain_config(
    name = "macos_arm64_toolchain_config"
)

filegroup(name = "empty")

# Linux toolchain

cc_toolchain(
    name = "linux_arm64_toolchain",
    all_files = ":empty",
    compiler_files = ":empty",
    dwp_files = ":empty",
    linker_files = ":empty",
    objcopy_files = ":empty",
    strip_files = ":empty",
    supports_param_files = 0,
    toolchain_config = ":linux_arm64_toolchain_config",
    toolchain_identifier = "linux_arm64-toolchain",
)

toolchain(
    name = "cc_toolchain_for_linux_arm64",
    exec_compatible_with = [
        "@platforms//cpu:x86_64",
        "@platforms//os:linux",
    ],
    target_compatible_with = [
        "@platforms//cpu:aarch64",
        "@platforms//os:linux",
    ],
    toolchain = ":linux_arm64_toolchain",
    toolchain_type = "@bazel_tools//tools/cpp:toolchain_type",
)

# macOS toolchain

cc_toolchain(
    name = "macos_arm64_toolchain",
    all_files = ":empty",
    compiler_files = ":empty",
    dwp_files = ":empty",
    linker_files = ":empty",
    objcopy_files = ":empty",
    strip_files = ":empty",
    supports_param_files = 0,
    toolchain_config = ":macos_arm64_toolchain_config",
    toolchain_identifier = "macos_arm64-toolchain",
)

toolchain(
    name = "cc_toolchain_for_macos_arm64",
    exec_compatible_with = [
        "@platforms//cpu:arm64",
        "@platforms//os:macos",
    ],
    target_compatible_with = [
        "@platforms//cpu:aarch64",
        "@platforms//os:linux",
    ],
    toolchain = ":macos_arm64_toolchain",
    toolchain_type = "@bazel_tools//tools/cpp:toolchain_type",
)
