// src/components/About.js
import React from "react";
import Layout from "./Layout"; // Import the Layout component

function About() {
  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-2xl w-96 text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">About Us</h1>
          <p className="text-gray-700">
            Welcome to the Smart IoT Dashboard! This application provides real-time
            monitoring of environmental data such as temperature, humidity, air
            quality, and smoke levels. Our goal is to help you keep your home safe
            and comfortable.
          </p>
          <p className="mt-4 text-gray-700">
            Developed with ❤️ using React, Firebase, and Tailwind CSS.
          </p>
        </div>
      </div>
    </Layout>
  );
}

export default About;