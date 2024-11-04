#include <iostream>
#include <unistd.h> // for usleep
#include "steppermotor.h"

using namespace std;

int main() {
    // Initialize the stepper motor (adjust pin numbers as needed)
    StepperMotor motor(1, 3, false); // Assuming a two-coil setup (1,3)

    // Example Usage
    cout << "Rotating 10 steps clockwise..." << endl;
    motor.Rotate(StepperMotor::CLOCKWISE, 10, 1000); // 10 steps, 1000ms delay
    usleep(2000000); //Pause for 2 seconds


    cout << "Rotating 15 steps counter-clockwise..." << endl;
    motor.Rotate(StepperMotor::CTRCLOCKWISE, 15, 1000); // 15 steps, 1000ms delay
    usleep(2000000); //Pause for 2 seconds

    cout << "Stopping rotation..." << endl;
    motor.StopRotation();

    //Add other tests as necessary, for example:
    cout << "Enabling the motor..." << endl;
    motor.Enable();
    usleep(1000000); //Pause for 1 second

    cout << "Disabling the motor..." << endl;
    motor.Disable();

    cout << "Test complete." << endl;
    return 0;
}