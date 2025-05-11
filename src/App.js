import React from 'react';
import DPPresentation from './DPPresentation';
import './App.css';

function App() {
  return (
    <div className="App bg-gray-100 min-h-screen py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8 text-blue-700">
          Dynamic Programming: A Beginner's Guide
        </h1>
        <DPPresentation />
        <footer className="mt-8 text-center text-gray-500 text-sm">
          <p>© 2025 Dynamic Programming Tutorial</p>
          <p className="mt-2">
            Created by Emmanuel Arhu & Cecilia Arthur
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;