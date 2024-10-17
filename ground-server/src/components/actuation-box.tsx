"use client";

import React, { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import { Button } from "@/components/ui/button";

interface ActuationBoxProps {
  title: string;
}

export default function ActuationBox({ title }: ActuationBoxProps) {
  const [isOn, setIsOn] = useState(false); //default state is off

  const handleTurnOn = () => {
    setIsOn(true);
  };

  const handleTurnOff = () => {
    setIsOn(false);
  };

  return (
    <div className="border border-gray-300 p-6 rounded-lg bg-white dark:bg-black text-center">
      <h2 className="text-lg font-bold mb-2">{title}</h2>
      <div>
        <h4 className="text-sm font-medium mb-2">Current Telemetry</h4>
        <div 
          className= "mb-4 h-[100px] bg-gray-200 dark:bg-gray-800"> 
          {/* Placeholder for telemetry data */}
          {isOn ? 'ON' : 'OFF'}
        </div>
      </div>
      <div className="flex justify-center space-x-4">
        
        {/* Off Button with Alert Dialog */}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button 
              variant={isOn ? "default" : "secondary"} 
              disabled={!isOn}
              className={`${!isOn ? "opacity-50" : ""}`}
            >
              Turn Off
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="max-w-lg p-4">
            <AlertDialogHeader>
              <AlertDialogTitle>Turn {title} Off</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to turn {title} off?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleTurnOff}>
                Yes, turn off
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* On Button with Alert Dialog */}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button 
              variant={isOn ? "secondary" : "default"} 
              disabled={isOn}
              className={`${isOn ? "opacity-50" : ""}`}
            >
              Turn On
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="max-w-lg p-4">
            <AlertDialogHeader>
              <AlertDialogTitle>Turn {title} On</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to turn {title} on?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleTurnOn}>
                Yes, turn on
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}