import { useEffect, useState } from 'react';
import axios from 'axios';
import useStore from './store';
import DataTable from 'react-data-table-component';
import { useDispatch } from 'react-redux';
import { addToCart } from './store/cartSlice';
import { message } from 'antd';
import { useNavigate } from 'react-router-dom';

interface BarangForm {
  nama: string;
  harga: number;
  stock: number;
  gambar: File | null;
}

interface Barang extends Omit<BarangForm, 'gambar'> {
  id: number;
  gambar: string;
}

export default function BarangList() {
  const navigate = useNavigate();
  const { token, barang, setBarang } = useStore();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState<BarangForm>({ 
    nama: '', 
    harga: 0, 
    stock: 0,
    gambar: null
  });
  const logout = useStore((s) => s.logout);
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    if (!token) {
      return;
    }
    
    axios.get('http://localhost:4000/barang', {
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    }).then(res => {
      if (res.data) {
        setBarang(res.data.data);
      }
    }).catch(error => {
      if (error.response?.status === 401) {
        logout();
        navigate('/login');
      }
    });
  }, [token, setBarang, logout, navigate]);

  if (!token) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('nama', formData.nama);
      formDataToSend.append('harga', formData.harga.toString());
      formDataToSend.append('stock', formData.stock.toString());
      if (formData.gambar) {
        formDataToSend.append('gambar', formData.gambar);
      }

      if (editingId) {
        await axios.put(`http://localhost:4000/barang/${editingId}`, formDataToSend, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
      } else {
        await axios.post('http://localhost:4000/barang', formDataToSend, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
      }
      
      const res = await axios.get('http://localhost:4000/barang', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBarang(res.data.data);
      setFormData({ nama: '', harga: 0, stock: 0, gambar: null });
      setEditingId(null);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Yakin ingin menghapus barang ini?')) return;
    
    try {
      await axios.delete(`http://localhost:4000/barang/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const res = await axios.get('http://localhost:4000/barang', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBarang(res.data.data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleEdit = (b: Barang) => {
    setEditingId(b.id);
    setFormData({ 
      nama: b.nama, 
      harga: b.harga, 
      stock: b.stock, 
      gambar: null 
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, gambar: e.target.files[0] });
    }
  };

  const handleAddToCart = (barang: Barang) => {
    dispatch(addToCart({
      barang_id: barang.id,
      nama_barang: barang.nama,
      gambar: barang.gambar,
      jumlah: 1,
      harga_satuan: barang.harga,
      subtotal: barang.harga
    }));
    message.success('Barang berhasil ditambahkan ke keranjang');
  };

  const columns = [
    {
      name: 'Gambar',
      cell: (row: Barang) => (
        <img 
          src={`http://localhost:4000/uploads/${row.gambar}`} 
          alt={row.nama}
          className="w-16 h-16 object-cover rounded"
        />
      ),
    },
    {
      name: 'Nama Barang',
      selector: (row: Barang) => row.nama,
      sortable: true,
    },
    {
      name: 'Harga',
      selector: (row: Barang) => row.harga,
      sortable: true,
      format: (row: Barang) => `Rp${row.harga.toLocaleString('id-ID')}`,
    },
    {
      name: 'Stock',
      selector: (row: Barang) => row.stock,
      sortable: true,
    },
    {
      name: 'Aksi',
      cell: (row: Barang) => (
        <div className="flex space-x-2">
          <button
            onClick={() => handleEdit(row)}
            className="bg-yellow-500 text-white px-2 py-1 rounded text-sm"
          >
            Edit
          </button>
          <button
            onClick={() => handleDelete(row.id)}
            className="bg-red-500 text-white px-2 py-1 rounded text-sm"
          >
            Hapus
          </button>
          <button
            onClick={() => handleAddToCart(row)}
            className="bg-green-500 text-white px-2 py-1 rounded text-sm"
          >
            Tambah ke Keranjang
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-4">Daftar Barang</h2>
      
      <form onSubmit={handleSubmit} className="mb-4 space-y-2">
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Nama Barang"
            value={formData.nama}
            onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
            className="border p-2 rounded"
          />
          <input
            type="number"
            placeholder="Harga"
            value={formData.harga}
            onChange={(e) => setFormData({ ...formData, harga: Number(e.target.value) })}
            className="border p-2 rounded"
          />
          <input
            type="number"
            placeholder="Stock"
            value={formData.stock}
            onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
            className="border p-2 rounded"
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="border p-2 rounded"
          />
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded col-span-2">
            {editingId ? 'Update' : 'Tambah'} Barang
          </button>
        </div>
      </form>

      <DataTable
        columns={columns}
        data={Array.isArray(barang) ? barang : []}
        pagination
        paginationPerPage={10}
        paginationRowsPerPageOptions={[10, 20, 30, 50]}
        highlightOnHover
        responsive
        striped
        noDataComponent="Tidak ada data barang"
      />
    </div>
  );
}
