#!/bin/bash
# Move the mock_wiringpi library to the standard linking path on your system

if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    LIBRARY_PATH="/usr/local/lib"
    LIBRARY_NAME="libwiringPi.dylib"
else
    # Assume Linux otherwise
    LIBRARY_PATH="/usr/lib"
    LIBRARY_NAME="libwiringPi.so"
fi

BINPATH=$(bazel cquery --output=files //fill/lib/MockWiringPi:mock_wiringpi $1)

sudo rm -f "$LIBRARY_PATH/$LIBRARY_NAME"
sudo cp "$BINPATH" "$LIBRARY_PATH/$LIBRARY_NAME"

export LD_LIBRARY_PATH="$LIBRARY_PATH"

echo "Library updated and set at $LIBRARY_PATH/$LIBRARY_NAME"