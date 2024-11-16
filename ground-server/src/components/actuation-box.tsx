"use client";

import { useState } from "react";
import { Switch } from "@/components/ui/switch";
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
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { sendCommand } from "@/lib/grpcClient";
import { type Command } from "@/proto-out/command";
import { useToast } from "@/components/ui/use-toast";

interface ButtonConfig {
  label: string;
  stateLabel: string;
  command: Command;
  isOn: boolean; // Indicates if this button represents an "on" or "off" state
}

interface ActuationBoxProps {
  title: string;
  buttons: ButtonConfig[];
  initialStateLabel: string;
  useSwitch?: boolean; // Introduced the useSwitch prop
  switchLabel?: string;
  switchOnCommand?: Command;
  switchOffCommand?: Command;
}

export default function ActuationBox({
  title,
  buttons,
  initialStateLabel,
  useSwitch = true,
  switchLabel = "",
  switchOnCommand,
  switchOffCommand,
}: ActuationBoxProps) {
  const [currentState, setCurrentState] = useState<string | null>(null);
  const [isOnState, setIsOnState] = useState<boolean | null>(null); // Track whether the current state is "on" or "off"
  const { toast } = useToast();
  const [isSwitchOn, setIsSwitchOn] = useState<boolean>(true); // State for the switch

  const handleButtonClick = (button: ButtonConfig) => {
    // Removed the check for switch state here

    setCurrentState(button.stateLabel); // Update to the button's stateLabel
    setIsOnState(button.isOn); // Set whether it's an "on" or "off" state

    sendCommand(button.command)
      .then((res) => {
        console.log("Command Acknowledged!", res);
      })
      .catch((error) => {
        console.error("Error sending command", error);

        toast({
          title: "Command Error",
          description:
            "There was an error sending the command to the Fill Station. Please try again.",
          variant: "destructive",
        });
      });
  };

  const handleSwitchChange = (checked: boolean) => {
    setIsSwitchOn(checked);

    const command = checked ? switchOnCommand : switchOffCommand;

    if (command) {
      sendCommand(command)
        .then((res) => {
          console.log("Switch Command Acknowledged!", res);
        })
        .catch((error) => {
          console.error("Error sending switch command", error);
          toast({
            title: "Command Error",
            description:
              "There was an error sending the command. Please try again.",
            variant: "destructive",
          });
        });
    }
  };

  return (
    <div className="border border-gray-300 p-8 rounded-lg flex flex-col items-center">
      {/* Title */}
      <h2 className="text-lg font-bold mb-10 text-center">{title}</h2>

      <div className="flex items-center justify-around w-full space-x-10">
        {/* Buttons and Switch Section */}
        <div className="flex flex-col items-center space-y-6">
          {/* Buttons Section */}
          {buttons.map((button, index) => (
            <AlertDialog key={index}>
              <AlertDialogTrigger asChild>
                <Button
                  variant="default"
                  className="h-12 w-52 text-lg"
                  // Removed the disabled prop
                >
                  {button.label}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="max-w-lg p-4">
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    {button.label} {title}
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to {button.label} the {title}?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => handleButtonClick(button)}
                  >
                    Yes, {button.label}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          ))}

          {/* Render the switch if useSwitch is false */}
          {useSwitch === false && (
            <div className="flex items-center space-x-2 mt-4">
              <Switch
                id={`switch-${title}`}
                checked={isSwitchOn}
                onCheckedChange={handleSwitchChange}
              />
              <label htmlFor={`switch-${title}`} className="text-sm font-medium">
                {switchLabel}
              </label>
            </div>
          )}
        </div>

        {/* State Section */}
        <div>
          <h4 className="text-sm font-medium mb-2 text-center">
            Current State
          </h4>
          <div
            className={`h-[100px] w-[150px] flex items-center justify-center text-lg font-bold ${
              isOnState === true
                ? "bg-green-500 text-white"
                : isOnState === false
                ? "bg-red-500 text-white"
                : "bg-gray-300 dark:bg-gray-800"
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
