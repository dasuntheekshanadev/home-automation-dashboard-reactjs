import React, { useEffect, useState } from "react";
import { ref, onValue, set } from "firebase/database";
import { database } from "../firebase";
import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts"; // For charts
import Layout from "./Layout"; // Import the Layout component

function Dashboard() {
  const [temperature, setTemperature] = useState(null);
  const [humidity, setHumidity] = useState(null);
  const [airQuality, setAirQuality] = useState(null);
  const [smokeLevel, setSmokeLevel] = useState(null);
  const [distance, setDistance] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [historicalData, setHistoricalData] = useState([]); // For historical data
  const [ledState, setLedState] = useState(false);
  const [ledBrightness, setLedBrightness] = useState(0);

  useEffect(() => {
    const sensors = [
      { path: "/temperature", setter: setTemperature },
      { path: "/humidity", setter: setHumidity },
      { path: "/airQuality", setter: setAirQuality },
      { path: "/smokeLevel", setter: setSmokeLevel },
      { path: "/distance", setter: setDistance },
      { path: "/led/state", setter: setLedState },
      { path: "/led/brightness", setter: setLedBrightness },
    ];

    sensors.forEach(({ path, setter }) => {
      const sensorRef = ref(database, path);
      onValue(sensorRef, (snapshot) => {
        setter(snapshot.val());
        setLastUpdated(new Date().toLocaleTimeString());

        // Store historical data
        setHistoricalData((prevData) => [
          ...prevData,
          { time: new Date().toLocaleTimeString(), value: snapshot.val(), label: path.slice(1) },
        ]);
      });
    });
  }, []);

  // Determine if distance is less than 20 cm
  const isObjectNear = distance !== null && distance < 20;

  // Determine status for each sensor
  const getStatus = (value, thresholds) => {
    if (value === null) return "loading";
    if (value < thresholds.safe) return "safe";
    if (value < thresholds.warning) return "warning";
    return "warning";
  };

  const sensorStatus = {
    temperature: getStatus(temperature, { safe: 25, warning: 30 }),
    humidity: getStatus(humidity, { safe: 50, warning: 70 }),
    airQuality: getStatus(airQuality, { safe: 50, warning: 80 }),
    smokeLevel: getStatus(smokeLevel, { safe: 20, warning: 50 }),
  };

  // Toggle LED state
  const toggleLed = () => {
    const newState = !ledState;
    set(ref(database, "/led/state"), newState);
  };

  // Update LED brightness
  const updateBrightness = (event) => {
    const brightness = event.target.value;
    set(ref(database, "/led/brightness"), parseInt(brightness));
  };

  return (
    <Layout>
      <div className="flex-1 flex flex-col items-center p-6">
        <h1 className="text-5xl font-bold mt-6 mb-4 text-center">Smart IoT Dashboard</h1>
        <p className="text-lg text-gray-400 mb-8 text-center">
          Real-time monitoring for your home environment
        </p>

        {/* Sensor Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
          {[
            { label: "Temperature", value: temperature, unit: "°C", color: "bg-blue-600", status: sensorStatus.temperature },
            { label: "Humidity", value: humidity, unit: "%", color: "bg-green-600", status: sensorStatus.humidity },
            { label: "Air Quality", value: airQuality, unit: "AQI", color: "bg-yellow-600", status: sensorStatus.airQuality },
          ].map(({ label, value, unit, color, status }) => (
            <div key={label} className={`${color} p-6 rounded-lg shadow-lg text-center relative`}>
              <h2 className="text-xl font-semibold">{label}</h2>
              <p className="text-3xl font-bold mt-2">
                {value !== null ? `${value} ${unit}` : "Loading..."}
              </p>
              <div className="absolute top-2 right-2">
                <span
                  className={`px-2 py-1 rounded-full text-sm ${
                    status === "safe"
                      ? "bg-green-500"
                      : status === "warning"
                      ? "bg-yellow-500"
                      : status === "danger"
                      ? "bg-red-500"
                      : "bg-gray-500"
                  }`}
                >
                  {status === "loading" ? "Loading..." : status.toUpperCase()}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Smoke Level */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-5xl mt-6 text-center">
          <h2 className="text-xl font-semibold">Smoke Level</h2>
          <p className="text-3xl font-bold mt-2">
            {smokeLevel !== null ? `${smokeLevel}%` : "Loading..."}
          </p>
          <div className="mt-4 h-4 bg-gray-700 rounded-full overflow-hidden relative">
            <motion.div
              className={`h-full rounded-full ${
                smokeLevel > 80 ? "bg-red-600" : smokeLevel > 60 ? "bg-yellow-500" : "bg-green-600"
              }`}
              initial={{ width: 0 }}
              animate={{ width: `${smokeLevel || 0}%` }}
              transition={{ duration: 1 }}
            />
          </div>
          {smokeLevel > 80 && (
            <p className="text-lg font-semibold mt-2 text-red-500">🔥 Fire detected! Take action!</p>
          )}
        </div>

        {/* Distance Card */}
        <div
          className={`${
            isObjectNear ? "bg-red-600" : "bg-purple-600"
          } p-6 rounded-lg shadow-lg w-full max-w-5xl mt-6 text-center`}
        >
          <h2 className="text-xl font-semibold">Distance</h2>
          <p className="text-3xl font-bold mt-2">
            {distance !== null ? `${distance} cm` : "Loading..."}
          </p>
          {isObjectNear && (
            <p className="text-lg font-semibold mt-2">⚠️ Object Detected Check the Front Lawn!!</p>
          )}
        </div>

        LED Control
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-5xl mt-6 text-center">
          <h2 className="text-xl font-semibold">LED Control</h2>
          <button
            onClick={toggleLed}
            className={`${
              ledState ? "bg-green-500" : "bg-red-500"
            } px-4 py-2 rounded-lg text-white font-bold mt-2`}
          >
            {ledState ? "Turn Off" : "Turn On"}
          </button>
          <div className="mt-4">
            <label htmlFor="brightness" className="text-lg font-semibold">
              Brightness: {ledBrightness}%
            </label>
            <input
              type="range"
              id="brightness"
              min="0"
              max="100"
              value={ledBrightness}
              onChange={updateBrightness}
              className="w-full mt-2"
            />
          </div>
        </div>

        {/* Historical Data Chart */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-5xl mt-6">
          <h2 className="text-xl font-semibold text-center mb-4">Historical Data</h2>
          <LineChart
            width={800}
            height={300}
            data={historicalData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="value" stroke="#8884d8" />
          </LineChart>
        </div>

        <p className="mt-6 text-gray-400 text-sm">Last Updated: {lastUpdated || "Loading..."}</p>
      </div>
    </Layout>
  );
}

export default Dashboard;