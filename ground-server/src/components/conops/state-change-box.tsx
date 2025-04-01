"use client";

import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

export default function StateChangeBox() {
  const [altitudeArmed, setAltitudeArmed] = useState(false);
  const [referencePressure, setReferencePressure] = useState("");
  const [altimeterState, setAltimeterState] = useState(false);
  const [sdState, setSdState] = useState(false);
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [flightMode, setFlightMode] = useState("Select");

  const handleReferencePressureSubmit = () => {
    // TODO: Implement reference pressure submission logic
    console.log("Reference pressure submitted:", referencePressure);
  };

  const handleLatitudeSubmit = () => {
    // TODO: Implement latitude submission logic
    console.log("Latitude submitted:", latitude);
  };

  const handleLongitudeSubmit = () => {
    // TODO: Implement longitude submission logic
    console.log("Longitude submitted:", longitude);
  };

  const handleAltitudeArmedSubmit = () => {
    // TODO: Implement altitude armed submission logic
    console.log("Altitude armed state submitted:", altitudeArmed);
  };

  const handleAltimeterStateSubmit = () => {
    // TODO: Implement altimeter state submission logic
    console.log("Altimeter state submitted:", altimeterState);
  };

  const handleSdStateSubmit = () => {
    // TODO: Implement SD state submission logic
    console.log("SD state submitted:", sdState);
  };

  const handleFlightModeSelect = (mode: string) => {
    setFlightMode(mode);
  };

  const handleFlightModeSubmit = () => {
    // TODO: Implement flight mode submission logic
    console.log("Flight mode submitted:", flightMode);
  };

  return (
    <div className="border border-gray-300 p-6 rounded-lg flex flex-col space-y-6">
      <h2 className="text-lg font-bold text-center">State Change</h2>
      
      {/* Altitude Armed Switch */}
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-bold text-center">Altitude Armed</h4>
        <div className="flex items-center space-x-2">
          <span className="text-sm">{altitudeArmed ? "True" : "False"}</span>
          <Switch
            checked={altitudeArmed}
            onCheckedChange={setAltitudeArmed}
          />
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="default" size="sm">
                Send
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirm Altitude Armed State Change</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you would like to continue with Altitude Armed state change?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleAltitudeArmedSubmit}>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {/* Reference Pressure Input */}
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-bold text-center">Reference Pressure</h4>
        <div className="flex items-center space-x-2">
          <Input
            type="number"
            value={referencePressure}
            onChange={(e) => setReferencePressure(e.target.value)}
            className="w-32 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            placeholder="Enter value"
          />
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="default" size="sm">
                Send
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirm Reference Pressure Change</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you would like to continue with Reference Pressure change?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleReferencePressureSubmit}>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {/* Altimeter State Switch */}
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-bold text-center">Altimeter State</h4>
        <div className="flex items-center space-x-2">
          <span className="text-sm">{altimeterState ? "True" : "False"}</span>
          <Switch
            checked={altimeterState}
            onCheckedChange={setAltimeterState}
          />
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="default" size="sm">
                Send
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirm Altimeter State Change</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you would like to continue with Altimeter State change?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleAltimeterStateSubmit}>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {/* SD State Switch */}
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-bold text-center">SD State</h4>
        <div className="flex items-center space-x-2">
          <span className="text-sm">{sdState ? "True" : "False"}</span>
          <Switch
            checked={sdState}
            onCheckedChange={setSdState}
          />
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="default" size="sm">
                Send
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirm SD State Change</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you would like to continue with SD State change?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleSdStateSubmit}>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {/* BLiMS Target */}
      <div className="flex flex-col space-y-4">
        <h4 className="text-sm font-bold text-center">BLiMS Target</h4>
        
        {/* Latitude Input */}
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold text-center">Latitude</h4>
          <div className="flex items-center space-x-2">
            <Input
              type="number"
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
              className="w-32 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              placeholder="Enter value"
            />
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="default" size="sm">
                  Send
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirm Latitude Change</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you would like to continue with Latitude change?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleLatitudeSubmit}>
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        {/* Longitude Input */}
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold text-center">Longitude</h4>
          <div className="flex items-center space-x-2">
            <Input
              type="number"
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
              className="w-32 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              placeholder="Enter value"
            />
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="default" size="sm">
                  Send
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirm Longitude Change</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you would like to continue with Longitude change?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleLongitudeSubmit}>
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>

      {/* Flight Mode Dropdown */}
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-bold text-center">Flight Mode</h4>
        <div className="flex items-center space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-32">
                {flightMode}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => handleFlightModeSelect("Startup")}>
                Startup
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleFlightModeSelect("Standby")}>
                Standby
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleFlightModeSelect("Ascent")}>
                Ascent
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleFlightModeSelect("Drogue Deployed")}>
                Drogue Deployed
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleFlightModeSelect("Main Deployed")}>
                Main Deployed
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleFlightModeSelect("Fault")}>
                Fault
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="default" size="sm">
                Send
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirm Flight Mode Change</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you would like to continue with Flight Mode change?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleFlightModeSubmit}>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
} 