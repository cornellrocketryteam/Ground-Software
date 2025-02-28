cc_library(
    name = "storage",
    srcs = ["storage.cc"],
    hdrs = ["storage.h"],
    deps = ["//fill/lib/spdlog:spdlog", 
            "//protos:command_cc_grpc"],
    includes = ["/usr/local/include/InfluxDB"],
    linkopts = ["-L/usr/local/lib","-lInfluxDB.1",],
    visibility = [
        "//fill:__subpackages__",
        ],
    copts = ["-std=c++17"],  # Enable C++17 for Influx DB 
)

cc_binary(
    name = "influx_test",
    deps = [":storage"],
    srcs = ["test.cc"],
    copts = ["-std=c++17"],# Need to fix this, shouldn't have to include this flag
)
# had to set $DYLD_LIBRARY_PATH to /usr/local/lib: