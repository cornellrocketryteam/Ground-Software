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
  offButtonLabel: string;
  onButtonLabel: string; 
  onStateLabel: string;
  offStateLabel: string;
  initialStateLabel: string;
}

export default function ActuationBox({ 
  title, 
  offButtonLabel, 
  onButtonLabel, 
  onStateLabel, 
  offStateLabel, 
  initialStateLabel 
}: ActuationBoxProps) {
  const [currentState, setCurrentState] = useState<string | null>(null); 

  const handleTurnOn = () => {
    setCurrentState(onStateLabel); // Set state to onStateLabel
  };

  const handleTurnOff = () => {
    setCurrentState(offStateLabel); // Set state to offStateLabel
  };

  return (
    <div className="border border-gray-300 p-8 rounded-lg bg-white dark:bg-black flex flex-col items-center">
      {/* Title */}
      <h2 className="text-lg font-bold mb-10 text-center">{title}</h2>

      <div className="flex items-center justify-around w-full space-x-10">
        {/* Button Section */}
        <div className="flex flex-col items-center space-y-6">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                variant="default" 
                className="h-12 w-52 text-lg"
              >
                {onButtonLabel}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="max-w-lg p-4">
              <AlertDialogHeader>
                <AlertDialogTitle>{onButtonLabel} {title} </AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to {onButtonLabel} the {title}?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleTurnOn}>
                  Yes, {onButtonLabel}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                variant="default" 
                className="h-12 w-52 text-lg"
              >
                {offButtonLabel}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="max-w-lg p-4">
              <AlertDialogHeader>
                <AlertDialogTitle>{offButtonLabel} {title}</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to {offButtonLabel} the {title}?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleTurnOff}>
                  Yes, {offButtonLabel}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        {/* State Section */}
        <div>
          <h4 className="text-sm font-medium mb-2 text-center">Current State</h4>
          <div 
            className={`h-[100px] w-[150px] flex items-center justify-center text-lg font-bold ${
              currentState === onStateLabel
                ? 'bg-green-500 text-white'
                : currentState === offStateLabel
                ? 'bg-red-500 text-white'
                : 'bg-gray-300 dark:bg-gray-800'
            }`}
          > 
            {currentState || initialStateLabel}
          </div>
        </div>
      </div>

      {/* Extra Spacing at the bottom */}
      <div className="mt-8"></div>
    </div>
  );
}
