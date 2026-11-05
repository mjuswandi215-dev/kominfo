export interface User {
  id: number;
  username: string; // Nama pengguna untuk login
  password?: string; // Kata sandi login peserta / admin
  role?: 'peserta' | 'admin'; // Peran akun (default 'peserta', atau 'admin' Diskominfo)
  nama_lengkap?: string; // Nama lengkap peserta PKL / anak magang
  nomor_telepon: string; // Nomor unik untuk login & WhatsApp (UNIQUE)
  instansi_pendidikan: string; // Asal Sekolah / Kampus (e.g. "SMK N 1 Selong", "Universitas Hamzanwadi")
  jurusan?: string; // e.g. "Teknik Informatika", "TKJ", "Sistem Informasi"
  divisi_pkl: string; // Bidang / Divisi di Diskominfo (e.g. "Bidang Aplikasi Informatika & e-Gov")
  kabupaten: string; // e.g. "Kabupaten Lombok Timur"
  
  // DPL (Dosen / Guru Pembimbing Lapangan dari Sekolah / Kampus)
  nama_dpl: string;
  nip_dpl: string;
  kontak_dpl?: string;
  dpl_kampus?: string; // Alias untuk backwards compatibility
  
  // PL (Pembimbing Lapangan dari Diskominfo Lombok Timur)
  nama_pl: string;
  nip_pl: string;
  jabatan_pl?: string;
  nama_pembimbing: string; // Alias untuk backwards compatibility
  nip_pembimbing: string; // Alias untuk backwards compatibility
  
  periode_mulai: string;
  periode_selesai: string;
  target_hari: number;
  avatar_url?: string;
  status_akun?: 'Aktif' | 'Menunggu Verifikasi' | 'Alumni';
  created_at: string;
}

export type KategoriKegiatan =
  | 'Desain'
  | 'Administrasi'
  | 'Jaringan'
  | 'Sosialisasi'
  | 'Pengembangan Software'
  | 'Infrastruktur & Server'
  | 'Dokumentasi & Humas';

export type StatusVerifikasi = 'Selesai' | 'Dalam Proses' | 'Perlu Revisi';

export interface LogbookItem {
  id: number;
  user_id: number; // Foreign Key -> users.id untuk isolasi data
  tanggal: string; // YYYY-MM-DD
  nama_kegiatan: string;
  deskripsi_kegiatan: string;
  durasi_jam: number;
  kategori: KategoriKegiatan;
  status_verifikasi: StatusVerifikasi;
  catatan_pembimbing?: string;
  lokasi: string;
  foto_dokumentasi?: string[];
  created_at: string;
  updated_at?: string;
}

export type StatusAbsensi = 'Hadir' | 'Izin' | 'Sakit' | 'Dinas Luar';

export interface AttendanceRecord {
  id: number;
  user_id: number;
  tanggal: string; // YYYY-MM-DD
  jam_masuk: string; // HH:mm:ss
  jam_pulang?: string; // HH:mm:ss
  status: StatusAbsensi;
  lokasi: string;
  keterangan?: string;
  metode: 'Web Presensi' | 'GPS Geofencing' | 'Manual';
}

export interface DplSignatureRecord {
  user_id: number;
  nama_dpl: string;
  nip_dpl: string;
  instansi: string;
  signature_data_url: string; // base64 canvas PNG
  stempel_url?: string;
  tanggal_ttd: string;
  status_pengesahan: 'Telah Disahkan & Ditandatangani' | 'Menunggu Tanda Tangan DPL';
  catatan_dpl: string;
  nilai_angka?: number;
  predikat?: 'A (Sangat Memuaskan)' | 'B (Baik)' | 'C (Cukup)';
}

export interface DokumentasiFoto {
  id: number;
  user_id: number;
  judul: string;
  tanggal: string;
  kategori: string;
  foto_url: string;
  deskripsi: string;
}

export interface SqlQueryLog {
  id: string;
  timestamp: string;
  operation: 'SELECT' | 'INSERT' | 'UPDATE' | 'DELETE' | 'SCHEMA';
  query: string;
  parameters: (string | number | boolean | null)[];
  isolationEnforced: boolean;
  affectedRows?: number;
  executionTimeMs: number;
  status: 'SUCCESS' | 'REJECTED_UNAUTHORIZED' | 'VALIDATION_ERROR';
  details?: string;
}

export interface SecurityTestResult {
  attemptedAction: 'EDIT' | 'DELETE' | 'VIEW_DETAIL';
  targetLogbookId: number;
  targetOwnerId: number;
  currentUserId: number;
  currentUserName: string;
  targetOwnerName: string;
  queryExecuted: string;
  isBlocked: boolean;
  message: string;
  timestamp: string;
}
