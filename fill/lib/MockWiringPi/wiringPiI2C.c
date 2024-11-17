#include <wiringPiI2C.h>
#include <stdio.h>

int wiringPiI2CSetup(const int devId) {
    printf("[MOCK] wiringPiI2CSetup called with devId: %d\n", devId);
    return devId; // Return the devId as a mock file descriptor
}

int wiringPiI2CSetupInterface (const char *device, int devId) {
    printf("[MOCK] wiringPiI2CSetupInterface called with device: %s, devId: %d\n", device, devId);
    return devId; //Return the devId as a mock file descriptor
}

int wiringPiI2CRead(int fd) {
    printf("[MOCK] wiringPiI2CRead called with fd: %d\n", fd);
    return 0x55; 
}

int wiringPiI2CReadReg8(int fd, int reg) {
    printf("[MOCK] wiringPiI2CReadReg8 called with fd: %d, reg: %d\n", fd, reg);
    return 42; // Example "correct" value
}

int wiringPiI2CReadReg16(int fd, int reg) {
    printf("[MOCK] wiringPiI2CReadReg16 called with fd: %d, reg: %d\n", fd, reg);
    return 1234; // Example "correct" value
}

int wiringPiI2CReadBlockData(int fd, int reg, uint8_t *values, uint8_t size) {
    printf("[MOCK] wiringPiI2CReadBlockData called with fd: %d, reg: %d, size: %d\n", fd, reg, size);
    //Doesn't check for null or size 0
    if (values != NULL) {
        for (int i = 0; i < size; i++) {
            values[i] = 0xAA; //Example "correct" value
        }
    }
    return size; // Return size, even if values is NULL
}


int wiringPiI2CRawRead(int fd, uint8_t *values, uint8_t size) {
    printf("[MOCK] wiringPiI2CRawRead called with fd: %d, size: %d\n", fd, size);
    if (values != NULL) {
        for (int i = 0; i < size; i++) {
            values[i] = 0xBB; // Example "correct" value
        }
    }
    return size; //Return size, even if values is NULL

}

int wiringPiI2CWrite(int fd, int data) {
    printf("[MOCK] wiringPiI2CWrite called with fd: %d, data: %d\n", fd, data);
    return 1; // Simulate successful write
}

int wiringPiI2CWriteReg8(int fd, int reg, int data) {
    printf("[MOCK] wiringPiI2CWriteReg8 called with fd: %d, reg: %d, data: %d\n", fd, reg, data);
    return 1; // Simulate successful write
}

int wiringPiI2CWriteReg16(int fd, int reg, int data) {
    printf("[MOCK] wiringPiI2CWriteReg16 called with fd: %d, reg: %d, data: %d\n", fd, reg, data);
    return 1; // Simulate successful write
}

int wiringPiI2CWriteBlockData(int fd, int reg, const uint8_t *values, uint8_t size) {
    printf("[MOCK] wiringPiI2CWriteBlockData called with fd: %d, reg: %d, size: %d\n", fd, reg, size);
    return size; // Return size even if values is NULL
}

int wiringPiI2CRawWrite(int fd, const uint8_t *values, uint8_t size) {
    printf("[MOCK] wiringPiI2CRawWrite called with fd: %d, size: %d\n", fd, size);
    return size; // Return size even if values is NULL
}