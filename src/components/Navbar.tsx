import { Link } from 'react-router-dom';
import { useState } from 'react';

interface NavbarProps {
  user: {
    role_id: number;
  } | null;
}

const Navbar: React.FC<NavbarProps> = ({ user }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  if (!user) return null;

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-xl font-bold">
          <Link to="/">Studi1</Link>
        </div>
        <button
          className="md:hidden flex items-center px-3 py-2 border rounded text-gray-200 border-gray-400 hover:text-white hover:border-white"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle Menu"
        >
          <svg className="fill-current h-5 w-5" viewBox="0 0 20 20">
            <title>Menu</title>
            <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
          </svg>
        </button>
        {/* Menu navigasi */}
        <ul
          className={`
            flex-col md:flex-row md:flex space-y-2 md:space-y-0 md:space-x-4
            absolute md:static top-16 left-0 w-full md:w-auto bg-gray-800 md:bg-transparent z-10
            transition-all duration-300 ease-in-out
            ${menuOpen ? 'flex' : 'hidden'} md:flex
          `}
        >
          <li>
            <Link 
              to="/barang" 
              className="block px-4 py-2 hover:text-gray-300 transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              List Barang
            </Link>
          </li>
          <li>
            <Link 
              to="/cart" 
              className="block px-4 py-2 hover:text-gray-300 transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              Keranjang
            </Link>
          </li>
          <li>
            <Link 
              to="/riwayat-belanja" 
              className="block px-4 py-2 hover:text-gray-300 transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              Riwayat Belanja
            </Link>
          </li>
          {user?.role_id === 1 && (
            <li>
              <Link 
                to="/admin/products" 
                className="block px-4 py-2 hover:text-gray-300 transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                Product List
              </Link>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar; 