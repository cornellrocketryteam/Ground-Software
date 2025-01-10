""" Toolchain for cross-compiling from aarch64 osx to arm linux (e.g. Raspi) """

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
            path = "/opt/homebrew/bin/aarch64-unknown-linux-gnu-gcc-13.3.0",
        ),
        tool_path(
            name = "ld",
            path = "/bin/false",
        ),
        tool_path(
            name = "ar",
            path = "/opt/homebrew/bin/aarch64-unknown-linux-gnu-gcc-ar",
        ),
        tool_path(
            name = "cpp",
            path = "/bin/false",
        ),
        tool_path(
            name = "gcov",
            path = "/bin/false",
        ),
        tool_path(
            name = "nm",
            path = "/bin/false",
        ),
        tool_path(
            name = "objdump",
            path = "/bin/false",
        ),
        tool_path(
            name = "strip",
            path = "/bin/false",
        ),
    ]

    features = [
        feature(
            name = "default_linker_flags",
            enabled = True,
            flag_sets = [
                flag_set(
                    actions = all_link_actions,
                    flag_groups = ([
                        flag_group(
                            flags = [
                                "-lstdc++",
                            ],
                        ),
                    ]),
                ),
            ],
        ),
    ]

    return cc_common.create_cc_toolchain_config_info(
        ctx = ctx,
        features = features,
        cxx_builtin_include_directories = [
            "/opt/homebrew/Cellar/aarch64-unknown-linux-gnu/13.3.0/toolchain/aarch64-unknown-linux-gnu/sysroot/usr/include/",
            "/opt/homebrew/Cellar/aarch64-unknown-linux-gnu/13.3.0/toolchain/lib/gcc/aarch64-unknown-linux-gnu/13.3.0/include/",
            "/opt/homebrew/Cellar/aarch64-unknown-linux-gnu/13.3.0/toolchain/aarch64-unknown-linux-gnu/include/c++/13.3.0", 
            "/usr/include",
            "/opt/homebrew/include", 
        ],
        toolchain_identifier = "local",
        host_system_name = "local",
        target_system_name = "local",
        target_cpu = "aarch64",
        target_libc = "unknown",
        compiler = "aarch64-unknown-linux-gnu-gcc-13.3.0",
        abi_version = "unknown",
        abi_libc_version = "unknown",
        tool_paths = tool_paths,
    )

cc_toolchain_config = rule(
    implementation = _impl,
    attrs = {},
    provides = [CcToolchainConfigInfo],
)
