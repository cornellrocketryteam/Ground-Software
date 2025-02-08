#include "wdt.h"

WatchdogTimer::WatchdogTimer(std::chrono::milliseconds timeout, std::function<void()> onTimeout)
        : timeout_(timeout), onTimeout_(onTimeout), stop_(false)
{
    watchdogThread_ = std::thread(&WatchdogTimer::watchdogFunction, this);
}

WatchdogTimer::~WatchdogTimer() {
    {
        std::lock_guard<std::mutex> lock(mtx_);
        stop_ = true;
    }
    cv_.notify_all();
    if (watchdogThread_.joinable())
        watchdogThread_.join();
}

void WatchdogTimer::pet() {
    std::lock_guard<std::mutex> lock(mtx_);
    lastPetTime_ = std::chrono::steady_clock::now();
    cv_.notify_all();
}

void WatchdogTimer::watchdogFunction() {
    std::unique_lock<std::mutex> lock(mtx_);
    lastPetTime_ = std::chrono::steady_clock::now();

    while (!stop_) {
        // Wait until either:
        // 1. The condition variable is notified (i.e. the watchdog is petted), OR
        // 2. The timeout expires (last pet time + timeout_)
        if (cv_.wait_until(lock, lastPetTime_ + timeout_, [this]{ return stop_; })) {
            // If stop_ is true, we exit the loop.
            if (stop_) break;
            // Otherwise, the timer was petted, and we loop to wait again.
        } else {
            // Timeout occurred: unlock before calling the callback.
            lock.unlock();
            onTimeout_();  // Call the provided function on timeout
            lock.lock();
            // After handling timeout, you can either reset the timer or exit.
            // Here we reset the last pet time so that the watchdog continues.
            lastPetTime_ = std::chrono::steady_clock::now();
        }
    }
}
