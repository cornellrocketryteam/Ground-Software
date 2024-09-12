# Ground-Software
Ground Support Equipment Software for the Cornell Rocketry Team including fill station and ground server

## Ground Server

First, install Docker for your specific computer. Then, to start the ground server run:
```shell
docker pull ghcr.io/cornellrocketryteam/ground-server
docker run -it -d -p 80:80 ghcr.io/cornellrocketryteam/ground-server
```

## Fix and Format Bazel files
Buildifier will fix a lot and format all bazel files by running

```bazel run //:buildifier.fix```

## Installation and Native Compilation Guide for Linux/WSL
FOR x86 LINUX OR WSL (NOT RASPBERRY PI)
1. Install bazel: 

```sudo apt install bazel```
 
2. Check version (tested with version 7.1.1): 

```bazel --version```
 
Clone Fill-Station repository: 

```git clone https://github.com/cornellrocketryteam/Fill-Station.git```

```cd Fill-Station```
 
## Build services (this will take longer the first time: ~5 minutes for me)
### Build ground

```bazel build ground:all```
 
### Build fill (this will be much faster since dependencies were built in the previous step)

```bazel build fill:all```
 
## After building, can run with

```bazel run ground:all -- --server_port=<port>```

50051 is default

```bazel run fill:all -- --client_target="<hostname>:<port>"```

localhost:50051 is default
 
## For example:

```bazel run ground:all -- --server_port=50052```

```bazel run fill:all -- --client_target="localhost:50052"```

## Cross Compilation Guide (Build for Raspberry Pi from your laptop!)
1. Follow all the Linux/WSL instructions to install Bazel and build natively
 
2. Install the gcc cross compiler:

```sudo apt install gcc-11-arm-linux-gnueabihf```
 
3. Cross compile services (this will take longer the first time: ~9 minutes for me)
## Build ground. Note this needs both arguments for some reason due to an issue with the absl library :(
```bazel build ground:all --platforms=platform:rpi4 --cpu="aarch64"```
 
## Build fill (this will be much faster since dependencies were built in the previous step)
```bazel build fill:all --platforms=platform:rpi4 --cpu="aarch64"```
 
## After building, copy the binaries over to the raspberry pis
There are many ways to do this, but I prefer to directly connect it with an ethernet cable, then configure my laptop to have a static ip of 192.168.1.202 (no DHCP), then run:
 
```cd <path to>/Fill-Station```

Copy to Pis. Note scp does not overwrite the files, so you have to delete/rename them on the pi first.
 
```scp bazel-bin/fill/fill_station crt@192.168.1.201:/home/crt/Desktop```

```scp bazel-bin/ground/ground_station crt@192.168.1.200:/home/crt/Desktop```
 
To run on pis, we must make sure they have the correct loader, "/lib/ld-linux-armhf.so.3" If they do not, you may see an error such as "cannot execute: required file not found"
 
## Can run from pis with
```cd ~/Desktop```

```./ground_station --server_port=<port>```

```./fill_station --client_target="<hostname>:<port>"```
 
## I setup a script to do this, so another option is:

```./start_ground_station```

```./start_fill_station```
 
## For example:

```./ground_station --server_port=50052```

```./fill_station --client_target="ground:50052"```

## Native Installation Guide for Raspberry Pis (PREFER CROSS COMPILATION)
FOR RASPBERRY PI (and other arm processors)
Install bazel via bazelisk
1. Install bazelisk

```pushd ~/Downloads```

```wget https://github.com/bazelbuild/bazelisk/releases/download/v1.19.0/bazelisk-linux-arm64```

```chmod +x bazelisk-linux-arm64```

```sudo mv bazelisk-linux-amd64 /usr/local/bin/bazel```
 
2. Install bazel (tested with version 7.1.1)

```bazel --version```
 
3. Clone Fill-Station repository

```popd```

```git clone https://github.com/cornellrocketryteam/Fill-Station.git```

```cd Fill-Station```
 
## Build services (this will take a VERY long time (~1 HOUR) but only the first time)
### Build ground
The discard_analysis_cache flag limits ram usage to prevent Pi 4 crashing

```bazel build ground:all --discard_analysis_cache```
 
### Build fill (this will be much faster since dependencies were built in the previous step)
```bazel build fill:all --discard_analysis_cache```
 
After building, run as in the native linux installation instructions above.
