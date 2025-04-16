import React, { useState } from 'react';
import { 
    Button, 
    Input, 
    message,
    Card,
    Checkbox,
    InputNumber,
    Space
} from 'antd';
import { DeleteOutlined, ShoppingOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reduxStore';
import { removeFromCart, updateCartItemQuantity } from '../store/cartSlice';
import axios from 'axios';
import useStore from '../store';
const API_URL = import.meta.env.VITE_API_URL;

interface CartProps {
    userId: number;
}

const Cart: React.FC<CartProps> = ({ userId }) => {
    const cartItems = useSelector((state: RootState) => state.cart.items);
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [catatan, setCatatan] = useState('');
    const [selectedItems, setSelectedItems] = useState<number[]>([]);
    const token = useStore((s) => s.token);

    const handleSelectItem = (barangId: number) => {
        setSelectedItems(prev => 
            prev.includes(barangId) 
                ? prev.filter(id => id !== barangId)
                : [...prev, barangId]
        );
    };

    const handleSelectAll = (checked: boolean) => {
        setSelectedItems(checked ? cartItems.map(item => item.barang_id) : []);
    };

    const calculateTotal = () => {
        return cartItems
            .filter(item => selectedItems.includes(item.barang_id))
            .reduce((sum, item) => sum + item.subtotal, 0);
    };

    const handleQuantityChange = (barangId: number, value: number) => {
        if (value < 1) return;
        dispatch(updateCartItemQuantity({ barangId, jumlah: value }));
    };

    const handleCheckout = async () => {
        if (selectedItems.length === 0) {
            message.warning('Pilih minimal satu barang untuk checkout');
            return;
        }

        try {
            setLoading(true);
            const selectedCartItems = cartItems.filter(item => 
                selectedItems.includes(item.barang_id)
            );

            const transaksi = {
                user_id: userId,
                kode_transaksi: `TRX-${Date.now()}`,
                total_harga: calculateTotal(),
                catatan,
                detail_transaksi: selectedCartItems
            };
            
            const response = await axios.post(
                `${API_URL}/transaksi`,
                transaksi,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.data) {
                message.success('Checkout berhasil!');
                selectedItems.forEach(id => dispatch(removeFromCart(id)));
                setSelectedItems([]);
                setCatatan('');
            }
        } catch (error) {
            console.error('Gagal checkout:', error);
            message.error('Gagal checkout. Silakan coba lagi nanti.');
        } finally {
            setLoading(false);
        }
    };

    if (cartItems.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12">
                <ShoppingOutlined style={{ fontSize: 64, color: '#ccc' }} />
                <p className="mt-4 text-gray-500">Keranjang belanja kosong</p>
                <Button type="primary" href="/barang" className="mt-4">
                    Mulai Belanja
                </Button>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto">
            <Card className="mb-4">
                <div className="flex items-center mb-4">
                    <Checkbox
                        checked={selectedItems.length === cartItems.length}
                        onChange={(e) => handleSelectAll(e.target.checked)}
                    >
                        Pilih Semua
                    </Checkbox>
                </div>

                <div className="space-y-4">
                    {cartItems.map((item) => (
                        <Card key={item.barang_id} className="shadow-sm">
                            <div className="flex items-center">
                                <Checkbox
                                    checked={selectedItems.includes(item.barang_id)}
                                    onChange={() => handleSelectItem(item.barang_id)}
                                />
                                <img
                                    src={`${API_URL}/uploads/${item.gambar}`}
                                    alt={item.nama_barang}
                                    className="w-20 h-20 object-cover ml-4"
                                />
                                <div className="flex-grow ml-4">
                                    <h3 className="text-lg font-medium">{item.nama_barang}</h3>
                                    <p className="text-red-500 font-medium">
                                        Rp {item.harga_satuan.toLocaleString('id-ID')}
                                    </p>
                                </div>
                                <Space>
                                    <InputNumber
                                        min={1}
                                        value={item.jumlah}
                                        onChange={(value) => handleQuantityChange(item.barang_id, value || 1)}
                                        className="w-20"
                                    />
                                    <Button
                                        type="text"
                                        danger
                                        icon={<DeleteOutlined />}
                                        onClick={() => dispatch(removeFromCart(item.barang_id))}
                                    />
                                </Space>
                            </div>
                        </Card>
                    ))}
                </div>
            </Card>

            <Card className="fixed bottom-0 left-0 right-0 z-10 shadow-lg">
                <div className="flex items-center justify-between">
                    <div>
                        <Input.TextArea
                            value={catatan}
                            onChange={(e) => setCatatan(e.target.value)}
                            placeholder="Catatan untuk pesanan (opsional)"
                            className="w-64"
                            autoSize={{ minRows: 1, maxRows: 3 }}
                        />
                    </div>
                    <div className="flex items-center">
                        <div className="mr-8">
                            <span className="text-gray-600">Total:</span>
                            <span className="text-xl font-bold text-red-500 ml-2">
                                Rp {calculateTotal().toLocaleString('id-ID')}
                            </span>
                        </div>
                        <Button
                            type="primary"
                            size="large"
                            loading={loading}
                            onClick={handleCheckout}
                            disabled={selectedItems.length === 0}
                            className="bg-red-500 hover:bg-red-600"
                        >
                            Checkout ({selectedItems.length} item)
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default Cart; 