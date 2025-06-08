"use client";

import { showToast } from "./ui/toast";
import { BatteryCharging, BatteryFull, Smartphone } from "lucide-react";
import { useEffect, useRef, useState } from "react";

function playBeep() {
  if (typeof window === "undefined") return;
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.value = 880;
    osc.connect(ctx.destination);
    osc.start();
    setTimeout(() => {
      osc.stop();
      ctx.close();
    }, 300);
  } catch (e) {}
}
function vibrate(ms = 300) {
  if ("vibrate" in navigator) navigator.vibrate(ms);
}
const getOS = () => {
  if (typeof window === "undefined") return "Unknown";
  const { userAgent } = window.navigator;
  if (/windows phone/i.test(userAgent)) return "Windows Phone";
  if (/android/i.test(userAgent)) return "Android";
  if (/iPad|iPhone|iPod/.test(userAgent)) return "iOS";
  if (/Mac/i.test(userAgent)) return "MacOS";
  if (/Win/i.test(userAgent)) return "Windows";
  if (/Linux/i.test(userAgent)) return "Linux";
  return "Unknown";
};

export default function BatteryDisplay() {
  const [battery, setBattery] = useState(null);
  const lastNotifiedLevel = useRef(null);
  const [deviceInfo, setDeviceInfo] = useState({});

  useEffect(() => {
    let batteryObj = null;
    let interval = null;
    let update = (bat) => {
      setBattery({
        level: Math.round(bat.level * 100),
        charging: bat.charging,
        chargingTime: bat.chargingTime,
        dischargingTime: bat.dischargingTime,
      });
    };
    if ("getBattery" in navigator) {
      navigator.getBattery().then((bat) => {
        batteryObj = bat;
        update(bat)[
          ("levelchange",
          "chargingchange",
          "chargingtimechange",
          "dischargingtimechange")
        ].forEach((evt) => bat.addEventListener(evt, () => update(bat)));
        interval = setInterval(() => update(bat), 5000);
      });
    }
    setDeviceInfo({
      os: getOS(),
      userAgent:
        typeof window !== "undefined" ? window.navigator.userAgent : "",
    });
    return () => {
      if (batteryObj) {
        [
          "levelchange",
          "chargingchange",
          "chargingtimechange",
          "dischargingtimechange",
        ].forEach((evt) =>
          batteryObj.removeEventListener(evt, () => update(batteryObj))
        );
      }
      if (interval) clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (!battery) return;
    const level = battery.level;
    if (lastNotifiedLevel.current === null)
      lastNotifiedLevel.current = Math.floor(level / 10) * 10;
    if (
      level <= 100 &&
      level % 10 === 0 &&
      level !== lastNotifiedLevel.current
    ) {
      showToast(`Battery dropped to ${level}%`);
      playBeep();
      vibrate();
      lastNotifiedLevel.current = level;
    }
    if (level > lastNotifiedLevel.current) lastNotifiedLevel.current = level;
  }, [battery]);

  function getTimeLeft() {
    if (!battery) return "--";
    const t = battery.charging ? battery.chargingTime : battery.dischargingTime;
    if (t === Infinity) return "--";
    const min = Math.floor(t / 60);
    const sec = Math.floor(t % 60);
    return `${min}m ${sec}s`;
  }

  function BatteryIcon({ level, charging }) {
    if (charging)
      return <BatteryCharging className="w-36 h-36 animate-bounce" />;
    if (level >= 80) return <BatteryFull className="w-36 h-36" />;
    if (level >= 30) return <BatteryFull className="w-36 h-36" />;
    return <BatteryFull className="w-36 h-36 animate-pulse" />;
  }

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-full">
      <span className="flex items-center text-4xl font-bold mb-2 tracking-tight">
        <Smartphone className="w-10 h-10 mr-2" />
        BATTERY
      </span>
      {battery ? (
        <>
          <BatteryIcon level={battery.level} charging={battery.charging} />
          <span className="text-[7vw] font-mono font-extrabold my-2 select-text ">
            {battery.level}%
          </span>
          <span className={`text-sm font-semibold uppercase tracking-wide`}>
            {battery.charging
              ? "Charging"
              : battery.level < 12
              ? "Low Battery"
              : "Discharging"}
          </span>
          <div className="w-[min(400px,80vw)] h-8 border-2 border-foreground rounded-full mt-6 mb-2 overflow-hidden bg-transparent relative">
            <div
              className={`absolute left-0 top-0 h-full transition-all duration-700`}
              style={{
                width: `${battery.level}%`,
                background:
                  battery.level > 30
                    ? "var(--foreground)"
                    : battery.level > 10
                    ? "repeating-linear-gradient(135deg, var(--foreground) 0 12px, transparent 12px 24px)"
                    : "repeating-linear-gradient(45deg, red 0 12px, transparent 12px 24px)",
              }}
            />
          </div>
          <div className="flex flex-row gap-8 text-base font-medium mt-2">
            <span>
              <span className="font-bold">
                Time {battery.charging ? "to Full" : "Left"}:
              </span>{" "}
              {getTimeLeft()}
            </span>
            <span>
              <span className="font-bold">Status:</span>{" "}
              {battery.charging ? "Charging" : "Discharging"}
            </span>
          </div>
          <div className="flex flex-row gap-8 text-xs mt-4 opacity-60">
            <div>
              <b>OS:</b> {deviceInfo.os}
            </div>
            <div>
              <b>User Agent:</b> {deviceInfo.userAgent?.slice(0, 22)}...
            </div>
          </div>
        </>
      ) : (
        <div className="text-red-600 font-semibold text-lg text-center pt-10">
          Battery API not supported in this browser/device.
        </div>
      )}
    </div>
  );
}
