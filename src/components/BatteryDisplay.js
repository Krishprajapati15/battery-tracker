"use client";

import Button from "./ui/button";
import { showToast } from "./ui/toast";
import {
  BatteryFull,
  BatteryCharging,
  Moon,
  Sun,
  Smartphone,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";

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

export default function BatteryDisplay() {
  const [battery, setBattery] = useState(null);
  const [history, setHistory] = useState([]);
  const [deviceInfo, setDeviceInfo] = useState({});
  const [showHistory, setShowHistory] = useState(false);
  const lastNotifiedLevel = useRef(null);
  const { theme, setTheme } = useTheme();

  // Theme toggle
  function toggleTheme() {
    setTheme(theme === "dark" ? "light" : "dark");
  }

  // Poll battery status
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
      // Store history in localStorage
      setHistory((prev) => {
        const newHistory = [
          ...prev,
          { ts: Date.now(), level: Math.round(bat.level * 100) },
        ];
        localStorage.setItem(
          "battery-history",
          JSON.stringify(newHistory.slice(-100))
        );
        return newHistory.slice(-100);
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

    // Load history from localStorage
    try {
      const hist = JSON.parse(localStorage.getItem("battery-history") || "[]");
      setHistory(hist);
    } catch {}

    // Device Info
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

  // 10% drop notification
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
    if (level > lastNotifiedLevel.current) lastNotifiedLevel.current = level; // update upward (charging)
  }, [battery]);

  // Estimated time left
  function getTimeLeft() {
    if (!battery) return "--";
    const t = battery.charging ? battery.chargingTime : battery.dischargingTime;
    if (t === Infinity) return "--";
    const min = Math.floor(t / 60);
    const sec = Math.floor(t % 60);
    return `${min}m ${sec}s`;
  }

  // Battery icon
  function BatteryIcon({ level, charging }) {
    if (charging)
      return (
        <BatteryCharging className="w-8 h-8 text-green-500 animate-pulse" />
      );
    if (level >= 80) return <BatteryFull className="w-8 h-8 text-green-500" />;
    if (level >= 30) return <BatteryFull className="w-8 h-8 text-yellow-500" />;
    return <BatteryFull className="w-8 h-8 text-red-500 animate-pulse" />;
  }

  return (
    <div className="max-w-lg mx-auto p-6 mt-10 bg-card shadow-lg rounded-xl">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Smartphone className="w-6 h-6 text-primary" />
          Battery Indicator
        </h1>
        <Button onClick={toggleTheme} aria-label="Toggle theme">
          {theme === "dark" ? (
            <Sun className="w-5 h-5" />
          ) : (
            <Moon className="w-5 h-5" />
          )}
        </Button>
      </div>

      {battery ? (
        <>
          <div className="flex items-center gap-4 mb-3">
            <BatteryIcon level={battery.level} charging={battery.charging} />
            <span className="text-4xl font-mono">{battery.level}%</span>
            <span
              className={`text-sm ml-2 px-2 py-1 rounded ${
                battery.charging
                  ? "bg-green-100 text-green-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {battery.charging ? "Charging" : "Discharging"}
            </span>
          </div>
          {/* Progress Bar */}
          <div className="w-full bg-gray-300 dark:bg-gray-600 rounded h-4 mb-2 overflow-hidden">
            <div
              className={`h-4 rounded ${
                battery.level > 30
                  ? "bg-green-500"
                  : battery.level > 10
                  ? "bg-yellow-400"
                  : "bg-red-500 animate-pulse"
              }`}
              style={{ width: `${battery.level}%` }}
            />
          </div>
          {/* Estimated time */}
          <div className="text-sm mb-2">
            <span className="font-semibold">
              Estimated {battery.charging ? "to full" : "left"}:
            </span>{" "}
            {getTimeLeft()}
          </div>
          {/* Battery animation */}
          {battery.charging || battery.level <= 10 ? (
            <div className="my-2 flex items-center gap-2">
              <span
                className={`inline-block w-4 h-4 rounded-full bg-green-500 animate-pulse ${
                  battery.level <= 10 ? "bg-red-500" : ""
                }`}
              ></span>
              <span className="text-xs">
                {battery.charging
                  ? "Charging..."
                  : battery.level <= 10
                  ? "Low battery!"
                  : ""}
              </span>
            </div>
          ) : null}
        </>
      ) : (
        <div className="text-red-600 font-semibold">
          Battery API not supported in this browser/device.
        </div>
      )}

      {/* Device Info */}
      <div className="mt-4 p-2 rounded bg-muted text-xs">
        <div>
          <b>OS:</b> {deviceInfo.os}
        </div>
        <div>
          <b>User Agent:</b> {deviceInfo.userAgent?.slice(0, 60)}...
        </div>
        <div>
          <b>Charging:</b> {battery?.charging ? "Yes" : "No"}
        </div>
        <div>
          <b>Battery Level:</b> {battery?.level ?? "--"}%
        </div>
      </div>

      {/* Battery History */}
      <div className="mt-4">
        <Button className="w-full" onClick={() => setShowHistory((x) => !x)}>
          {showHistory ? "Hide" : "Show"} Battery History
        </Button>
        {showHistory && (
          <div className="mt-3 p-2 bg-muted rounded">
            <BatteryHistoryChart history={history} />
          </div>
        )}
      </div>
    </div>
  );
}

// Simple SVG Chart for battery history
function BatteryHistoryChart({ history }) {
  if (!history?.length) return <div>No battery history yet.</div>;
  const width = 300,
    height = 60,
    pad = 10;
  const points = history
    .map((h, i) => {
      const x = pad + ((width - pad * 2) * i) / (history.length - 1);
      const y = pad + ((height - pad * 2) * (100 - h.level)) / 100;
      return `${x},${y}`;
    })
    .join(" ");
  return (
    <svg width={width} height={height} className="block mx-auto">
      <polyline fill="none" stroke="#22c55e" strokeWidth="2" points={points} />
      <rect
        x={pad}
        y={pad}
        width={width - pad * 2}
        height={height - pad * 2}
        fill="none"
        stroke="#888"
        strokeWidth="1"
        rx="4"
      />
      <text
        x={width - pad}
        y={height - pad}
        fontSize="10"
        textAnchor="end"
        fill="#666"
      >
        {history[history.length - 1].level}%
      </text>
      <text
        x={pad}
        y={height - pad}
        fontSize="10"
        textAnchor="start"
        fill="#666"
      >
        {history[0].level}%
      </text>
    </svg>
  );
}
