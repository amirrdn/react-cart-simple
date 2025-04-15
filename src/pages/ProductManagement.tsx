import React, { useState, useEffect, useCallback } from 'react';
import { useStore } from '../store/store';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  message,
  Popconfirm,
  Space,
  Upload
} from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';
import { UploadFile } from 'antd/es/upload/interface';

interface Product {
  id: number;
  nama: string;
  harga: number;
  stock: number;
  gambar: string;
}

interface ProductFormValues {
  nama: string;
  harga: number;
  stock: number;
  gambar?: UploadFile[];
}

const ProductManagement: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingId, setEditingId] = useState<number | null>(null);
  const { user, token } = useStore();

  const fetchProducts = useCallback(async () => {
    try {
      const response = await axios.get('https://node-typeorm-simple-cart-production.up.railway.app/barang', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
      message.error('Gagal mengambil data produk');
    }
  }, [token]);

  useEffect(() => {
    if (token && user?.role_id === 1) {
      fetchProducts();
    }
  }, [token, user, fetchProducts]);

  if (!token) {
    return <div>Silakan login terlebih dahulu</div>;
  }

  if (user?.role_id !== 1) {
    return <div>Anda tidak memiliki akses ke halaman ini</div>;
  }

  const columns = [
    {
      title: 'Gambar',
      dataIndex: 'gambar',
      key: 'gambar',
      render: (image_url: string) => (
        image_url ? (
          <img 
            src={`https://node-typeorm-simple-cart-production.up.railway.app/uploads/${image_url}`} 
            alt="Produk" 
            style={{ width: 100, height: 100, objectFit: 'cover' }}
          />
        ) : 'Tidak ada gambar'
      ),
    },
    {
      title: 'Nama Produk',
      dataIndex: 'nama',
      key: 'nama',
    },
    {
      title: 'Harga',
      dataIndex: 'harga',
      key: 'harga',
      render: (harga: number) => harga ? `Rp ${harga.toLocaleString()}` : 'Rp 0',
    },
    {
      title: 'Stok',
      dataIndex: 'stock',
      key: 'stock',
    },
    {
      title: 'Aksi',
      key: 'action',
      render: (_: unknown, record: Product) => (
        <Space>
          <Button type="primary" onClick={() => handleEdit(record)}>
            Edit
          </Button>
          <Popconfirm
            title="Apakah Anda yakin ingin menghapus produk ini?"
            onConfirm={() => handleDelete(record.id)}
            okText="Ya"
            cancelText="Tidak"
          >
            <Button type="primary" danger>
              Hapus
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const handleEdit = (record: Product) => {
    setEditingId(record.id);
    const formValues = {
      nama: record.nama,
      harga: record.harga,
      stock: record.stock,
      gambar: record.gambar && record.gambar !== "" ? [{
        uid: '-1',
        name: record.gambar,
        status: 'done',
        url: `https://node-typeorm-simple-cart-production.up.railway.app/uploads/${record.gambar}`,
        thumbUrl: `https://node-typeorm-simple-cart-production.up.railway.app/uploads/${record.gambar}`,
        type: 'image/jpeg',
      }] : undefined
    };
    form.setFieldsValue(formValues);
    setIsModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`https://node-typeorm-simple-cart-production.up.railway.app/barang/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      message.success('Produk berhasil dihapus');
      fetchProducts();
    } catch {
      message.error('Gagal menghapus produk');
    }
  };

  const handleSubmit = async (values: ProductFormValues) => {
    try {
      const formData = new FormData();
      formData.append('nama', values.nama);
      formData.append('harga', values.harga.toString());
      formData.append('stock', values.stock.toString());
      if (values.gambar && values.gambar[0]?.originFileObj) {
        formData.append('file', values.gambar[0].originFileObj);
      }

      if (editingId) {
        await axios.put(`https://node-typeorm-simple-cart-production.up.railway.app/barang/${editingId}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          }
        });
        message.success('Produk berhasil diperbarui');
      } else {
        await axios.post('https://node-typeorm-simple-cart-production.up.railway.app/barang', formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          }
        });
        message.success('Produk berhasil ditambahkan');
      }
      setIsModalVisible(false);
      form.resetFields();
      setEditingId(null);
      fetchProducts();
    } catch {
      message.error('Gagal menyimpan produk');
    }
  };

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '16px' }}>
        <Button
          type="primary"
          onClick={() => {
            setEditingId(null);
            form.resetFields();
            setIsModalVisible(true);
          }}
        >
          Tambah Produk Baru
        </Button>
      </div>

      <Table columns={columns} dataSource={products} rowKey="id" />

      <Modal
        title={editingId ? 'Edit Produk' : 'Tambah Produk Baru'}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form
          form={form}
          onFinish={handleSubmit}
          layout="vertical"
        >
          <Form.Item
            name="nama"
            label="Nama Produk"
            rules={[{ required: true, message: 'Mohon masukkan nama produk' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="harga"
            label="Harga"
            rules={[{ required: true, message: 'Mohon masukkan harga' }]}
          >
            <Input type="number" prefix="Rp" />
          </Form.Item>

          <Form.Item
            name="stock"
            label="Stok"
            rules={[{ required: true, message: 'Mohon masukkan jumlah stok' }]}
          >
            <Input type="number" />
          </Form.Item>

          <Form.Item
            name="gambar"
            label="Gambar Produk"
            valuePropName="fileList"
            getValueFromEvent={(e) => {
              if (Array.isArray(e)) {
                return e;
              }
              return e?.fileList || [];
            }}
          >
            <Upload
              beforeUpload={() => false}
              listType="picture-card"
              maxCount={1}
              showUploadList={{ showPreviewIcon: true, showRemoveIcon: true }}
            >
              <Button icon={<UploadOutlined />}>Upload</Button>
            </Upload>
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingId ? 'Perbarui' : 'Save'}
              </Button>
              <Button onClick={() => setIsModalVisible(false)}>
                Batal
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ProductManagement; 