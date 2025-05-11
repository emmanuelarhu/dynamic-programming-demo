import React, { useState, useEffect } from 'react';

const CoinChangeVisualization = () => {
  const [amount, setAmount] = useState(11);
  const [coins, setCoins] = useState([1, 2, 5]);
  const [currentStep, setCurrentStep] = useState(-1);
  const [animationSpeed, setAnimationSpeed] = useState(1000);
  const [isPlaying, setIsPlaying] = useState(false);
  const [newCoin, setNewCoin] = useState("");
  const [dpTable, setDpTable] = useState([]);
  const [steps, setSteps] = useState([]);
  const [bestCoins, setBestCoins] = useState([]);

  // Calculate coin change with detailed steps
  const calculateCoinChange = () => {
    if (amount < 0 || !coins.length) {
      setDpTable([]);
      setSteps([]);
      setBestCoins([]);
      return;
    }

    // Initialize DP table
    const dp = new Array(amount + 1).fill(Infinity);
    dp[0] = 0;
    
    // To track which coin was last used for each amount
    const lastCoin = new Array(amount + 1).fill(-1);
    
    // Steps for visualization
    const calculationSteps = [];
    
    // Base case
    calculationSteps.push({
      step: 0,
      amount: 0,
      dp: [...dp],
      explanation: "Base case: 0 coins needed to make amount 0",
      choices: []
    });
    
    // Fill the DP table
    for (let currentAmount = 1; currentAmount <= amount; currentAmount++) {
      const choices = [];
      
      for (const coin of coins) {
        if (coin <= currentAmount) {
          const remaining = currentAmount - coin;
          const potentialCoins = dp[remaining] + 1;
          
          choices.push({
            coin: coin,
            remaining: remaining,
            potentialCoins: potentialCoins,
            better: potentialCoins < dp[currentAmount]
          });
          
          if (potentialCoins < dp[currentAmount]) {
            dp[currentAmount] = potentialCoins;
            lastCoin[currentAmount] = coin;
          }
        }
      }
      
      calculationSteps.push({
        step: currentAmount,
        amount: currentAmount,
        dp: [...dp],
        explanation: `Calculating minimum coins for amount ${currentAmount}: ${dp[currentAmount] === Infinity ? 'Not possible' : dp[currentAmount]}`,
        choices: choices
      });
    }
    
    // Reconstruct the solution (which coins were used)
    const usedCoins = [];
    let remainingAmount = amount;
    
    if (dp[amount] !== Infinity) {
      while (remainingAmount > 0) {
        const coin = lastCoin[remainingAmount];
        usedCoins.push(coin);
        remainingAmount -= coin;
      }
    }
    
    setDpTable(dp);
    setSteps(calculationSteps);
    setBestCoins(usedCoins);
  };
  
  // Recalculate when coins or amount changes
  useEffect(() => {
    setCurrentStep(-1);
    setIsPlaying(false);
    calculateCoinChange();
  }, [coins, amount]);
  
  // Animation control
  useEffect(() => {
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
  
  // Animation controls
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
  
  // Coin management
  const handleAddCoin = () => {
    const coin = parseInt(newCoin, 10);
    if (!isNaN(coin) && coin > 0 && !coins.includes(coin)) {
      setCoins([...coins, coin].sort((a, b) => a - b));
      setNewCoin("");
    }
  };
  
  const handleRemoveCoin = (coinToRemove) => {
    if (coins.length > 1) {
      setCoins(coins.filter(c => c !== coinToRemove));
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Coin Change Problem: Bottom-Up Approach</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Target Amount:
            <input
              type="number"
              min="1"
              max="30"
              value={amount}
              onChange={(e) => setAmount(parseInt(e.target.value) || 0)}
              className="ml-3 p-1 border border-gray-300 rounded w-16 text-center"
            />
          </label>
          
          <div className="mt-4">
            <label className="block text-gray-700 font-medium mb-2">Available Coins:</label>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              {coins.map(coin => (
                <div key={coin} className="flex items-center bg-blue-100 px-3 py-1 rounded-full">
                  <div className="w-6 h-6 flex items-center justify-center bg-blue-500 text-white rounded-full font-bold mr-1">
                    {coin}
                  </div>
                  <button 
                    onClick={() => handleRemoveCoin(coin)} 
                    className="ml-1 text-red-500 hover:text-red-700"
                    title={`Remove ${coin} coin`}
                  >
                    ✕
                  </button>
                </div>
              ))}
              <div className="flex items-center">
                <input
                  type="number"
                  min="1"
                  value={newCoin}
                  onChange={(e) => setNewCoin(e.target.value)}
                  placeholder="Add"
                  className="w-16 p-1 border rounded text-center"
                />
                <button 
                  onClick={handleAddCoin}
                  className="ml-1 bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <div className="flex items-center space-x-2 mb-4">
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
          </div>
          
          <div>
            <label className="block text-gray-700 font-medium mb-2">Animation Speed:</label>
            <select
              value={animationSpeed}
              onChange={(e) => setAnimationSpeed(parseInt(e.target.value))}
              className="border border-gray-300 rounded p-2 w-full"
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
        <h3 className="text-lg font-semibold text-gray-700 mb-3">DP Table: Minimum coins needed for each amount</h3>
        
        <div className="overflow-x-auto">
          <div className="flex">
            {Array.from({ length: amount + 1 }, (_, i) => (
              <div
                key={i}
                className={`flex flex-col items-center mx-1 ${
                  currentStep >= 0 && steps[currentStep].step >= i
                    ? 'opacity-100'
                    : 'opacity-40'
                }`}
              >
                <div className="text-xs text-gray-500 mb-1">Amount {i}</div>
                <div 
                  className={`w-12 h-12 flex items-center justify-center rounded-lg font-bold text-lg
                    ${
                      currentStep >= 0 && steps[currentStep].step === i
                        ? 'bg-green-500 text-white ring-4 ring-green-300'
                        : currentStep >= 0 && steps[currentStep].step > i
                          ? i === 0 
                            ? 'bg-blue-100 text-blue-800' 
                            : currentStep >= 0 && steps[currentStep].dp[i] === Infinity
                              ? 'bg-red-100 text-red-800'
                              : 'bg-green-100 text-green-800'
                          : 'bg-gray-200 text-gray-500'
                    }
                  `}
                >
                  {currentStep >= 0 && steps[currentStep].step >= i
                    ? steps[currentStep].dp[i] === Infinity ? "∞" : steps[currentStep].dp[i]
                    : '?'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {currentStep >= 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Current Calculation (Amount {steps[currentStep].amount}):</h3>
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
            <p className="text-lg">{steps[currentStep].explanation}</p>
            
            {steps[currentStep].choices.length > 0 && (
              <div className="mt-3">
                <p className="font-medium">Considering each coin:</p>
                <div className="space-y-2 mt-2">
                  {steps[currentStep].choices.map((choice, idx) => (
                    <div 
                      key={idx}
                      className={`p-2 rounded ${
                        choice.better ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      <span className="font-bold">Coin {choice.coin}:</span> dp[{steps[currentStep].amount} - {choice.coin}] + 1 = dp[{choice.remaining}] + 1 = {
                        choice.potentialCoins === Infinity ? "∞" : choice.potentialCoins
                      }
                      {choice.better && (
                        <span className="ml-2 text-green-600 font-medium">
                          (best option)
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      
      {currentStep >= steps.length - 1 && dpTable[amount] !== Infinity && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Solution:</h3>
          <div className="bg-green-50 border-l-4 border-green-400 p-4">
            <p className="text-lg">
              Minimum coins needed to make amount {amount}: <strong>{dpTable[amount]}</strong>
            </p>
            <div className="mt-2">
              <p className="font-medium">Coins used:</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {bestCoins.map((coin, idx) => (
                  <div
                    key={idx}
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-green-500 text-white font-bold"
                  >
                    {coin}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Code Implementation:</h3>
        <div className="bg-gray-800 text-white p-4 rounded font-mono text-sm overflow-x-auto">
          <pre>{`public static int minCoins(int[] coins, int amount) {
    // Initialize dp array with amount+1 (larger than any result)
    int[] dp = new int[amount + 1];
    for (int i = 0; i <= amount; i++) {
        dp[i] = amount + 1; // Using amount+1 as "infinity"
    }
    
    // Base case: 0 coins needed to make amount 0
    dp[0] = 0;
    
    // Fill dp array from bottom up
    for (int currentAmount = 1; currentAmount <= amount; currentAmount++) {
        // Try each coin denomination
        for (int coin : coins) {
            if (coin <= currentAmount) {
                // Update if using this coin gives a better result
                dp[currentAmount] = Math.min(
                    dp[currentAmount], 
                    dp[currentAmount - coin] + 1
                );
            }
        }
    }
    
    // If amount cannot be made with the given coins
    if (dp[amount] > amount) {
        return -1;
    }
    
    return dp[amount];
}`}</pre>
        </div>
      </div>
      
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <h3 className="text-lg font-semibold text-blue-800 mb-2">Key Insights:</h3>
        <ul className="list-disc pl-5 space-y-2 text-blue-800">
          <li>We build the solution from the bottom-up, amount by amount.</li>
          <li>For each amount, we try all possible coins and take the minimum.</li>
          <li>The recurrence relation is: dp[amount] = min(dp[amount], dp[amount-coin] + 1)</li>
          <li>Time complexity: O(amount × number of coins)</li>
          <li>Space complexity: O(amount) for the dp array</li>
        </ul>
      </div>
    </div>
  );
};

export default CoinChangeVisualization;