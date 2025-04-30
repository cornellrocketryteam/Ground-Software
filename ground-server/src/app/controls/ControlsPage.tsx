"use client";

import { useState } from "react";

import ActuationBox from "@/components/conops/actuation-box";
import StateChangeBox from "@/components/conops/state-change-box";
import { Slider } from "@/components/ui/slider";

export default function ControlsPage() {
  const [ventSliderValue, setVentSliderValue] = useState(1);
  const [ventIgniteSliderValue, setVentIgniteSliderValue] = useState(1);
  const [ventIgniteLaunchSliderValue, setVentIgniteLaunchSliderValue] = useState(1);
  const [ventIgniteIgniteDelay, setVentIgniteIgniteDelay] = useState(1);
  const [ventIgniteLaunchIgniteDelay, setVentIgniteLaunchIgniteDelay] = useState(1);
  const [ventIgniteLaunchLaunchDelay, setVentIgniteLaunchLaunchDelay] = useState(1);

  return (
    <div>
      <div>
        <h1 className="text-2xl font-bold mb-1 pt-2 text-center">
          Fill Station Commands
        </h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5 p-5">
          <ActuationBox
            title="Quick Disconnect Motor"
            buttons={[
              {
                label: "Retract",
                stateLabel: "Retracted",
                command: { qdRetract: true },
                isOn: true,
              },
            ]}
            initialStateLabel="No Data"
            useSwitch={false}
          />

          <ActuationBox
            title="Igniter"
            buttons={[
              {
                label: "Activate",
                stateLabel: "Activated",
                command: { ignite: true },
                isOn: true,
              },
            ]}
            initialStateLabel="No Data"
            useSwitch={false}
          />

          <ActuationBox
            title="Solenoid Valve 1"
            buttons={[
              {
                label: "Open",
                stateLabel: "Opened",
                command: { sv1Open: true },
                isOn: true,
              },
              {
                label: "Close",
                stateLabel: "Closed",
                command: { sv1Open: false },
                isOn: false,
              },
            ]}
            initialStateLabel="No Data"
            useSwitch={false}
          />

          <ActuationBox
            title="Ball Valve"
            buttons={[
              {
                label: "Open",
                stateLabel: "Opening",
                command: { bv1Open: true },
                isOn: true,
              },
              {
                label: "Close",
                stateLabel: "Closing",
                command: { bv1Open: false },
                isOn: false,
              },
            ]}
            initialStateLabel="No Data"
            useSwitch={true}
            switchLabel="Ball Valve On/Off"
            switchOnCommand={{ bv1Off: false }}
            switchOffCommand={{ bv1Off: true }}
          />
        </div>
      </div>

      <div>
        <h1 className="text-2xl font-bold mb-1 text-center">Rocket Commands</h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5 p-5">
          <ActuationBox
            title="Andromeda"
            buttons={[
              {
                label: "Launch",
                stateLabel: "Launched",
                command: { launch: true },
                isOn: true,
              },
            ]}
            initialStateLabel="No Data"
            useSwitch={false}
          />

          <ActuationBox
            title="Solenoid Valve 2"
            buttons={[
              {
                label: "Open",
                stateLabel: "Opened",
                command: { sv2Close: false },
                isOn: true,
              },
              {
                label: "Close",
                stateLabel: "Closed",
                command: { sv2Close: true },
                isOn: false,
              },
            ]}
            initialStateLabel="No Data"
            useSwitch={false}
          />

          <ActuationBox
            title="MAV"
            buttons={[
              {
                label: "Open",
                stateLabel: "Opened",
                command: { mavOpen: true },
                isOn: true,
              },
              {
                label: "Close",
                stateLabel: "Closed",
                command: { mavOpen: false },
                isOn: false,
              },
            ]}
            initialStateLabel="No Data"
            useSwitch={false}
          />
          <ActuationBox
            title="Vent"
            buttons={[
              {
                label: "Vent",
                stateLabel: "Vented",
                command: { vent: { ventDuration: ventSliderValue } },
                isOn: true,
              },
            ]}
            initialStateLabel="No Data"
            useSwitch={false}
          >
            <div className="mt-8 w-full flex flex-col items-center">
              <h4 className="text-sm font-bold mb-4 text-center">
                Vent Duration
              </h4>
              <Slider
                min={1}
                max={4}
                step={1}
                value={[ventSliderValue]}
                onValueChange={(value: number[]) =>
                  setVentSliderValue(value[0])
                }
              />
              <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                {ventSliderValue} {ventSliderValue === 1 ? "second" : "seconds"}
              </p>
            </div>
          </ActuationBox>
          <ActuationBox
            title="Vent + Ignite"
            buttons={[
              {
                label: "Vent + Ignite",
                stateLabel: "Vented & Ignited",
                command: {
                  ventIgnite: {
                    ventDuration: ventIgniteSliderValue,
                    igniteDelay: ventIgniteIgniteDelay,
                  },
                },
                isOn: true,
              },
            ]}
            initialStateLabel="No Data"
            useSwitch={false}
          >
            <div className="mt-8 w-full flex flex-col items-center">
              <h4 className="text-sm font-bold mb-4 text-center">
                Vent Duration
              </h4>
              <Slider
                min={1}
                max={5}
                step={1}
                value={[ventIgniteSliderValue]}
                onValueChange={(value: number[]) =>
                  setVentIgniteSliderValue(value[0])
                }
              />
              <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                {ventIgniteSliderValue}{" "}
                {ventIgniteSliderValue === 1 ? "second" : "seconds"}
              </p>
              <h4 className="mt-4 text-sm font-bold mb-4 text-center">
                Ignite Delay
              </h4>
              <Slider
                min={0}
                max={10}
                step={1}
                value={[ventIgniteIgniteDelay]}
                onValueChange={(value: number[]) => setVentIgniteIgniteDelay(value[0])}
              />
              <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                {ventIgniteIgniteDelay} {ventIgniteIgniteDelay === 1 ? "second" : "seconds"}
              </p>
            </div>
          </ActuationBox>
          <ActuationBox
            title="Vent + Ignite + Launch"
            buttons={[
              {
                label: "Vent + Ignite + Launch",
                stateLabel: "Vented & Ignited & Launched",
                command: {
                  ventIgniteLaunch: {
                    ventDuration: ventIgniteLaunchSliderValue,
                    igniteDelay: ventIgniteLaunchIgniteDelay,
                    launchDelay: ventIgniteLaunchLaunchDelay,
                  },
                },
                isOn: true,
              },
            ]}
            initialStateLabel="No Data"
            useSwitch={false}
          >
            <div className="mt-8 w-full flex flex-col items-center">
              <h4 className="text-sm font-bold mb-4 text-center">
                Vent Duration
              </h4>
              <Slider
                min={1}
                max={5}
                step={1}
                value={[ventIgniteLaunchSliderValue]}
                onValueChange={(value: number[]) =>
                  setVentIgniteLaunchSliderValue(value[0])
                }
              />
              <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                {ventIgniteLaunchSliderValue}{" "}
                {ventIgniteLaunchSliderValue === 1 ? "second" : "seconds"}
              </p>
              <h4 className="mt-4 text-sm font-bold mb-4 text-center">
                Ignite Delay
              </h4>
              <Slider
                min={0}
                max={10}
                step={1}
                value={[ventIgniteLaunchIgniteDelay]}
                onValueChange={(value: number[]) => setVentIgniteLaunchIgniteDelay(value[0])}
              />
              <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                {ventIgniteLaunchIgniteDelay} {ventIgniteLaunchIgniteDelay === 1 ? "second" : "seconds"}
              </p>
              <h4 className="mt-4 text-sm font-bold mb-4 text-center">
                Launch Delay
              </h4>
              <Slider
                min={0}
                max={20}
                step={1}
                value={[ventIgniteLaunchLaunchDelay]}
                onValueChange={(value: number[]) => setVentIgniteLaunchLaunchDelay(value[0])}
              />
              <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                {ventIgniteLaunchLaunchDelay} {ventIgniteLaunchLaunchDelay === 1 ? "second" : "seconds"}
              </p>
            </div>
          </ActuationBox>
          <StateChangeBox />
          <ActuationBox
            title="Payload"
            buttons={[
              {
                label: "Start",
                stateLabel: "On",
                command: { payloadStart: true },
                isOn: true,
              },
            ]}
            initialStateLabel="Off"
            useSwitch={false}
          />
          <ActuationBox
            title="SD Card"
            buttons={[
              {
                label: "Clear",
                stateLabel: "Cleared",
                command: { sdClear: true },
                isOn: true,
              },
            ]}
            initialStateLabel="No Data"
            useSwitch={false}
          />
          <ActuationBox
            title="FRAM"
            buttons={[
              {
                label: "Reset",
                stateLabel: "Reset",
                command: { framReset: true },
                isOn: true,
              },
            ]}
            initialStateLabel="No Data"
            useSwitch={false}
          />
          <ActuationBox
            title="Reboot"
            buttons={[
              {
                label: "Reboot",
                stateLabel: "Rebooted",
                command: { reboot: true },
                isOn: true,
              },
            ]}
            initialStateLabel="No Data"
            useSwitch={false}
          />
        </div>
      </div>
    </div>
  );
}
