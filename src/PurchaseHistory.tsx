import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { Transaksi } from './types/cart';
import { useStore } from './store/store';
import { useNavigate } from 'react-router-dom';
import { BanknotesIcon, QrCodeIcon, CreditCardIcon } from '@heroicons/react/24/outline';

const getPaymentIcon = (metodePembayaran: string | undefined) => {
  if (!metodePembayaran) return null;
  
  switch (metodePembayaran) {
    case 'TRANSFER':
      return <BanknotesIcon className="w-5 h-5" />;
    case 'KARTU_KREDIT':
    case 'KARTU_DEBIT':
      return <CreditCardIcon className="w-5 h-5" />;
    case 'E_WALLET':
      return <QrCodeIcon className="w-5 h-5" />;
    default:
      return null;
  }
};

const PurchaseHistory = () => {
  const [transactions, setTransactions] = useState<Transaksi[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const token = useStore((s) => s.token);
  const navigate = useNavigate();

  const fetchTransactions = useCallback(async () => {
    try {
      const response = await axios.get('https://node-typeorm-simple-cart-production.up.railway.app/transaksi', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setTransactions(response.data.data);
      setLoading(false);
    } catch {
      setError('Gagal memuat riwayat transaksi');
      setLoading(false);
    }
  }, [token]);

  const handleDelete = async (id: number) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus riwayat transaksi ini?')) {
      return;
    }

    try {
      await axios.delete(`https://node-typeorm-simple-cart-production.up.railway.app/transaksi/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      fetchTransactions();
    } catch {
      setError('Gagal menghapus riwayat transaksi');
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [token, fetchTransactions]);

  if (loading) return <div className="text-center p-4">Memuat...</div>;
  if (error) return <div className="text-center text-red-500 p-4">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Riwayat Belanja</h1>
      <div className="space-y-4">
        {transactions && transactions.map((transaction) => (
          <div key={transaction.id} className="border rounded-lg p-4 shadow-sm">
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold">Kode: {transaction.kode_transaksi}</span>
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-sm ${
                  transaction.status === 'selesai' ? 'bg-green-100 text-green-800' :
                  transaction.status === 'dibatalkan' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {transaction.status}
                </span>
                {transaction.status === 'pending' && !transaction.pembayaran && (
                  <button
                    onClick={() => navigate(`/payment/${transaction.id}`)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded-full text-sm"
                  >
                    Bayar Sekarang
                  </button>
                )}
                {transaction.status !== 'selesai' && (
                  <button
                    onClick={() => transaction.id && handleDelete(transaction.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-full text-sm"
                  >
                    Hapus
                  </button>
                )}
              </div>
            </div>
            <div className="text-sm text-gray-600">
              Tanggal: {new Date(transaction.created_at).toLocaleDateString('id-ID')}
            </div>
            <div className="mt-2 text-sm">
              <div className="flex space-x-4">
                <div className="flex items-center">
                  <span className="font-medium">Metode Pembayaran:</span>{' '}
                  <span className="text-gray-600 flex items-center gap-1">
                    {getPaymentIcon(transaction.pembayaran?.metode_pembayaran)}
                    {transaction.pembayaran?.metode_pembayaran}
                  </span>
                </div>
                <div>
                  <span className="font-medium">Status Pembayaran:</span>{' '}
                  <span className={`px-2 py-0.5 rounded-full text-sm ${
                    transaction.pembayaran?.status_pembayaran === 'SUCCESS' ? 'bg-green-100 text-green-800' :
                    transaction.pembayaran?.status_pembayaran === 'FAILED' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {transaction.pembayaran?.status_pembayaran || 'PENDING'}
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-2">
              <div className="font-medium">Detail Barang:</div>
              {transaction.details.map((item, index) => (
                <div key={index} className="ml-4 mt-1 flex items-center space-x-4">
                  <img 
                    src={`https://node-typeorm-simple-cart-production.up.railway.app/uploads/${item.barang?.gambar}`}
                    alt={item.barang?.nama}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div>
                    <div>{item.nama_barang} ({item.jumlah}x)</div>
                    <div className="text-gray-600">{new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
              }).format(item?.subtotal || 0).replace('IDR', '')}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3 text-right font-bold">
              Total: {new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
              }).format(transaction.total_harga || 0).replace('IDR', '')}
            </div>
          </div>
        ))}
        {transactions.length === 0 && (
          <div className="text-center text-gray-500">
            Belum ada riwayat transaksi
          </div>
        )}
      </div>
    </div>
  );
};

export default PurchaseHistory; 