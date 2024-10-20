#include "wiringPi.h"
#include <stdio.h>
#include <unistd.h>

int wiringPiSetup(void) {
    printf("[MOCK] wiringPiSetup called\n");
    return 0;
}

int wiringPiSetupSys(void) {
    printf("[MOCK] wiringPiSetupSys called\n");
    return 0;
}

int wiringPiSetupGpio(void) {
    printf("[MOCK] wiringPiSetupGpio called\n");
    return 0;
}

int wiringPiSetupPhys(void) {
    printf("[MOCK] wiringPiSetupPhys called\n");
    return 0;
}

void pinMode(int pin, int mode) {
    printf("[MOCK] pinMode called, pin: %d, mode: %d\n", pin, mode);
}

void digitalWrite(int pin, int value) {
    printf("[MOCK] digitalWrite called, pin: %d, value: %d\n", pin, value);
}

int digitalRead(int pin) {
    printf("[MOCK] digitalRead called, pin: %d\n", pin);
    return 0;
}

void pullUpDnControl(int pin, int pud) {
    printf("[MOCK] pullUpDnControl called, pin: %d, pud: %d\n", pin, pud);
}

void delay(unsigned int howLong) {
    printf("[MOCK] delay called, howLong: %u (usleep used in mock)\n", howLong);
    usleep(howLong * 1000); 
}

void delayMicroseconds(unsigned int howLong) {
    printf("[MOCK] delayMicroseconds called, howLong: %u\n", howLong);
    usleep(howLong);
}

// ... Add other mocked functions here using printf for output ...