"use client";

import React, { useState, useEffect } from 'react';
import { Moon, Sun, Coffee, Utensils, CheckCircle, Trash2 } from 'lucide-react';

export default function Home() {
  // Initialize with default values
  const initialState = {
    currentDay: {
      date: new Date().toISOString(),
      wakeTime: '',
      bedTime: '',
      vyvanseTime: '',
      meals: [], // Initialize as empty array
    },
    history: []
  };

  const [logs, setLogs] = useState(initialState);
  
  useEffect(() => {
    const savedLogs = localStorage.getItem('sleepTrackerData');
    if (savedLogs) {
      const parsedLogs = JSON.parse(savedLogs);
      // Ensure meals array exists even if loading old data
      if (!parsedLogs.currentDay.meals) {
        parsedLogs.currentDay.meals = [];
      }
      if (!Array.isArray(parsedLogs.history)) {
        parsedLogs.history = [];
      }
      setLogs(parsedLogs);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('sleepTrackerData', JSON.stringify(logs));
  }, [logs]);

  const getCurrentTime = () => {
    return new Date().toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const handleStartDay = () => {
    if (logs.currentDay.bedTime) {
      setLogs(prev => ({
        currentDay: {
          date: new Date().toISOString(),
          wakeTime: getCurrentTime(),
          bedTime: '',
          vyvanseTime: '',
          meals: [],
        },
        history: [...prev.history, prev.currentDay]
      }));
    } else {
      setLogs(prev => ({
        ...prev,
        currentDay: {
          ...prev.currentDay,
          wakeTime: getCurrentTime()
        }
      }));
    }
  };

  const handleEndDay = () => {
    setLogs(prev => ({
      ...prev,
      currentDay: {
        ...prev.currentDay,
        bedTime: getCurrentTime()
      }
    }));
  };

  const handleVyvanse = () => {
    setLogs(prev => ({
      ...prev,
      currentDay: {
        ...prev.currentDay,
        vyvanseTime: getCurrentTime()
      }
    }));
  };

  const handleMeal = () => {
    setLogs(prev => ({
      ...prev,
      currentDay: {
        ...prev.currentDay,
        meals: [...prev.currentDay.meals, getCurrentTime()]
      }
    }));
  };

  const removeMeal = (indexToRemove: number) => {
    setLogs(prev => ({
      ...prev,
      currentDay: {
        ...prev.currentDay,
        meals: prev.currentDay.meals.filter((_, index) => index !== indexToRemove)
      }
    }));
  };

  const isDayComplete = logs.currentDay.bedTime !== '';

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Sleep Tracker</h1>
          <div>{new Date(logs.currentDay.date).toLocaleDateString()}</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Quick Actions */}
          <div className="space-y-4">
            <button 
              onClick={handleStartDay}
              className={`w-full p-4 ${isDayComplete ? 'bg-green-100 hover:bg-green-200' : 'bg-yellow-100 hover:bg-yellow-200'} rounded-lg flex items-center justify-center space-x-2 transition-colors`}
            >
              <Sun className="w-6 h-6" />
              <span>{isDayComplete ? 'Start New Day' : 'Start Day'}</span>
              {isDayComplete && <CheckCircle className="w-4 h-4 ml-2" />}
            </button>
            
            <button 
              onClick={handleEndDay}
              disabled={!logs.currentDay.wakeTime || isDayComplete}
              className={`w-full p-4 ${!logs.currentDay.wakeTime || isDayComplete ? 'bg-gray-100 cursor-not-allowed' : 'bg-blue-100 hover:bg-blue-200'} rounded-lg flex items-center justify-center space-x-2 transition-colors`}
            >
              <Moon className="w-6 h-6" />
              <span>End Day</span>
            </button>
          </div>

          <div className="space-y-4">
            <button 
              onClick={handleVyvanse}
              disabled={!logs.currentDay.wakeTime || isDayComplete}
              className={`w-full p-4 ${!logs.currentDay.wakeTime || isDayComplete ? 'bg-gray-100 cursor-not-allowed' : 'bg-green-100 hover:bg-green-200'} rounded-lg flex items-center justify-center space-x-2`}
            >
              <Coffee className="w-6 h-6" />
              <span>Log Vyvanse</span>
            </button>
            
            <button 
              onClick={handleMeal}
              disabled={!logs.currentDay.wakeTime || isDayComplete}
              className={`w-full p-4 ${!logs.currentDay.wakeTime || isDayComplete ? 'bg-gray-100 cursor-not-allowed' : 'bg-orange-100 hover:bg-orange-200'} rounded-lg flex items-center justify-center space-x-2`}
            >
              <Utensils className="w-6 h-6" />
              <span>Log Meal</span>
            </button>
          </div>
        </div>

        {/* Status Display */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h2 className="font-semibold mb-4">Today's Logs:</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <Sun className="w-4 h-4" />
              <span>Wake: {logs.currentDay.wakeTime || 'Not logged'}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Moon className="w-4 h-4" />
              <span>Bed: {logs.currentDay.bedTime || 'Not logged'}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Coffee className="w-4 h-4" />
              <span>Vyvanse: {logs.currentDay.vyvanseTime || 'Not logged'}</span>
            </div>
          </div>

          {/* Meals Section */}
          <div className="mt-4">
            <h3 className="font-medium mb-2">Meals:</h3>
            {logs.currentDay.meals.length === 0 ? (
              <p className="text-sm text-gray-500">No meals logged today</p>
            ) : (
              <div className="space-y-2">
                {logs.currentDay.meals.map((meal, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2">
                      <Utensils className="w-4 h-4" />
                      <span>Meal {index + 1}: {meal}</span>
                    </div>
                    {!isDayComplete && (
                      <button 
                        onClick={() => removeMeal(index)}
                        className="text-red-500 hover:text-red-700 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick peek at history */}
        {logs.history.length > 0 && (
          <div className="mt-4 text-sm text-gray-500">
            Last completed day: {new Date(logs.history[logs.history.length - 1].date).toLocaleDateString()}
          </div>
        )}
      </div>
    </div>
  );
}