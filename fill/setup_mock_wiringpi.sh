#!/bin/bash
BINPATH=$(bazel cquery --output=files //fill/lib/MockWiringPi:mock_wiringpi $1)
sudo rm /usr/lib/libwiringPi.so
sudo cp $BINPATH /usr/lib/libwiringPi.so
export LD_LIBRARY_PATH=/usr/lib