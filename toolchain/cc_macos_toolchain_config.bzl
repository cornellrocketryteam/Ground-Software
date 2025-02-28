""" Toolchain for cross-compiling from macOS to arm-unknown-linux-gnueabihf """

load("@bazel_tools//tools/build_defs/cc:action_names.bzl", "ACTION_NAMES")
load(
    "@bazel_tools//tools/cpp:cc_toolchain_config_lib.bzl",
    "feature",
    "flag_group",
    "flag_set",
    "tool_path",
)

all_link_actions = [
    ACTION_NAMES.cpp_link_executable,
    ACTION_NAMES.cpp_link_dynamic_library,
    ACTION_NAMES.cpp_link_nodeps_dynamic_library,
]

def _impl(ctx):
    tool_paths = [
        tool_path(
            name = "gcc",
            path = "/opt/homebrew/bin/arm-unknown-linux-gnueabihf-gcc",  
        ),
        tool_path(
            name = "g++",
            path = "/opt/homebrew/bin/arm-unknown-linux-gnueabihf-g++",  
        ),
        tool_path(
            name = "ld",
            path = "/opt/homebrew/bin/arm-unknown-linux-gnueabihf-ld",  
        ),
        tool_path(
            name = "ar",
            path = "/opt/homebrew/bin/arm-unknown-linux-gnueabihf-ar",  
        ),
        tool_path(
            name = "cpp",
            path = "/opt/homebrew/bin/arm-unknown-linux-gnueabihf-cpp",  
        ),
        tool_path(
            name = "nm",
            path = "/opt/homebrew/bin/arm-unknown-linux-gnueabihf-nm",  
        ),
        tool_path(
            name = "objdump",
            path = "/opt/homebrew/bin/arm-unknown-linux-gnueabihf-objdump",  
        ),
        tool_path(
            name = "strip",
            path = "/opt/homebrew/bin/arm-unknown-linux-gnueabihf-strip",  
        ),
    ]

    features = [
        feature(
            name = "default_linker_flags",
            enabled = True,
            flag_sets = [
                flag_set(
                    actions = all_link_actions,
                    flag_groups = [
                        flag_group(
                            flags = [
                                "-lstdc++",
                                "-L/usr/local/lib",
                                "-latomic",
                                 "-std=c++17",
                            ],
                        ),
                    ],
                ),
            ],
        ),
    ]

    return cc_common.create_cc_toolchain_config_info(
        ctx = ctx,
        features = features,
        cxx_builtin_include_directories = [
            "/opt/homebrew/Cellar/arm-unknown-linux-gnueabihf/11.2.0/toolchain/lib/gcc/arm-unknown-linux-gnueabihf/11.2.0/include-fixed/",
            "/opt/homebrew/Cellar/arm-unknown-linux-gnueabihf/11.2.0/toolchain/arm-unknown-linux-gnueabihf/sysroot/usr/include",
            "/opt/homebrew/Cellar/arm-unknown-linux-gnueabihf/11.2.0/toolchain/lib/gcc/arm-unknown-linux-gnueabihf/11.2.0/include/",
            "/opt/homebrew/Cellar/arm-unknown-linux-gnueabihf/11.2.0/toolchain/arm-unknown-linux-gnueabihf/include/c++/11.2.0",
            "/usr/local/include"
        ],
        toolchain_identifier = "arm_unknown_linux_gnu_toolchain",
        host_system_name = "macos",
        target_system_name = "linux",
        target_cpu = "arm",
        target_libc = "unknown",
        compiler = "arm-unknown-linux-gnueabihf-gcc",
        abi_version = "unknown",
        abi_libc_version = "unknown",
        tool_paths = tool_paths,
    )

cc_macos_toolchain_config = rule(
    implementation = _impl,
    attrs = {},
    provides = [CcToolchainConfigInfo],
)
