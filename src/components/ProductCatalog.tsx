import React, { useEffect } from 'react';
import { Box, Card, CardContent, CardMedia, Typography, Stack, Button } from '@mui/material';
import { useDispatch } from 'react-redux';
import { addToCart } from '../store/cartSlice';
import { useStore } from '../store/store';
import axios from 'axios';
import { message } from 'antd';
import { useNavigate } from 'react-router-dom';

const apiuri = import.meta.env.VITE_API_URL;

interface Product {
  id: number;
  nama: string;
  harga: number;
  stock: number;
  gambar: string;
}

interface AxiosError {
  response?: {
    status: number;
    data?: Record<string, unknown>;
  };
  message: string;
}

const ProductCatalog: React.FC = () => {
  const { token, barang, setBarang, setToken, setUser } = useStore();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) return;
    
    axios.get(`${apiuri}/barang`, {
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    }).then(res => {
      if (res.data) {
        setBarang(res.data);
      }
    }).catch(error => {
      if (error.response?.status === 401) {
        setToken(null);
        setUser(null);
        navigate('/login');
        message.error('Sesi Anda telah berakhir. Silakan login kembali.');
      } else {
        console.error('Error fetching barang:', error.response?.data || error.message);
      }
    });
  }, [token, setBarang, setToken, setUser, navigate]);

  const handleAddToCart = (product: Product) => {
    try {
      dispatch(addToCart({
        barang_id: product.id,
        nama_barang: product.nama,
        gambar: product.gambar,
        jumlah: 1,
        harga_satuan: product.harga,
        subtotal: product.harga
      }));
      message.success('Barang berhasil ditambahkan ke keranjang');
    } catch (error) {
      const axiosError = error as AxiosError;
      if (axiosError.response?.status === 401) {
        setToken(null);
        setUser(null);
        navigate('/login');
        message.error('Sesi Anda telah berakhir. Silakan login kembali.');
      } else {
        message.error('Gagal menambahkan ke keranjang');
      }
    }
  };

  return (
    <Box sx={{ flexGrow: 1, padding: 2 }}>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {barang.map((product) => (
          <div key={product.id}>
            <Card 
              sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                '&:hover': {
                  boxShadow: 6,
                  transform: 'translateY(-4px)',
                  transition: 'all 0.3s ease-in-out'
                }
              }}
            >
              <CardMedia
                component="img"
                height="200"
                image={`${apiuri}/uploads/${product.gambar}`}
                alt={product.nama}
                sx={{ objectFit: 'cover' }}
              />
              <CardContent sx={{ flexGrow: 1, p: 2 }}>
                <Typography 
                  variant="body2" 
                  sx={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    mb: 1,
                    height: '40px'
                  }}
                >
                  {product.nama}
                </Typography>
                <Typography 
                  variant="h6" 
                  color="error" 
                  sx={{ 
                    fontWeight: 'bold',
                    fontSize: '1.1rem',
                    mb: 1 
                  }}
                >
                  Rp {product.harga.toLocaleString('id-ID')}
                </Typography>
                <Stack 
                  direction="row" 
                  spacing={1} 
                  alignItems="center"
                  sx={{ mb: 1 }}
                >
                  <Typography variant="caption" color="text.secondary">
                    Stok: {product.stock}
                  </Typography>
                </Stack>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => handleAddToCart(product)}
                  disabled={product.stock === 0}
                  sx={{
                    bgcolor: '#ee4d2d',
                    '&:hover': {
                      bgcolor: '#d73211'
                    }
                  }}
                >
                  {product.stock === 0 ? 'Stok Habis' : 'Tambah ke Keranjang'}
                </Button>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </Box>
  );
};

export default ProductCatalog; 