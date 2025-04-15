import { useState } from 'react';
import axios from 'axios';
import { useStore } from './store/store';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const login = useStore((s) => s.login);
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post('https://node-typeorm-simple-cart-production.up.railway.app/auth/login', { email, password });
      console.log(res.data.data)
      login(res.data.data.user, res.data.data.token);
      navigate('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold text-center mb-6">Login</h1>
        <div className="space-y-4">
          <input 
            className="w-full border p-2 rounded-md" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            placeholder="Email" 
          />
          <input 
            className="w-full border p-2 rounded-md" 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            placeholder="Password" 
          />
          <button 
            className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
            onClick={handleLogin}
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
}
