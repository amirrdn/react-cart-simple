export interface CartItem {
    barang_id: number;
    nama_barang: string;
    gambar: string;
    jumlah: number;
    harga_satuan: number;
    subtotal: number;
    catatan?: string;
    barang?: {
        id: number;
        nama: string;
        harga: number;
        stok: number;
        gambar?: string;
    };
}

export enum StatusPembayaran {
    PENDING = "PENDING",
    SUCCESS = "SUCCESS",
    FAILED = "FAILED"
}

export enum MetodePembayaran {
    TUNAI = "TUNAI",
    TRANSFER = "TRANSFER",
    KARTU_KREDIT = "KARTU_KREDIT",
    KARTU_DEBIT = "KARTU_DEBIT",
    E_WALLET = "E_WALLET"
}

export interface Pembayaran {
    id: number;
    metode_pembayaran: string;
    jumlah_pembayaran: number;
    created_at: Date;
    catatan: string;
    status_pembayaran: string;
}

export interface Transaksi {
    id?: number;
    user_id: number;
    kode_transaksi: string;
    created_at: Date;
    total_harga: number;
    status: 'pending' | 'dibayar' | 'diproses' | 'dikirim' | 'selesai' | 'dibatalkan';
    catatan?: string;
    details: CartItem[];
    pembayaran?: Pembayaran;
} 