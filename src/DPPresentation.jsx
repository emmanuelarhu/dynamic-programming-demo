import React, { useState, useEffect, useRef } from 'react';

export default function DPPresentation() {
  // State for presentation navigation
  const [activeSlide, setActiveSlide] = useState(0);
  const [slideTransition, setSlideTransition] = useState('fade-in');
  const [showHeader, setShowHeader] = useState(true);
  
  // Fibonacci state
  const [fibN, setFibN] = useState(5);
  const [fibSequence, setFibSequence] = useState([]);
  const [fibSteps, setFibSteps] = useState([]);
  const [showFibDetails, setShowFibDetails] = useState(false);
  const [fibAnimationStep, setFibAnimationStep] = useState(-1);
  const [isAnimatingFib, setIsAnimatingFib] = useState(false);
  
  // Coin change state
  const [coinAmount, setCoinAmount] = useState(11);
  const [availableCoins, setAvailableCoins] = useState([1, 2, 5]);
  const [coinResult, setCoinResult] = useState(0);
  const [coinSteps, setCoinSteps] = useState([]);
  const [showCoinDetails, setShowCoinDetails] = useState(false);
  const [newCoin, setNewCoin] = useState("");
  const [coinAnimationStep, setCoinAnimationStep] = useState(-1);
  const [isAnimatingCoin, setIsAnimatingCoin] = useState(false);
  
  // Timer ref for animations
  const timerRef = useRef(null);
  
  // Calculate Fibonacci sequence whenever fibN changes
  useEffect(() => {
    calculateFibonacci(fibN);
  }, [fibN]);
  
  // Calculate Coin Change result whenever amount or coins change
  useEffect(() => {
    calculateCoinChange(coinAmount, availableCoins);
  }, [coinAmount, availableCoins]);

  // Handle slide transitions
  useEffect(() => {
    setSlideTransition('fade-out');
    const timer = setTimeout(() => {
      setSlideTransition('fade-in');
    }, 300);
    return () => clearTimeout(timer);
  }, [activeSlide]);

  // Clean up animations when component unmounts
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  // Calculate Fibonacci sequence with detailed steps
  const calculateFibonacci = (n) => {
    const num = parseInt(n, 10);
    if (isNaN(num) || num < 0) {
      setFibSequence([]);
      setFibSteps([]);
      return;
    }
    
    if (num <= 0) {
      setFibSequence([0]);
      setFibSteps([{ index: 0, value: 0, explanation: "Base case" }]);
      return;
    }
    
    if (num === 1) {
      setFibSequence([0, 1]);
      setFibSteps([
        { index: 0, value: 0, explanation: "Base case" },
        { index: 1, value: 1, explanation: "Base case" }
      ]);
      return;
    }
    
    const result = [0, 1];
    const steps = [
      { index: 0, value: 0, explanation: "Base case" },
      { index: 1, value: 1, explanation: "Base case" }
    ];
    
    for (let i = 2; i <= num; i++) {
      const newVal = result[i-1] + result[i-2];
      result.push(newVal);
      steps.push({
        index: i,
        value: newVal,
        explanation: `dp[${i}] = dp[${i-1}] + dp[${i-2}] = ${result[i-1]} + ${result[i-2]} = ${newVal}`
      });
    }
    
    setFibSequence(result);
    setFibSteps(steps);
  };
  
  // Animate the Fibonacci calculation
const animateFibonacci = () => {
  setFibAnimationStep(-1);
  setIsAnimatingFib(true);
  
  const animateStep = (step) => {
    if (step < fibSteps.length) {
      setFibAnimationStep(step);
      timerRef.current = setTimeout(() => animateStep(step + 1), 1000); // Slower animation for better visibility
    } else {
      setIsAnimatingFib(false);
    }
  };
  
  // Small delay before starting to ensure UI is ready
  setTimeout(() => animateStep(0), 100);
};

  
  // Calculate Coin Change with detailed steps
  const calculateCoinChange = (amount, coins) => {
    amount = parseInt(amount, 10);
    if (isNaN(amount) || amount < 0 || !coins.length) {
      setCoinResult(0);
      setCoinSteps([]);
      return;
    }
    
    // Initialize DP table
    const dp = new Array(amount + 1).fill(Infinity);
    dp[0] = 0;
    
    // Initialize steps tracking
    const steps = [{ amount: 0, value: 0, explanation: "Base case: 0 coins needed for amount 0" }];
    
    // Fill the DP table
    for (let currentAmount = 1; currentAmount <= amount; currentAmount++) {
      const coinChoices = [];
      
      for (const coin of coins) {
        if (coin <= currentAmount) {
          const remaining = currentAmount - coin;
          const potentialCoins = dp[remaining] + 1;
          
          coinChoices.push({
            coin: coin,
            remaining: remaining,
            potentialCoins: potentialCoins,
            better: potentialCoins < dp[currentAmount]
          });
          
          if (potentialCoins < dp[currentAmount]) {
            dp[currentAmount] = potentialCoins;
          }
        }
      }
      
      steps.push({
        amount: currentAmount,
        value: dp[currentAmount],
        choices: coinChoices,
        explanation: `Minimum coins for amount ${currentAmount}: ${dp[currentAmount] === Infinity ? 'Not possible' : dp[currentAmount]}`
      });
    }
    
    setCoinResult(dp[amount] === Infinity ? -1 : dp[amount]);
    setCoinSteps(steps);
  };
  
  // Animate the Coin Change calculation
const animateCoinChange = () => {
  setCoinAnimationStep(-1);
  setIsAnimatingCoin(true);
  
  const animateStep = (step) => {
    if (step < coinSteps.length) {
      setCoinAnimationStep(step);
      timerRef.current = setTimeout(() => animateStep(step + 1), 1000); // Slower for better visibility
    } else {
      setIsAnimatingCoin(false);
    }
  };
  
  // Small delay before starting to ensure UI is ready
  setTimeout(() => animateStep(0), 100);
};
  
  // Add new coin to available coins
  const handleAddCoin = () => {
    const coin = parseInt(newCoin, 10);
    if (!isNaN(coin) && coin > 0 && !availableCoins.includes(coin)) {
      const newCoins = [...availableCoins, coin].sort((a, b) => a - b);
      setAvailableCoins(newCoins);
      setNewCoin("");
    }
  };
  
  // Remove a coin from available coins
  const handleRemoveCoin = (coinToRemove) => {
    if (availableCoins.length > 1) {
      setAvailableCoins(availableCoins.filter(coin => coin !== coinToRemove));
    }
  };

  // Toggle presentation header
  const toggleHeader = () => {
    setShowHeader(!showHeader);
  };

  // Generate background gradient color based on slide index
  const getBackgroundColor = (index) => {
    const colors = [
      'from-blue-100 to-purple-100',
      'from-green-100 to-blue-100',
      'from-yellow-100 to-orange-100',
      'from-pink-100 to-red-100',
      'from-indigo-100 to-purple-100',
      'from-green-100 to-teal-100',
    ];
    return colors[index % colors.length];
  };

  // Slides for the presentation
  const slides = [
    {
    title: "What is Dynamic Programming?",
    content: (
    <div className="p-6">
      <div className="text-center mb-8 fade-in">
        <h2 className="text-3xl font-bold text-indigo-700 mb-4">Dynamic Programming</h2>
        <p className="text-xl text-gray-600 italic">Solving complex problems by breaking them down</p>
      </div>
      
      <div className="flex flex-col md:flex-row gap-6 items-center">
        <div className="w-full md:w-1/2 space-y-4 slide-in-left">
          <p className="text-lg">Dynamic Programming is a powerful technique that:</p>
          
          <ul className="list-disc pl-6 space-y-3 text-gray-700">
            <li className="appear delay-100">
              Breaks down complex problems into simpler <span className="font-bold text-indigo-600">subproblems</span>
            </li>
            <li className="appear delay-300">
              <span className="font-bold text-indigo-600">Stores</span> the solutions to avoid redundant calculations
            </li>
            <li className="appear delay-500">
              <span className="font-bold text-indigo-600">Combines</span> these solutions to solve the original problem
            </li>
            <li className="appear delay-700">
              Dramatically <span className="font-bold text-indigo-600">improves efficiency</span> for certain types of problems
            </li>
          </ul>
        </div>
        
        <div className="w-full md:w-1/2 slide-in-right">
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6 rounded-xl shadow-xl">
            <h3 className="font-bold text-xl mb-4 border-b pb-2">Two Key Properties:</h3>
            <div className="space-y-6">
              <div className="bg-white/20 p-4 rounded-lg backdrop-blur-sm slide-up delay-300">
                <h4 className="font-bold text-lg text-yellow-200">1. Optimal Substructure</h4>
                <p>Optimal solution contains optimal solutions to subproblems</p>
              </div>
              
              <div className="bg-white/20 p-4 rounded-lg backdrop-blur-sm slide-up delay-700">
                <h4 className="font-bold text-lg text-yellow-200">2. Overlapping Subproblems</h4>
                <p>Same subproblems are solved multiple times</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-8 text-center slide-up delay-1000">
        <p className="text-lg font-bold text-indigo-700">Think of DP as "remembering answers to avoid redoing work"</p>
      </div>
    </div>
    )
    },
    {
  title: "Two Approaches to Dynamic Programming",
  content: (
    <div className="p-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-green-700 mb-2">Two Approaches to DP</h2>
        <p className="text-gray-600">Different strategies for the same concept</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Memoization Section */}
        <div className="transform transition-all duration-500 hover:scale-105">
          <div className="bg-gradient-to-br from-green-500 to-green-700 rounded-xl shadow-xl p-6 h-full text-white">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-2xl mb-4">Memoization</h3>
              <span className="text-white/80 text-sm font-bold bg-white/20 px-2 py-1 rounded">Top-Down</span>
            </div>
            
            <div className="space-y-6">
              <div className="bg-white/20 p-4 rounded-lg">
                <h4 className="font-bold">The Approach:</h4>
                <p>Start with the main problem and break it down recursively</p>
              </div>
              
              <ul className="space-y-2 list-disc pl-6">
                <li>Start with the original problem</li>
                <li>Use recursion with a "memory" cache</li>
                <li>Store results of subproblems</li>
                <li>Avoid recalculating the same values</li>
              </ul>
              
              <div className="bg-white/20 p-4 rounded-lg text-sm">
                <div className="font-medium mb-2">Pseudocode for beginners:</div>
                <pre className="font-mono text-sm whitespace-pre-wrap bg-green-900/30 p-3 rounded overflow-auto">
ALGORITHM Fibonacci(n, memo)
BEGIN
    IF memo not initialized THEN
        Initialize memo as empty array
    END IF
    
    IF memo[n] exists THEN
        RETURN memo[n]
    END IF
    
    IF n  1 THEN
        RETURN n
    END IF
    
    memo[n] = Fibonacci(n-1, memo) + Fibonacci(n-2, memo)
    
    RETURN memo[n]
END
                </pre>
              </div>
              
              <div className="bg-white/10 p-3 rounded-lg">
                <p className="text-sm text-yellow-100">
                  <span className="font-bold">Key benefit:</span> We calculate each fibonacci number exactly once, dramatically improving performance!
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Tabulation Section */}
        <div className="transform transition-all duration-500 hover:scale-105">
          <div className="bg-gradient-to-br from-purple-500 to-purple-700 rounded-xl shadow-xl p-6 h-full text-white">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-2xl mb-4">Tabulation</h3>
              <span className="text-white/80 text-sm font-bold bg-white/20 px-2 py-1 rounded">Bottom-Up</span>
            </div>
            
            <div className="space-y-6">
              <div className="bg-white/20 p-4 rounded-lg">
                <h4 className="font-bold">The Approach:</h4>
                <p>Start with base cases and build up to the final solution</p>
              </div>
              
              <ul className="space-y-2 list-disc pl-6">
                <li>Start with smallest subproblems</li>
                <li>Build table of solutions</li>
                <li>Use previously calculated values</li>
                <li>Non-recursive, iterative approach</li>
              </ul>
              
              <div className="bg-white/20 p-4 rounded-lg text-sm">
                <div className="font-medium mb-2">Pseudocode for beginners:</div>
                <pre className="font-mono text-sm whitespace-pre-wrap bg-purple-900/30 p-3 rounded overflow-auto">
ALGORITHM Fibonacci(n) 
BEGIN 
    IF n = 1 THEN 
        RETURN n 
    END IF 
    
    
    dp = array of size n+1 initialized to 0 
    dp[0] = 0 
    dp[1] = 1 
    
    FOR i = 2 TO n DO 
        dp[i] = dp[i-1] + dp[i-2] 
    END FOR 
    
    RETURN dp[n] 
END
                </pre>
              </div>
              
              <div className="bg-white/10 p-3 rounded-lg">
                <p className="text-sm text-yellow-100">
                  <span className="font-bold">Key benefit:</span> Eliminates recursion overhead and often has better space complexity!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Comparison Table */}
      <div className="mt-8">
        <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aspect
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-green-600 uppercase tracking-wider">
                  Memoization (Top-Down)
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-purple-600 uppercase tracking-wider">
                  Tabulation (Bottom-Up)
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  Direction
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  Starts with the original problem and breaks down
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  Starts with base cases and builds up
                </td>
              </tr>
              <tr className="bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  Implementation
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  Recursive with memoization cache
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  Iterative using arrays/tables
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  Space Complexity
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  Can be better when only some states are needed
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  Generally more efficient overall
                </td>
              </tr>
              <tr className="bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  Best For
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  Problems naturally expressed recursively
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  Problems with clear iterative structure
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Tip Box */}
      <div className="mt-6 flex justify-center">
        <div className="bg-yellow-50 border-l-4 border-yellow-400 text-yellow-700 p-4 max-w-2xl rounded shadow-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm">
                <span className="font-bold">Both approaches</span> yield the same result, but the choice depends on the specific problem characteristics. Tabulation generally has better space complexity.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
},
    {
    title: "Example 1: Coin Change Problem",
    content: (
        <div className="p-6">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-teal-600 mb-2">Coin Change Problem</h2>
            <p className="text-gray-600">Find the minimum number of coins needed to make a specific amount</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="bg-gradient-to-r from-teal-100 to-cyan-100 p-5 rounded-xl shadow-md">
                <h3 className="text-xl font-bold text-teal-700 border-b border-teal-200 pb-2 mb-4">Interactive Coin Change Calculator</h3>
                
                <div className="mb-4">
                  <h4 className="font-bold text-teal-700 mb-2">Available Coins:</h4>
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    {availableCoins.map(coin => (
                      <div key={coin} className="flex items-center bg-white px-3 py-2 rounded-full shadow-sm border border-teal-300">
                        <div className="w-8 h-8 flex items-center justify-center bg-teal-500 text-white rounded-full font-bold">
                          {coin}
                        </div>
                        <button 
                          onClick={() => handleRemoveCoin(coin)} 
                          className="ml-2 text-red-500 hover:text-red-700"
                          aria-label={`Remove ${coin} coin`}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    ))}
                    <div className="flex items-center">
                      <input
                        type="number"
                        min="1"
                        value={newCoin}
                        onChange={(e) => setNewCoin(e.target.value)}
                        placeholder="Add coin"
                        className="w-16 p-1 border rounded text-gray-700"
                      />
                      <button 
                        onClick={handleAddCoin}
                        className="ml-1 bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block mb-2 font-medium text-teal-800">
                      Amount:
                      <input
                        type="number"
                        min="1"
                        max="100"
                        value={coinAmount}
                        onChange={(e) => setCoinAmount(parseInt(e.target.value, 10) || 0)}
                        className="ml-2 p-2 border border-teal-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500 text-center bg-white text-gray-700"
                      />
                    </label>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg shadow-inner mb-4">
                    <div className="text-2xl font-bold text-teal-600 mb-2 text-center">
                      Minimum coins for amount {coinAmount}: <span className="text-teal-800">{coinResult < 0 ? "Not possible" : coinResult}</span>
                    </div>
                    
                    {coinResult >= 0 && (
                      <div className="mt-3 border-t border-teal-100 pt-3">
                        <h4 className="font-medium text-teal-700 mb-2">Possible coin combination:</h4>
                        <div className="flex flex-wrap gap-2 justify-center">
                          {(() => {
                            let remaining = coinAmount;
                            let usedCoins = [];
                            
                            // Greedy approach just for visualization - not optimal for all cases
                            const sortedCoins = [...availableCoins].sort((a, b) => b - a);
                            
                            sortedCoins.forEach(coin => {
                              while (remaining >= coin) {
                                usedCoins.push(coin);
                                remaining -= coin;
                              }
                            });
                            
                            return usedCoins.map((coin, idx) => (
                              <div 
                                key={idx}
                                className={`w-10 h-10 flex items-center justify-center rounded-full bg-teal-500 text-white font-bold
                                  ${idx <= coinAnimationStep ? 'opacity-100' : 'opacity-50'} 
                                  ${coinAnimationStep === idx ? 'ring-4 ring-teal-300' : ''}
                                  transition-all duration-300`}
                              >
                                {coin}
                              </div>
                            ));
                          })()}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap gap-3 justify-center">
                    <button 
                      onClick={() => setShowCoinDetails(!showCoinDetails)}
                      className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-teal-300"
                    >
                      {showCoinDetails ? "Hide" : "Show"} Detailed Steps
                    </button>
                    
                    <button 
                      onClick={animateCoinChange}
                      disabled={isAnimatingCoin}
                      className={`${isAnimatingCoin ? 'bg-gray-400' : 'bg-green-500 hover:bg-green-600'} text-white font-bold py-2 px-4 rounded transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-300`}
                    >
                      {isAnimatingCoin ? 'Animating...' : 'Animate Steps'}
                    </button>
                  </div>
                </div>
              </div>
              
              {showCoinDetails && (
  <div className="mt-4 bg-white p-5 rounded-xl border border-teal-200 shadow fade-in">
    <h3 className="font-bold text-lg text-teal-700 mb-3">Building the DP table:</h3>
    
    {/* Visual DP Array representation */}
    <div className="mb-4 p-3 bg-teal-50 rounded-lg border border-teal-100">
      <div className="text-sm text-teal-800 mb-2 font-medium">DP Array Progress:</div>
      <div className="flex flex-wrap items-center gap-2">
        {coinSteps.map((step, idx) => (
          <div 
            key={idx} 
            className={`relative flex flex-col items-center justify-center p-1 ${idx <= coinAnimationStep ? 'opacity-100' : 'opacity-40'}`}
          >
            <div className="text-xs text-gray-500 mb-1">{step.amount}</div>
            <div className={`w-10 h-10 flex items-center justify-center rounded-md font-mono
              ${step.value === Infinity ? 'bg-red-100 text-red-600' : 'bg-teal-100 text-teal-700'}
              ${coinAnimationStep === idx ? 'ring-2 ring-teal-500 pulse-effect' : ''}
              shadow-sm`}
            >
              {step.value === Infinity ? "∞" : step.value}
            </div>
            {coinAnimationStep === idx && (
              <div className="absolute -bottom-1 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-teal-500"></div>
            )}
          </div>
        ))}
      </div>
    </div>
    
    {/* Table-based DP visualization */}
    <div className="overflow-auto max-h-64 rounded-lg shadow-inner bg-teal-50 p-3">
      <table className="min-w-full divide-y divide-teal-200 border-collapse">
        <thead className="bg-teal-100">
          <tr>
            <th scope="col" className="px-4 py-3 text-left text-sm font-medium text-teal-800 rounded-tl-lg">Step</th>
            <th scope="col" className="px-4 py-3 text-left text-sm font-medium text-teal-800">Amount</th>
            <th scope="col" className="px-4 py-3 text-left text-sm font-medium text-teal-800">Min Coins</th>
            <th scope="col" className="px-4 py-3 text-left text-sm font-medium text-teal-800 rounded-tr-lg">Calculation</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-teal-100">
          {coinSteps.map((step, idx) => (
            <tr 
              key={idx}
              className={`transition-all duration-500
                ${coinAnimationStep === idx ? 'bg-teal-200' : (idx <= coinAnimationStep ? 'bg-teal-50' : 'bg-white')}
                ${coinAnimationStep === idx ? 'pulse-effect' : ''}`}
            >
              <td className="px-4 py-3 whitespace-nowrap font-medium">
                Step {idx}
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                <div className="flex items-center">
                  <div className={`w-8 h-8 flex items-center justify-center rounded-full 
                    ${idx <= coinAnimationStep ? 'bg-teal-500 text-white' : 'bg-gray-200 text-gray-700'} 
                    font-bold ${coinAnimationStep === idx ? 'pulse-effect' : ''}`}>
                    {step.amount}
                  </div>
                </div>
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                <span className={`font-mono ${step.value === Infinity ? 'text-red-600' : 'text-teal-800'}`}>
                  {step.value === Infinity ? "∞" : step.value} coins
                </span>
              </td>
              <td className="px-4 py-3">
                {step.amount > 0 && step.choices && step.choices.length > 0 ? (
                  <div className="text-sm">
                    <div className="space-y-1">
                      {step.choices.map((choice, choiceIdx) => (
                        <div 
                          key={choiceIdx} 
                          className={`p-1.5 rounded ${choice.better ? 'bg-green-100 text-green-800' : 'text-gray-700'}
                          ${coinAnimationStep === idx && choice.better ? 'pulse-effect' : ''}`}
                        >
                          <span className="font-medium">Coin {choice.coin}:</span> dp[{step.amount} - {choice.coin}] + 1 = dp[{choice.remaining}] + 1 = {choice.potentialCoins}
                          {choice.better && (
                            <span className="ml-2 text-green-600 font-medium">
                              (best)
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <span className="text-gray-500 text-sm italic">
                    {step.amount === 0 ? "Base case: 0 coins needed for amount 0" : "No valid coins for this amount"}
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    
    {/* DP State Explanation */}
    <div className="mt-4 bg-blue-50 p-3 rounded-lg border border-blue-100">
      <h4 className="font-medium text-blue-700 mb-2">How the DP Table Works:</h4>
      <ul className="text-sm space-y-1 text-gray-700">
        <li>• <strong>dp[amount]</strong> = minimum number of coins needed to make that amount</li>
        <li>• We start with <strong>dp[0] = 0</strong> (base case: 0 coins to make amount 0)</li>
        <li>• For each amount, we try using each coin and take the minimum</li>
        <li>• Formula: <strong>dp[amount] = min(dp[amount], dp[amount-coin] + 1)</strong></li>
        <li>• If no combination is possible, the value remains <strong>∞</strong> (infinity)</li>
      </ul>
    </div>
  </div>
              )}
            </div>
            
            <div className="lg:col-span-1 space-y-4">
              <div className="bg-gradient-to-r from-blue-100 to-cyan-100 p-5 rounded-xl shadow-md">
                <h3 className="text-xl font-bold text-blue-700 border-b border-blue-200 pb-2 mb-4">Problem Statement</h3>
                
                <div className="space-y-3 text-gray-700">
                  <p><span className="font-bold">Given:</span> A set of coin denominations and a target amount</p>
                  <p><span className="font-bold">Find:</span> The minimum number of coins needed to make the amount</p>
                  <p><span className="font-bold">Example:</span> With coins [1,2,5] and amount 11</p>
                  <p><span className="font-bold">Answer:</span> 3 coins (5+5+1)</p>
                </div>
                
                <div className="mt-4 bg-blue-50 p-3 rounded-lg border border-blue-200">
                  <h4 className="font-bold text-blue-600 mb-2">DP Approach:</h4>
                  <ol className="list-decimal pl-5 space-y-1 text-sm text-gray-700">
                    <li>Create a table of size amount+1</li>
                    <li>Initialize dp[0] = 0 (base case)</li>
                    <li>For each amount from 1 to target:</li>
                    <li className="pl-5">For each available coin:</li>
                    <li className="pl-10">If coin ≤ current amount:</li>
                    <li className="pl-15">Try using this coin and check if it gives a better solution</li>
                  </ol>
                </div>
              </div>
              
              <div className="bg-white p-5 rounded-xl border border-gray-200 shadow">
                <h3 className="text-xl font-bold text-gray-700 mb-3">Code Implementation</h3>
                <div className="bg-gray-800 text-gray-100 p-3 rounded font-mono text-sm">
                  <div>
                    <span className="text-pink-400">function</span> <span className="text-blue-300">coinChange</span>(<span className="text-orange-300">coins, amount</span>) {'{'}
                  </div>
                  <div className="pl-4">
                    <span className="text-pink-400">const</span> dp = <span className="text-pink-400">new</span> Array(amount + <span className="text-green-300">1</span>).fill(Infinity);
                  </div>
                  <div className="pl-4">
                    dp[<span className="text-green-300">0</span>] = <span className="text-green-300">0</span>;  <span className="text-gray-500">// Base case</span>
                  </div>
                  <div className="pl-4">
                    <span className="text-pink-400">for</span> (<span className="text-pink-400">let</span> i = <span className="text-green-300">1</span>; i &lt;= amount; i++) {'{'}
                  </div>
                  <div className="pl-8">
                    <span className="text-pink-400">for</span> (<span className="text-pink-400">const</span> coin of coins) {'{'}
                  </div>
                  <div className="pl-12">
                    <span className="text-pink-400">if</span> (coin &lt;= i) {'{'}
                  </div>
                  <div className="pl-16">
                    dp[i] = Math.<span className="text-blue-300">min</span>(dp[i], dp[i - coin] + <span className="text-green-300">1</span>);
                  </div>
                  <div className="pl-12">{'}'}
                  </div>
                  <div className="pl-8">{'}'}
                  </div>
                  <div className="pl-4">{'}'}
                  </div>
                  <div className="pl-4">
                    <span className="text-pink-400">return</span> dp[amount] === Infinity ? -<span className="text-green-300">1</span> : dp[amount];
                  </div>
                  <div>{'}'}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
    )
    },
    {
    title: "Time & Space Complexity",
    content: (
        <div className="p-6">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-purple-700 mb-2">Time & Space Complexity</h2>
            <p className="text-gray-600">Understanding the efficiency of Dynamic Programming solutions</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-5 rounded-xl shadow-md">
              <h3 className="text-xl font-bold text-purple-700 border-b border-purple-200 pb-2 mb-4">Fibonacci Complexity</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg bg-red-50">
                  <p className="font-bold text-red-700">Without DP:</p>
                  <div className="space-y-1 mt-2">
                    <div className="flex justify-between">
                      <span className="font-medium">Time:</span>
                      <span className="font-mono">O(2<sup>n</sup>)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Space:</span>
                      <span className="font-mono">O(n)</span>
                    </div>
                    <p className="mt-2 text-red-700 text-sm">Exponential growth - Very slow!</p>
                  </div>
                </div>
                
                <div className="p-4 border rounded-lg bg-green-50">
                  <p className="font-bold text-green-700">With Memoization:</p>
                  <div className="space-y-1 mt-2">
                    <div className="flex justify-between">
                      <span className="font-medium">Time:</span>
                      <span className="font-mono">O(n)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Space:</span>
                      <span className="font-mono">O(n)</span>
                    </div>
                    <p className="mt-2 text-green-700 text-sm">Linear - Much faster!</p>
                  </div>
                </div>
                
                <div className="p-4 border rounded-lg bg-green-50">
                  <p className="font-bold text-green-700">With Tabulation:</p>
                  <div className="space-y-1 mt-2">
                    <div className="flex justify-between">
                      <span className="font-medium">Time:</span>
                      <span className="font-mono">O(n)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Space:</span>
                      <span className="font-mono">O(n)</span>
                    </div>
                    <p className="mt-2 text-green-700 text-sm">Linear - Efficient!</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-5 bg-white p-4 rounded-lg shadow-inner">
                <h4 className="font-bold text-purple-600 mb-2">Visualizing the Difference</h4>
                <p className="text-sm text-gray-700 mb-3">Time complexity growth as n increases:</p>
                
                <div className="h-32 bg-gray-100 rounded-lg p-2 relative">
                  {/* Exponential curve */}
                  <div className="absolute bottom-0 left-0 right-0 h-24 overflow-hidden">
                    <div 
                      className="absolute bottom-0 right-0 w-full h-96 bg-red-200 opacity-50 rounded-tl-full"
                      style={{transform: 'scale(1.2)'}}
                    ></div>
                    <div className="absolute bottom-2 right-4 text-xs text-red-700">O(2<sup>n</sup>)</div>
                  </div>
                  
                  {/* Linear line */}
                  <div className="absolute bottom-0 left-0 h-24 w-full">
                    <div 
                      className="absolute bottom-0 left-0 right-0 h-0 bg-green-500"
                      style={{
                        transform: 'rotate(-5deg)',
                        transformOrigin: 'bottom left',
                        height: '2px'
                      }}
                    ></div>
                    <div className="absolute bottom-10 right-4 text-xs text-green-700">O(n)</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-blue-100 to-indigo-100 p-5 rounded-xl shadow-md">
              <h3 className="text-xl font-bold text-blue-700 border-b border-blue-200 pb-2 mb-4">Coin Change Complexity</h3>
              
              <div className="p-4 border rounded-lg bg-blue-50 mb-4">
                <div className="space-y-3">
                  <div>
                    <p className="font-bold text-blue-700">Time Complexity:</p>
                    <div className="flex items-center mt-1">
                      <span className="font-mono bg-blue-100 p-1 rounded">O(amount × number of coins)</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      We have two nested loops: one over the amount and one over the coins
                    </p>
                  </div>
                  
                  <div>
                    <p className="font-bold text-blue-700">Space Complexity:</p>
                    <div className="flex items-center mt-1">
                      <span className="font-mono bg-blue-100 p-1 rounded">O(amount)</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      We need to store results for each amount from 0 to the target amount
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow-inner">
                <h4 className="font-bold text-blue-600 mb-3">Optimization Tip</h4>
                <p className="text-gray-700 mb-3">Some DP solutions can be optimized further:</p>
                
                <div className="bg-yellow-50 p-3 rounded-lg border-l-4 border-yellow-400">
                  <p className="text-sm">
                    <span className="font-bold">Space Optimization:</span> For problems like the coin change, we can sometimes optimize the space complexity by only keeping track of the last few states rather than the entire table.
                  </p>
                </div>
                
                <div className="mt-4 bg-green-50 p-3 rounded-lg border-l-4 border-green-400">
                  <p className="text-sm">
                    <span className="font-bold">Early Termination:</span> In some problems, we can stop the computation early if we've already found the optimal solution, reducing the average time complexity.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
    )
    },
    {
    title: "Example 2: Fibonacci Sequence",
    content: (
        <div className="p-6">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-amber-600 mb-2">Fibonacci Sequence</h2>
            <p className="text-xl text-gray-600">0, 1, 1, 2, 3, 5, 8, 13, 21, ...</p>
            <p className="text-gray-600 italic">Each number is the sum of the previous two</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="bg-gradient-to-r from-amber-100 to-orange-100 p-5 rounded-xl shadow-md">
                <h3 className="text-xl font-bold text-amber-700 border-b border-amber-200 pb-2 mb-4">Interactive Fibonacci Calculator</h3>
                
                <div className="mb-4">
                  <label className="flex items-center text-amber-800 font-medium">
                    <span className="mr-3">Calculate Fibonacci of:</span>
                    <div className="relative w-24">
                      <input
                        type="number"
                        min="0"
                        max="30"
                        value={fibN}
                        onChange={(e) => setFibN(parseInt(e.target.value, 10) || 0)}
                        className="w-full p-2 border border-amber-300 rounded focus:outline-none focus:ring-2 focus:ring-amber-500 text-center bg-white"
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                        <span className="text-amber-500">n</span>
                      </div>
                    </div>
                  </label>
                </div>
                
                <div className="bg-white p-4 rounded-lg shadow-inner mb-4 text-center">
                  <div className="text-2xl font-bold text-amber-600 mb-2">
                    Fibonacci({fibN}) = <span className="text-amber-800">{fibSequence[fibN] || 0}</span>
                  </div>
                  
                  <div className="flex flex-wrap justify-center gap-2 mt-4">
                    {fibSequence.map((num, index) => (
                      <div 
                        key={index}
                        className={`w-10 h-10 flex items-center justify-center rounded-full text-white font-bold
                          ${index <= fibAnimationStep ? 'bg-amber-500' : 'bg-gray-300'} 
                          ${fibAnimationStep === index ? 'ring-4 ring-amber-300' : ''}
                          transition-all duration-300`}
                      >
                        {num}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-3 justify-center">
                  <button 
                    onClick={() => setShowFibDetails(!showFibDetails)}
                    className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 px-4 rounded transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-amber-300"
                  >
                    {showFibDetails ? "Hide" : "Show"} Detailed Steps
                  </button>
                  
                  <button 
                    onClick={animateFibonacci}
                    disabled={isAnimatingFib}
                    className={`${isAnimatingFib ? 'bg-gray-400' : 'bg-green-500 hover:bg-green-600'} text-white font-bold py-2 px-4 rounded transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-300`}
                  >
                    {isAnimatingFib ? 'Animating...' : 'Animate Steps'}
                  </button>
                </div>
              </div>
              
              {showFibDetails && (
                <div className="mt-4 bg-white p-5 rounded-xl border border-amber-200 shadow fade-in">
                  <h3 className="font-bold text-lg text-amber-700 mb-3">Building the table for fib({fibN}):</h3>
                  <div className="overflow-auto max-h-64 rounded-lg shadow-inner bg-amber-50 p-3">
                    {fibSteps.map((step, idx) => (
                      <div 
                        key={idx}
                        className={`mb-2 p-2 rounded transition-all duration-500 border-b border-amber-100
                          ${fibAnimationStep === idx ? 'bg-amber-200' : (idx <= fibAnimationStep ? 'bg-amber-100' : 'bg-white')}
                          ${fibAnimationStep === idx ? 'pulse-effect' : ''}`}
                      >
                        <div className="flex items-center gap-2">
                          <div className={`w-8 h-8 flex items-center justify-center rounded-full 
                            ${idx <= fibAnimationStep ? 'bg-amber-500 text-white' : 'bg-gray-200 text-gray-700'} 
                            font-bold ${fibAnimationStep === idx ? 'pulse-effect' : ''}`}>
                            {step.index}
                          </div>
                          <code className="font-mono text-amber-800">dp[{step.index}] = {step.value}</code>
                        </div>
                        <p className="text-gray-600 text-sm mt-1 pl-10">{step.explanation}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div className="lg:col-span-1 space-y-4">
              <div className="bg-gradient-to-r from-indigo-100 to-purple-100 p-5 rounded-xl shadow-md">
                <h3 className="text-xl font-bold text-indigo-700 border-b border-indigo-200 pb-2 mb-4">Comparison</h3>
                
                <div className="space-y-4">
                  <div className="bg-white p-3 rounded-lg shadow-inner">
                    <h4 className="font-bold text-red-500">Without DP</h4>
                    <div className="flex items-center gap-2">
                      <div className="w-20 text-sm text-gray-600">Time:</div>
                      <div className="font-mono text-red-600">O(2<sup>n</sup>)</div>
                    </div>
                    <div className="text-sm text-red-500 mt-1">Exponential growth - Very inefficient!</div>
                  </div>
                  
                  <div className="bg-white p-3 rounded-lg shadow-inner">
                    <h4 className="font-bold text-green-500">With DP</h4>
                    <div className="flex items-center gap-2">
                      <div className="w-20 text-sm text-gray-600">Time:</div>
                      <div className="font-mono text-green-600">O(n)</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-20 text-sm text-gray-600">Space:</div>
                      <div className="font-mono text-green-600">O(n)</div>
                    </div>
                    <div className="text-sm text-green-500 mt-1">Linear growth - Highly efficient!</div>
                  </div>
                </div>
                
                <div className="mt-4 bg-yellow-100 p-3 rounded-lg border-l-4 border-yellow-400">
                  <p className="text-sm text-yellow-800">
                    <span className="font-bold">Did you know?</span> Without DP, calculating fib(50) would take trillions of operations!
                  </p>
                </div>
              </div>
              
              <div className="bg-white p-5 rounded-xl border border-gray-200 shadow">
                <h3 className="text-xl font-bold text-gray-700 mb-3">Code Implementation</h3>
                <div className="bg-gray-800 text-gray-100 p-3 rounded font-mono text-sm">
                  <div>
                    <span className="text-pink-400">function</span> <span className="text-blue-300">fibDP</span>(<span className="text-orange-300">n</span>) {'{'}
                  </div>
                  <div className="pl-4">
                    <span className="text-pink-400">const</span> dp = [<span className="text-green-300">0</span>, <span className="text-green-300">1</span>];
                  </div>
                  <div className="pl-4">
                    <span className="text-pink-400">for</span> (<span className="text-pink-400">let</span> i = <span className="text-green-300">2</span>; i &lt;= n; i++) {'{'}
                  </div>
                  <div className="pl-8">
                    dp[i] = dp[i-<span className="text-green-300">1</span>] + dp[i-<span className="text-green-300">2</span>];
                  </div>
                  <div className="pl-4">{'}'}
                  </div>
                  <div className="pl-4">
                    <span className="text-pink-400">return</span> dp[n];
                  </div>
                  <div>{'}'}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
    )
    },
    {
    title: "Tips for Solving DP Problems",
    content: (
        <div className="p-6">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-indigo-700 mb-2">Mastering Dynamic Programming</h2>
            <p className="text-gray-600">A step-by-step approach to solving DP problems</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-r from-indigo-100 to-purple-100 p-5 rounded-xl shadow-md">
              <h3 className="text-xl font-bold text-indigo-700 border-b border-indigo-200 pb-2 mb-4">Problem-Solving Steps</h3>
              
              <ol className="space-y-6">
                <li className="flex">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-500 text-white font-bold">1</div>
                  </div>
                  <div className="ml-4">
                    <h4 className="font-bold text-indigo-700">Identify if DP is applicable</h4>
                    <p className="text-gray-700 mt-1">Look for overlapping subproblems and optimal substructure</p>
                    <p className="text-sm text-indigo-600 mt-1">Ask: "Do I solve the same subproblems multiple times?"</p>
                  </div>
                </li>
                
                <li className="flex">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-500 text-white font-bold">2</div>
                  </div>
                  <div className="ml-4">
                    <h4 className="font-bold text-indigo-700">Define the state</h4>
                    <p className="text-gray-700 mt-1">What information do we need to represent a subproblem?</p>
                    <p className="text-sm text-indigo-600 mt-1">Example: "fib[i] = minimum coins to make amount i"</p>
                  </div>
                </li>
                
                <li className="flex">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-500 text-white font-bold">3</div>
                  </div>
                  <div className="ml-4">
                    <h4 className="font-bold text-indigo-700">Formulate the recurrence relation</h4>
                    <p className="text-gray-700 mt-1">How does the current state relate to previous states?</p>
                    <p className="text-sm text-indigo-600 mt-1">Example: "fib[i] = min(fib[i], fib[i-coin] + 1)"</p>
                  </div>
                </li>
                
                <li className="flex">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-500 text-white font-bold">4</div>
                  </div>
                  <div className="ml-4">
                    <h4 className="font-bold text-indigo-700">Identify the base cases</h4>
                    <p className="text-gray-700 mt-1">What are the simplest subproblems we can solve directly?</p>
                    <p className="text-sm text-indigo-600 mt-1">Example: "fib[0] = 0" (0 coins to make amount 0)</p>
                  </div>
                </li>
              </ol>
            </div>
            
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-pink-100 to-red-100 p-5 rounded-xl shadow-md">
                <h3 className="text-xl font-bold text-pink-700 border-b border-pink-200 pb-2 mb-4">Implementation Steps</h3>
                
                <ol className="space-y-4">
                  <li className="flex">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-pink-500 text-white font-bold">5</div>
                    </div>
                    <div className="ml-4">
                      <h4 className="font-bold text-pink-700">Decide the approach</h4>
                      <p className="text-gray-700 mt-1">Memoization (top-down) or tabulation (bottom-up)?</p>
                    </div>
                  </li>
                  
                  <li className="flex">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-pink-500 text-white font-bold">6</div>
                    </div>
                    <div className="ml-4">
                      <h4 className="font-bold text-pink-700">Implement the solution</h4>
                      <p className="text-gray-700 mt-1">Write the code and test with examples</p>
                    </div>
                  </li>
                  
                  <li className="flex">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-pink-500 text-white font-bold">7</div>
                    </div>
                    <div className="ml-4">
                      <h4 className="font-bold text-pink-700">Optimize if needed</h4>
                      <p className="text-gray-700 mt-1">Can we reduce time or space complexity?</p>
                    </div>
                  </li>
                </ol>
              </div>
              
              <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-md">
                <h3 className="text-xl font-bold text-gray-700 mb-4">Common DP Problem Types</h3>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <h4 className="font-bold text-blue-700">Optimization Problems</h4>
                    <ul className="list-disc pl-5 text-sm mt-1 text-gray-700">
                      <li>Knapsack Problem</li>
                      <li>Coin Change</li>
                      <li>Rod Cutting</li>
                    </ul>
                  </div>
                  
                  <div className="p-3 bg-green-50 rounded-lg">
                    <h4 className="font-bold text-green-700">Counting Problems</h4>
                    <ul className="list-disc pl-5 text-sm mt-1 text-gray-700">
                      <li>Number of Ways to Climb Stairs</li>
                      <li>Count Possible Decodings</li>
                      <li>Unique Paths in a Grid</li>
                    </ul>
                  </div>
                  
                  <div className="p-3 bg-yellow-50 rounded-lg">
                    <h4 className="font-bold text-yellow-700">String Problems</h4>
                    <ul className="list-disc pl-5 text-sm mt-1 text-gray-700">
                      <li>Longest Common Subsequence</li>
                      <li>Edit Distance</li>
                      <li>Palindromic Substrings</li>
                    </ul>
                  </div>
                  
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <h4 className="font-bold text-purple-700">Game Theory</h4>
                    <ul className="list-disc pl-5 text-sm mt-1 text-gray-700">
                      <li>Nim Game</li>
                      <li>Stone Game</li>
                      <li>Predict the Winner</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 bg-gradient-to-r from-green-100 to-emerald-100 p-5 rounded-xl shadow-md">
            <h3 className="text-xl font-bold text-green-700 text-center mb-4">Practice Makes Perfect!</h3>
            
            <div className="text-center">
              <p className="text-gray-700 mb-3">
                The key to mastering Dynamic Programming is to practice many different problems and recognize the patterns.
              </p>
              
              <div className="inline-block bg-white p-4 rounded-lg shadow">
                <p className="font-bold text-green-700">Suggested next problems to try:</p>
                <ul className="text-left mt-2 space-y-1 text-gray-700">
                  <li>1. Longest Increasing Subsequence</li>
                  <li>2. House Robber Problem</li>
                  <li>3. Maximum Subarray</li>
                  <li>4. Climb Stairs</li>
                  <li>5. 0/1 Knapsack Problem</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
    )
    }
  ];

  // Navigation controls
  const nextSlide = () => {
    if (activeSlide < slides.length - 1) {
      setActiveSlide(activeSlide + 1);
    }
  };
  
  const prevSlide = () => {
    if (activeSlide > 0) {
      setActiveSlide(activeSlide - 1);
    }
  };
  
  return (
    <div className={`max-w-7xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden transition-all duration-300 ${getBackgroundColor(activeSlide)}`}>
      {/* Header with toggle button */}
      {showHeader && (
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Dynamic Programming: A Visual Guide</h1>
          <div className="flex items-center space-x-3">
            <div className="text-sm font-semibold bg-white/20 px-3 py-1 rounded-full">
              Slide {activeSlide + 1} of {slides.length}
            </div>
            <button 
              onClick={toggleHeader}
              className="p-1 rounded-full hover:bg-white/20"
              aria-label="Toggle header"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
            </button>
          </div>
        </div>
      )}
      
      {/* Collapsed header (just toggle button) */}
      {!showHeader && (
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-1 px-4 flex justify-end">
          <button 
            onClick={toggleHeader}
            className="p-1 rounded-full hover:bg-white/20"
            aria-label="Toggle header"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      )}
      
      {/* Navigation */}
      <div className="flex justify-between items-center px-6 py-4">
        <button 
          onClick={prevSlide} 
          disabled={activeSlide === 0}
          className={`flex items-center space-x-2 px-4 py-2 rounded-full ${activeSlide === 0 ? 
            'bg-gray-200 text-gray-400 cursor-not-allowed' : 
            'bg-indigo-600 text-white hover:bg-indigo-700 transform transition hover:scale-105'}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          <span>Previous</span>
        </button>
        
        <div className="text-xl font-bold text-center text-indigo-800">
          {slides[activeSlide].title}
        </div>
        
        <button 
          onClick={nextSlide} 
          disabled={activeSlide === slides.length - 1}
          className={`flex items-center space-x-2 px-4 py-2 rounded-full ${activeSlide === slides.length - 1 ? 
            'bg-gray-200 text-gray-400 cursor-not-allowed' : 
            'bg-indigo-600 text-white hover:bg-indigo-700 transform transition hover:scale-105'}`}
        >
          <span>Next</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
      
      {/* Slide content */}
      <div className={`py-2 px-4 transition-opacity duration-300 ${slideTransition === 'fade-in' ? 'opacity-100' : 'opacity-0'}`}>
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="min-h-[500px] max-h-[70vh] overflow-y-auto p-1">
            {slides[activeSlide].content}
          </div>
        </div>
      </div>
      
      {/* Slide navigation dots */}
      <div className="flex justify-center space-x-2 py-4">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setActiveSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 transform ${
              activeSlide === index 
                ? 'bg-indigo-600 scale-125' 
                : 'bg-gray-300 hover:bg-indigo-300'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
      
      {/* Presentation controls */}
      <div className="bg-gray-100 px-6 py-3 flex justify-between items-center text-sm text-gray-600 border-t border-gray-200">
        <div>
          <span className="font-medium">Tip:</span> Use arrow keys to navigate between slides
        </div>
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => setActiveSlide(0)}
            className="flex items-center space-x-1 hover:text-indigo-600"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
            <span>First Slide</span>
          </button>
          <button 
            onClick={() => setActiveSlide(slides.length - 1)}
            className="flex items-center space-x-1 hover:text-indigo-600"
          >
            <span>Last Slide</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

// CSS for animations
const styles = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  @keyframes fadeInLeft {
    from { 
      opacity: 0;
      transform: translateX(-20px);
    }
    to { 
      opacity: 1;
      transform: translateX(0);
    }
  }
  
  @keyframes fadeInRight {
    from { 
      opacity: 0;
      transform: translateX(20px);
    }
    to { 
      opacity: 1;
      transform: translateX(0);
    }
  }
  
  @keyframes fadeUp {
    from { 
      opacity: 0;
      transform: translateY(20px);
    }
    to { 
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes bounceOnce {
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-20px);
    }
  }
  
  .animate-fadeIn {
    animation: fadeIn 1s ease-out forwards;
  }
  
  .animate-fadeInLeft {
    animation: fadeInLeft 1s ease-out forwards;
  }
  
  .animate-fadeInRight {
    animation: fadeInRight 1s ease-out forwards;
  }
  
  .animate-fadeUp {
    animation: fadeUp 1s ease-out forwards;
  }
  
  .animate-bounceOnce {
    animation: bounceOnce 2s ease-in-out;
  }
  
  .animate-appear {
    opacity: 0;
    animation: fadeIn 0.8s ease-out forwards;
  }
`;

// Add styles to document (in a real application, you'd add this to your CSS file)
const styleElement = document.createElement('style');
styleElement.textContent = styles;
document.head.appendChild(styleElement);