import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useStore } from './store/store';
import { BanknotesIcon, QrCodeIcon, CreditCardIcon } from '@heroicons/react/24/outline';
import { MetodePembayaran } from './constants/payment';
const apiUrl = import.meta.env.VITE_API_URL;

interface PaymentMethod {
  id: MetodePembayaran;
  name: string;
  icon: React.FC<{ className?: string }>;
}

interface Transaction {
  id: string;
  kodeTransaksi: string;
  totalHarga: number;
  status: string;
}

const formatRupiah = (angka: number) => {
  const reverse = angka.toString().split('').reverse().join('');
  const ribuan = reverse.match(/\d{1,3}/g);
  const hasil = ribuan?.join('.').split('').reverse().join('');
  return `Rp ${hasil}`;
};

const PaymentPage = () => {
  const { transaksiId } = useParams();
  const navigate = useNavigate();
  const token = useStore((s) => s.token);
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<MetodePembayaran | null>(null);
  const [loading, setLoading] = useState(true);

  const paymentMethods: PaymentMethod[] = [
    {
      id: MetodePembayaran.TRANSFER,
      name: 'Transfer Bank',
      icon: BanknotesIcon
    },
    {
      id: MetodePembayaran.KARTU_KREDIT,
      name: 'Kartu Kredit',
      icon: CreditCardIcon
    },
    {
      id: MetodePembayaran.KARTU_DEBIT,
      name: 'Kartu Debit',
      icon: CreditCardIcon
    },
    {
      id: MetodePembayaran.E_WALLET,
      name: 'E-Wallet',
      icon: QrCodeIcon
    }
  ];
  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        const response = await axios.get(`${apiUrl}/transaksi/${transaksiId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTransaction(response.data);
      } catch (error) {
        console.error('Error fetching transaction:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransaction();
  }, [transaksiId, token]);

  const handlePayment = async () => {
    if (!selectedMethod) {
      alert('Silakan pilih metode pembayaran');
      return;
    }

    try {
        await axios.post(
            `${apiUrl}/pembayaran`,
            { 
                metode_pembayaran: selectedMethod,
                transaksi_id: transaksiId 
            },
            { headers: { Authorization: `Bearer ${token}` } }
          );
      
      navigate(`/payment-confirmation/${transaksiId}`);
    } catch (error) {
      console.error('Error processing payment:', error);
      alert('Terjadi kesalahan saat memproses pembayaran');
    }
  };

  if (loading) return <div className="text-center p-8">Memuat...</div>;
  if (!transaction) return <div className="text-center p-8">Transaksi tidak ditemukan</div>;

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-6">Pembayaran</h1>
        
        {/* Detail Transaksi */}
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h2 className="font-semibold mb-3">Detail Pesanan</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Kode Transaksi:</span>
              <span className="font-medium">{transaction.kodeTransaksi}</span>
            </div>
            <div className="flex justify-between">
              <span>Total Pembayaran:</span>
              <span className="font-bold text-xl text-blue-600">
                {formatRupiah(transaction.totalHarga)}
              </span>
            </div>
          </div>
        </div>

        {/* Metode Pembayaran */}
        <div className="mb-6">
          <h2 className="font-semibold mb-3">Pilih Metode Pembayaran</h2>
          <div className="space-y-2">
            {paymentMethods.map((method) => (
              <div
                key={method.id}
                onClick={() => setSelectedMethod(method.id)}
                className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedMethod === method.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-200'
                }`}
              >
                <div className="w-12 h-12 flex-shrink-0 text-gray-600">
                  {React.createElement(method.icon, {
                    className: "w-8 h-8"
                  })}
                </div>
                <span className="ml-4 font-medium">{method.name}</span>
                <div className="ml-auto">
                  <div className={`w-6 h-6 rounded-full border-2 ${
                    selectedMethod === method.id
                      ? 'border-blue-500 bg-blue-500'
                      : 'border-gray-300'
                  }`}>
                    {selectedMethod === method.id && (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-white text-sm">✓</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tombol Bayar */}
        <button
          onClick={handlePayment}
          disabled={!selectedMethod}
          className={`w-full py-4 rounded-lg text-white font-bold text-lg ${
            selectedMethod
              ? 'bg-blue-500 hover:bg-blue-600'
              : 'bg-gray-300 cursor-not-allowed'
          }`}
        >
          Bayar Sekarang
        </button>
      </div>
    </div>
  );
};

export default PaymentPage; 