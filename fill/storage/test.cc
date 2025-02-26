#include "storage.h" 

int main(){
    DataBase db; 

    while(true) {
        db.writeFillRATSTelemetry(); 
        sleep(100);
    }
    return 0; 
}