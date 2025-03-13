"use client";

import { useState, useEffect } from "react";
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
  useSwitch?: boolean;
  switchLabel?: string;
  switchOnCommand?: Command;
  switchOffCommand?: Command;
  small?: boolean; // For small size (vertical layout)
  compactLayout?: boolean; // Compact layout adjustments
  children?: React.ReactNode; // Accepts slider or any custom child component
}

export default function ActuationBox({
  title,
  buttons,
  initialStateLabel,
  useSwitch = true,
  switchLabel = "",
  switchOnCommand,
  switchOffCommand,
  small = false,
  compactLayout = false,
  children,
}: ActuationBoxProps) {
  const [currentState, setCurrentState] = useState<string | null>(null);
  const [isOnState, setIsOnState] = useState<boolean | null>(null);
  const { toast } = useToast();
  const [isSwitchOn, setIsSwitchOn] = useState<boolean>(true);

  // keys for local storage
  const currentStateKey = `ActuationBox_currentState-${title}`;
  const isOnStateKey = `ActuaionBox_isOnState-${title}`;
  const isSwitchOnKey = `ActuaionBox_isSwitchOnState-${title}`;

  const buttonOn = "on";
  const buttonOff = "off";

  // Load stored values on mount
  useEffect(() => {
    const storedCurrentState = localStorage.getItem(currentStateKey);
    setCurrentState(storedCurrentState ? storedCurrentState : initialStateLabel);

    const storedIsOnState = localStorage.getItem(isOnStateKey);
    if (storedIsOnState === buttonOn) {
      setIsOnState(true);
    } else if (storedIsOnState === buttonOff) {
      setIsOnState(false);
    }

    const storedIsSwitchOnState = localStorage.getItem(isSwitchOnKey);
    if (storedIsSwitchOnState === buttonOn) {
      setIsSwitchOn(true);
    } else if (storedIsSwitchOnState === buttonOff) {
      setIsSwitchOn(false);
    }
  }, []);

  const handleButtonClick = (button: ButtonConfig) => {
    setCurrentState(button.stateLabel);
    setIsOnState(button.isOn);

    localStorage.setItem(currentStateKey, button.stateLabel);
    localStorage.setItem(isOnStateKey, button.isOn ? buttonOn : buttonOff);

    sendCommand(button.command)
      .then((res) => {
        console.log("Command Acknowledged!", res);
      })
      .catch((error) => {
        console.error("Error sending command", error);
        toast({
          title: "Command Error",
          description:
            "There was an error sending the command. Please try again.",
          variant: "destructive",
        });
      });
  };

  const handleSwitchChange = (checked: boolean) => {
    setIsSwitchOn(checked);
    localStorage.setItem(isSwitchOnKey, checked ? buttonOn : buttonOff);

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

  const isSmall = small === true;

  // Container classes
  const containerClasses = isSmall
    ? "border border-gray-300 p-4 w-[250px] h-[200px] rounded-lg flex flex-col items-center"
    : "border border-gray-300 p-8 rounded-lg flex flex-col items-center";

  // Title classes
  const titleClasses = isSmall
    ? "text-base font-bold mb-5 text-center"
    : "text-lg font-bold mb-10 text-center";

  // Layout classes
  const layoutClasses = compactLayout
    ? "flex items-center justify-between w-full space-x-4"
    : isSmall
    ? "flex flex-col items-center w-full space-y-3"
    : "flex items-center justify-around w-full space-x-10";

  // Button container classes
  const buttonContainerClasses = compactLayout
    ? "flex flex-col items-start space-y-2 w-1/2"
    : isSmall
    ? "flex flex-col items-center space-y-3"
    : "flex flex-col items-center space-y-6";

  // Button sizes
  const buttonClasses = isSmall
    ? "h-7 w-[10rem] text-base"
    : "h-12 w-52 text-lg";

  // State box classes
  const stateBoxClasses = compactLayout
    ? "h-[80px] w-[100px] text-sm font-bold flex items-center justify-center border"
    : isSmall
    ? "h-[60px] w-[100px] flex items-center justify-center text-base font-bold"
    : "h-[100px] w-[150px] flex items-center justify-center text-lg font-bold";

  // Switch wrapper classes
  const switchWrapperClasses = compactLayout
    ? "flex items-center space-x-2 mt-2"
    : isSmall
    ? "flex items-center space-x-1 mt-2 transform scale-75"
    : "flex items-center space-x-2 mt-4";

  // Switch label classes
  const switchLabelClasses = isSmall
    ? "text-xs font-medium"
    : "text-sm font-medium";

  return (
    <div className={containerClasses}>
      {/* Title */}
      <h2 className={titleClasses}>{title}</h2>

      {isSmall ? (
        // Vertical layout for small
        <div className={layoutClasses}>
          {/* Buttons */}
          <div className={buttonContainerClasses}>
            {buttons.map((button, index) => (
              <AlertDialog key={index}>
                <AlertDialogTrigger asChild>
                  <Button variant="default" className={buttonClasses}>
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
          </div>

          {/* Current State */}
          <div className="flex flex-col items-center">
            <h4 className="text-xs font-medium mb-1 text-center">
              Current State
            </h4>
            <div
              className={`${stateBoxClasses} ${
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
      ) : (
        // Horizontal layout for medium/default
        <div className={layoutClasses}>
          {/* Buttons */}
          <div className={buttonContainerClasses}>
            {buttons.map((button, index) => (
              <AlertDialog key={index}>
                <AlertDialogTrigger asChild>
                  <Button variant="default" className={buttonClasses}>
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
                      autoFocus
                      onClick={() => handleButtonClick(button)}
                    >
                      Yes, {button.label}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            ))}
          </div>

          {/* Current State */}
          <div>
            <h4 className="text-sm font-medium mb-2 text-center">
              Current State
            </h4>
            <div
              className={`${stateBoxClasses} ${
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
      )}

      {/* Optional Switch */}
      {useSwitch && (
        <div className={switchWrapperClasses}>
          <Switch
            id={`switch-${title}`}
            checked={isSwitchOn}
            onCheckedChange={handleSwitchChange}
          />
          <span className={switchLabelClasses}>{switchLabel}</span>
        </div>
      )}

      {/* Render any children passed in (e.g. a slider) */}
      {children && (
        <div className="mt-8 w-full flex flex-col items-center">
          {children}
        </div>
      )}

      {/* Extra Spacing */}
      <div className={isSmall ? "mt-4" : "mt-8"}></div>
    </div>
  );
}
