#include "storage.h" 

int main(){
    DataBase db; 
    FillStationTelemetry t; 
    RocketUmbTelemetry t2; 


    t.set_ign1_cont(2.0); 
    t.set_ign2_cont(55.5);

    t.set_lc1(3654.44);
    t.set_pt1(12345.0); 
    t.set_pt2(66666.6);

    t.set_timestamp(std::time(nullptr));

    while(true) {
        db.writeFillStationTelemetry(t);
        //db.writeUmbilicalTelemetry(t2); 
        sleep(1); 
    }
    return 0; 
}