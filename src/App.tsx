import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login';
// import Dashboard from './Dashboard';
import { useStore } from './store/store';
import './index.css';
import Navbar from './components/Navbar';
import Cart from './components/Cart';
import PurchaseHistory from './PurchaseHistory';
import ProductCatalog from './components/ProductCatalog';
import PaymentPage from './PaymentPage';
import ProductManagement from './pages/ProductManagement';

function App() {
  const token = useStore((s) => s.token);
  const user = useStore((s) => s.user);

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Navbar user={user} />
        <div className="container mx-auto px-4 py-8 mt-16">
          <Routes>
            <Route path="/barang" element={<ProductCatalog />} />
            <Route 
                path="/cart" 
                element={token ? <Cart userId={user?.id || 0} /> : <Navigate to="/login" />} 
            />
            <Route 
                path="/payment/:transaksiId" 
                element={token ? <PaymentPage /> : <Navigate to="/login" />} 
            />
            <Route path="/login" element={!token ? <Login /> : <Navigate to="/dashboard" />} />
            <Route path="/dashboard" element={token ? <ProductCatalog /> : <Navigate to="/login" />} />
            <Route 
              path="/riwayat-belanja" 
              element={token ? <PurchaseHistory /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/admin/products" 
              element={
                token && user?.role_id === 1 
                  ? <ProductManagement /> 
                  : <Navigate to="/login" />
              } 
            />
            <Route path="/" element={<Navigate to={token ? "/dashboard" : "/login"} />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
