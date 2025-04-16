import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useStore } from './store/store';
const apiUrl = import.meta.env.VITE_API_URL;


interface PaymentDetails {
  virtualAccount: string;
  amount: number;
  paymentMethod: string;
}

const PaymentConfirmation = () => {
  const { transaksiId } = useParams();
  const navigate = useNavigate();
  const token = useStore((s) => s.token);
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(null);
  const [countdown, setCountdown] = useState(24 * 60 * 60);

  useEffect(() => {
    const fetchPaymentDetails = async () => {
      try {
        const response = await axios.get(
          `${apiUrl}/transaksi/${transaksiId}/payment-details`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setPaymentDetails(response.data.data);
      } catch (error) {
        console.error('Error fetching payment details:', error);
      }
    };

    fetchPaymentDetails();

    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [transaksiId, token]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!paymentDetails) return <div className="text-center p-8">Memuat...</div>;

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold mb-2">Menunggu Pembayaran</h1>
          <p className="text-gray-600">
            Selesaikan pembayaran sebelum batas waktu berakhir
          </p>
          <div className="text-3xl font-bold text-blue-600 mt-4">
            {formatTime(countdown)}
          </div>
        </div>

        <div className="space-y-6">
          <div className="border-t border-b py-4">
            <h2 className="font-semibold mb-3">Detail Pembayaran</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Nomor Virtual Account</span>
                <div className="flex items-center">
                  <span className="font-mono font-bold">{paymentDetails.virtualAccount}</span>
                  <button
                    onClick={() => navigator.clipboard.writeText(paymentDetails.virtualAccount)}
                    className="ml-2 text-blue-500 hover:text-blue-700"
                  >
                    Salin
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tambahkan tombol kembali */}
        <button
          onClick={() => navigate('/purchase-history')}
          className="w-full mt-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200"
        >
          Kembali ke Riwayat Belanja
        </button>
      </div>
    </div>
  );
};

export default PaymentConfirmation; 