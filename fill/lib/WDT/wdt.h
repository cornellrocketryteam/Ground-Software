#ifndef WDT_H
#define WDT_H

#include <thread>
#include <mutex>
#include <condition_variable>
#include <chrono>
#include <functional>

class WatchdogTimer {
public:
    // timeout: how long to wait before timing out
    // onTimeout: function to call when the timeout occurs
    WatchdogTimer(std::chrono::milliseconds timeout, std::function<void()> onTimeout);

    // Ensure the thread is joined on destruction
    ~WatchdogTimer();

    // pets the watchdog
    void pet();

private:
    // Function running in a separate thread that monitors the timeout
    void watchdogFunction();

    std::chrono::milliseconds timeout_;
    std::function<void()> onTimeout_;
    std::thread watchdogThread_;
    std::mutex mtx_;
    std::condition_variable cv_;
    std::chrono::steady_clock::time_point lastPetTime_;
    bool stop_;
};

#endif 