import React, { useState } from 'react';

const FibonacciVisualization = () => {
  const [n, setN] = useState(8);
  const [currentStep, setCurrentStep] = useState(-1);
  const [animationSpeed, setAnimationSpeed] = useState(1000);
  const [isPlaying, setIsPlaying] = useState(false);

  // Calculate Fibonacci with steps tracking
  const calculateFibonacci = (n) => {
    if (n <= 1) return { result: n, steps: [{ index: n, value: n, explanation: `Base case: fib(${n}) = ${n}` }] };
    
    const dp = new Array(n + 1).fill(0);
    dp[0] = 0;
    dp[1] = 1;
    
    const steps = [
      { index: 0, value: 0, explanation: "Base case: fib(0) = 0" },
      { index: 1, value: 1, explanation: "Base case: fib(1) = 1" }
    ];
    
    for (let i = 2; i <= n; i++) {
      dp[i] = dp[i-1] + dp[i-2];
      steps.push({
        index: i,
        value: dp[i],
        explanation: `fib(${i}) = fib(${i-1}) + fib(${i-2}) = ${dp[i-1]} + ${dp[i-2]} = ${dp[i]}`
      });
    }
    
    return { result: dp[n], steps };
  };
  
  const { steps } = calculateFibonacci(n);
  
  // Animation control
  React.useEffect(() => {
    let timer;
    if (isPlaying && currentStep < steps.length - 1) {
      timer = setTimeout(() => {
        setCurrentStep(prev => prev + 1);
      }, animationSpeed);
    } else if (currentStep >= steps.length - 1) {
      setIsPlaying(false);
    }
    
    return () => clearTimeout(timer);
  }, [isPlaying, currentStep, steps.length, animationSpeed]);
  
  const startAnimation = () => {
    setCurrentStep(-1);
    setIsPlaying(true);
  };
  
  const pauseAnimation = () => {
    setIsPlaying(false);
  };
  
  const stepForward = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };
  
  const stepBackward = () => {
    if (currentStep > -1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Fibonacci Calculation: Bottom-Up Approach</h2>
      
      <div className="mb-6">
        <label className="block text-gray-700 font-medium mb-2">
          Calculate Fibonacci of:
          <input
            type="number"
            min="2"
            max="20"
            value={n}
            onChange={(e) => {
              setN(parseInt(e.target.value) || 2);
              setCurrentStep(-1);
            }}
            className="ml-3 p-1 border border-gray-300 rounded w-16 text-center"
          />
        </label>
        
        <div className="flex items-center space-x-2 mt-4">
          <button
            onClick={startAnimation}
            disabled={isPlaying}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            Start
          </button>
          <button
            onClick={pauseAnimation}
            disabled={!isPlaying}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            Pause
          </button>
          <button
            onClick={stepBackward}
            disabled={currentStep < 0}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            ◀ Back
          </button>
          <button
            onClick={stepForward}
            disabled={currentStep >= steps.length - 1}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            Next ▶
          </button>
          <div className="ml-4">
            <label className="text-gray-700 mr-2">Speed:</label>
            <select
              value={animationSpeed}
              onChange={(e) => setAnimationSpeed(parseInt(e.target.value))}
              className="border border-gray-300 rounded p-1"
            >
              <option value="2000">Slow</option>
              <option value="1000">Normal</option>
              <option value="500">Fast</option>
              <option value="200">Very Fast</option>
            </select>
          </div>
        </div>
      </div>
      
      <div className="bg-gray-100 p-4 rounded-lg mb-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-3">DP Table: fib[i] = fib[i-1] + fib[i-2]</h3>
        <div className="flex flex-wrap gap-2 justify-center">
          {Array.from({ length: n + 1 }, (_, i) => (
            <div
              key={i}
              className={`flex flex-col items-center ${
                steps.findIndex(step => step.index === i) <= currentStep
                  ? 'opacity-100'
                  : 'opacity-40'
              }`}
            >
              <div className="text-xs text-gray-500 mb-1">Index {i}</div>
              <div 
                className={`w-14 h-14 flex items-center justify-center rounded-lg font-bold text-lg
                  ${
                    steps.findIndex(step => step.index === i) === currentStep
                      ? 'bg-blue-500 text-white ring-4 ring-blue-300'
                      : steps.findIndex(step => step.index === i) <= currentStep
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-200 text-gray-500'
                  }
                `}
              >
                {steps.findIndex(step => step.index === i) <= currentStep
                  ? steps.find(step => step.index === i)?.value
                  : '?'}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Current Calculation:</h3>
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          {currentStep >= 0 ? (
            <p className="text-lg font-mono">{steps[currentStep].explanation}</p>
          ) : (
            <p className="text-gray-500 italic">Click 'Start' or 'Next' to begin the calculation</p>
          )}
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Code Implementation:</h3>
        <div className="bg-gray-800 text-white p-4 rounded font-mono text-sm overflow-x-auto">
          <pre>{`// Fibonacci using Tabulation (Bottom-Up approach)
public static int fibTabulation(int n) {
    // Base cases
    if (n <= 1) {
        return n;
    }
    
    // Create table for storing solutions to subproblems
    int[] dp = new int[n + 1];
    
    // Initialize base cases
    dp[0] = 0;
    dp[1] = 1;
    
    // Fill dp table in bottom-up manner
    for (int i = 2; i <= n; i++) {
        dp[i] = dp[i - 1] + dp[i - 2];
    }
    
    return dp[n];
}`}</pre>
        </div>
      </div>
      
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <h3 className="text-lg font-semibold text-blue-800 mb-2">Key Insights:</h3>
        <ul className="list-disc pl-5 space-y-2 text-blue-800">
          <li>We build the solution from the bottom-up, starting with the base cases.</li>
          <li>Each Fibonacci number depends only on the two previous numbers.</li>
          <li>The time complexity is O(n) - we calculate each number exactly once.</li>
          <li>The space complexity is O(n) for storing all values from 0 to n.</li>
        </ul>
      </div>
    </div>
  );
};

export default FibonacciVisualization;