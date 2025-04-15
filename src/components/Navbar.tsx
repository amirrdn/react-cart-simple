import { Link } from 'react-router-dom';

interface NavbarProps {
  user: {
    role_id: number;
  } | null;
}

const Navbar: React.FC<NavbarProps> = ({ user }) => {
  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-xl font-bold">
          <Link to="/">Studi1</Link>
        </div>
        <ul className="flex space-x-4">
          <li>
            <Link 
              to="/barang" 
              className="hover:text-gray-300 transition-colors"
            >
              List Barang
            </Link>
          </li>
          <li>
            <Link 
              to="/cart" 
              className="hover:text-gray-300 transition-colors"
            >
              Keranjang
            </Link>
          </li>
          <li>
            <Link 
              to="/riwayat-belanja" 
              className="hover:text-gray-300 transition-colors"
            >
              Riwayat Belanja
            </Link>
          </li>
          {user?.role_id === 1 && (
            <li>
              <Link 
                to="/admin/products" 
                className="hover:text-gray-300 transition-colors"
              >
                Product List
              </Link>
            </li>
          )}
          {/* Tambahkan menu navigasi lainnya di sini jika diperlukan */}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar; 