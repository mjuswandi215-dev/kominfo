import {
  User,
  LogbookItem,
  SqlQueryLog,
  SecurityTestResult,
  KategoriKegiatan,
  StatusVerifikasi,
  AttendanceRecord,
  DplSignatureRecord,
  DokumentasiFoto
} from '../types/logbook';

const USERS_STORAGE_KEY = 'kominfo_pkl_users_v3';
const LOGBOOKS_STORAGE_KEY = 'kominfo_pkl_logbooks_v3';
const SQL_LOGS_STORAGE_KEY = 'kominfo_pkl_sql_logs_v3';
const ATTENDANCE_STORAGE_KEY = 'kominfo_pkl_attendance_v3';
const SIGNATURES_STORAGE_KEY = 'kominfo_pkl_signatures_v3';
const DOKUMENTASI_STORAGE_KEY = 'kominfo_pkl_dokumentasi_v3';

// Initial Seed matching the exact reference from user:
// "LOGBOOK PKL DIGITAL - Dinas Kominfo Lombok Timur"
// "Rizky Pratama - SMK N 1 Selong — TKJ - Pembimbing: Ibu Siti, S.Kom"
const INITIAL_USERS: User[] = [
  {
    id: 1,
    username: 'Rizky Pratama',
    password: 'magang123',
    role: 'peserta',
    nama_lengkap: 'Muhammad Rizky Pratama',
    nomor_telepon: '081234567890',
    instansi_pendidikan: 'SMK N 1 Selong',
    jurusan: 'Teknik Komputer dan Jaringan (TKJ)',
    divisi_pkl: 'Bidang Aplikasi Informatika & e-Government',
    kabupaten: 'Kabupaten Lombok Timur',
    
    // DPL dari Kampus/Sekolah
    nama_dpl: 'Drs. Lalu Muhammad Zaini, M.Pd',
    nip_dpl: '19750819 199903 1 004',
    kontak_dpl: '081987654321',
    dpl_kampus: 'Drs. Lalu Muhammad Zaini, M.Pd',
    
    // PL dari Diskominfo Lombok Timur
    nama_pl: 'Ibu Siti, S.Kom',
    nip_pl: '19830412 200801 2 006',
    jabatan_pl: 'Pranata Komputer Ahli Muda / Sub Koordinator',
    nama_pembimbing: 'Ibu Siti, S.Kom',
    nip_pembimbing: '19830412 200801 2 006',
    
    periode_mulai: '2024-10-26',
    periode_selesai: '2024-12-21',
    target_hari: 56,
    avatar_url: '/src/assets/images/avatar_pkl_male_1793886103683.jpg',
    status_akun: 'Aktif',
    created_at: '2024-10-26 07:30:00',
  },
  {
    id: 2,
    username: 'Siti Rahmawati',
    password: 'magang123',
    role: 'peserta',
    nama_lengkap: 'Siti Rahmawati Putri',
    nomor_telepon: '085712345678',
    instansi_pendidikan: 'Universitas Hamzanwadi',
    jurusan: 'Pendidikan Informatika & Komputer',
    divisi_pkl: 'Bidang Informasi & Komunikasi Publik (IKP)',
    kabupaten: 'Kabupaten Lombok Timur',
    
    nama_dpl: 'Dr. Ir. Wahyudi, M.T.',
    nip_dpl: '19790214 200501 1 003',
    kontak_dpl: '085811223344',
    dpl_kampus: 'Dr. Ir. Wahyudi, M.T.',
    
    nama_pl: 'Dra. Endang Lestari, M.Eng',
    nip_pl: '19820315 200604 2 001',
    jabatan_pl: 'Pranata Humas Ahli Muda',
    nama_pembimbing: 'Dra. Endang Lestari, M.Eng',
    nip_pembimbing: '19820315 200604 2 001',
    
    periode_mulai: '2024-09-15',
    periode_selesai: '2024-11-15',
    target_hari: 45,
    avatar_url: '/src/assets/images/avatar_pkl_female_1793886103792.jpg',
    status_akun: 'Aktif',
    created_at: '2024-09-15 08:00:00',
  },
  {
    id: 3,
    username: 'Dimas Wicaksono',
    password: 'magang123',
    role: 'peserta',
    nama_lengkap: 'Dimas Wicaksono Nugroho',
    nomor_telepon: '089698765432',
    instansi_pendidikan: 'Universitas Mataram',
    jurusan: 'Teknik Informatika',
    divisi_pkl: 'Bidang Persandian & Keamanan Siber',
    kabupaten: 'Kabupaten Lombok Timur',
    
    nama_dpl: 'Prof. Dr. Hendra Suwandi',
    nip_dpl: '19680321 199403 1 002',
    kontak_dpl: '089944332211',
    dpl_kampus: 'Prof. Dr. Hendra Suwandi',
    
    nama_pl: 'Bambang Sudibyo, S.T., M.T.',
    nip_pl: '19851120 200801 1 005',
    jabatan_pl: 'Pengelola Jaringan Komunikasi & Sandi',
    nama_pembimbing: 'Bambang Sudibyo, S.T., M.T.',
    nip_pembimbing: '19851120 200801 1 005',
    
    periode_mulai: '2024-08-15',
    periode_selesai: '2024-10-31',
    target_hari: 45,
    avatar_url: '/src/assets/images/avatar_pkl_male_1793886103683.jpg',
    status_akun: 'Aktif',
    created_at: '2024-08-15 08:30:00',
  },
  {
    id: 99,
    username: 'admin_diskominfo',
    password: 'admin',
    role: 'admin',
    nama_lengkap: 'Admin Pengelola Magang Diskominfo',
    nomor_telepon: '081122334455',
    instansi_pendidikan: 'Dinas Komunikasi, Informatika dan Persandian Kab. Lombok Timur',
    jurusan: 'Tata Kelola Informatika & SDM',
    divisi_pkl: 'Sekretariat & Tim Pembina Magang',
    kabupaten: 'Kabupaten Lombok Timur',
    
    nama_dpl: 'Tim Pembina Kampus Mitra',
    nip_dpl: '-',
    dpl_kampus: 'Tim Pembina Kampus Mitra',
    
    nama_pl: 'Kepala Bidang Aplikasi Informatika',
    nip_pl: '19760812 200212 1 003',
    jabatan_pl: 'Koordinator Pembina Magang Diskominfo',
    nama_pembimbing: 'Kepala Bidang Aplikasi Informatika',
    nip_pembimbing: '19760812 200212 1 003',
    
    periode_mulai: '2024-01-01',
    periode_selesai: '2024-12-31',
    target_hari: 365,
    avatar_url: '/assets/aistudio/logo-kominfo_869d4e21.png',
    status_akun: 'Aktif',
    created_at: '2024-01-01 08:00:00',
  },
];

const INITIAL_LOGBOOKS: LogbookItem[] = [
  // User 1 (Rizky Pratama) - Exact activities from user reference image
  {
    id: 1,
    user_id: 1,
    tanggal: '2024-10-12',
    nama_kegiatan: 'Pembuatan Konten Media Sosial',
    deskripsi_kegiatan: 'Mendesain infografis edukasi literasi digital dan keamanan siber untuk publikasi Instagram dan portal web resmi Dinas Kominfo Lombok Timur menggunakan Canva & Figma.',
    durasi_jam: 8,
    kategori: 'Desain',
    status_verifikasi: 'Selesai',
    catatan_pembimbing: 'Desain menarik dan informatif, warna sesuai branding Pemda Lombok Timur.',
    lokasi: 'Ruang Humas Kominfo',
    created_at: '2024-10-12 16:30:00',
  },
  {
    id: 2,
    user_id: 1,
    tanggal: '2024-10-11',
    nama_kegiatan: 'Konfigurasi Jaringan Kantor',
    deskripsi_kegiatan: 'Melakukan perapian kabel patch panel, setting VLAN pada switch Cisco core, dan pengujian throughput WiFi kantor dinas untuk mendukung kelancaran video conference pimpinan.',
    durasi_jam: 7.5,
    kategori: 'Jaringan',
    status_verifikasi: 'Selesai',
    catatan_pembimbing: 'Koneksi switch telah stabil di 1 Gbps.',
    lokasi: 'Ruang Server',
    created_at: '2024-10-11 16:00:00',
  },
  {
    id: 3,
    user_id: 1,
    tanggal: '2024-10-10',
    nama_kegiatan: 'Dokumentasi Kegiatan Sosialisasi',
    deskripsi_kegiatan: 'Mengambil foto dan video dokumentasi program Sosialisasi Desa Digital dan e-Government untuk perangkat desa di Kabupaten Lombok Timur.',
    durasi_jam: 6,
    kategori: 'Sosialisasi',
    status_verifikasi: 'Dalam Proses',
    catatan_pembimbing: 'Tolong lengkapi file arsip foto ke cloud drive.',
    lokasi: 'Aula Desa Sukamulia',
    created_at: '2024-10-10 15:45:00',
  },
  {
    id: 4,
    user_id: 1,
    tanggal: '2024-10-09',
    nama_kegiatan: 'Penyusunan Laporan Bulanan',
    deskripsi_kegiatan: 'Membantu staf administrasi menyusun rekapitulasi data surat masuk/keluar bidang Pengelolaan Informasi Komunikasi Publik (PIKP) bulan September 2024.',
    durasi_jam: 8,
    kategori: 'Administrasi',
    status_verifikasi: 'Selesai',
    catatan_pembimbing: 'Format penomoran surat sudah rapi.',
    lokasi: 'Ruang Administrasi',
    created_at: '2024-10-09 16:15:00',
  },
  {
    id: 5,
    user_id: 1,
    tanggal: '2024-10-08',
    nama_kegiatan: 'Desain Poster Program Literasi Digital',
    deskripsi_kegiatan: 'Membuat materi visual poster cetak ukuran A3 tentang pencegahan judi online dan hoax di kalangan pelajar sekolah menengah.',
    durasi_jam: 8,
    kategori: 'Desain',
    status_verifikasi: 'Selesai',
    catatan_pembimbing: 'Siap dicetak dan disebarkan ke sekolah-sekolah.',
    lokasi: 'Ruang Desain Grafis',
    created_at: '2024-10-08 17:00:00',
  },
  {
    id: 6,
    user_id: 1,
    tanggal: '2024-10-07',
    nama_kegiatan: 'Pemeriksaan Perangkat Komputer Bidang Statistik',
    deskripsi_kegiatan: 'Instalasi ulang sistem operasi Windows 11 dan software pengolah data BPS pada 4 PC kerja staf bidang persandian dan statistik.',
    durasi_jam: 7,
    kategori: 'Jaringan',
    status_verifikasi: 'Selesai',
    catatan_pembimbing: 'Driver dan antivirus telah diperbarui.',
    lokasi: 'Ruang IT & Helpdesk',
    created_at: '2024-10-07 16:30:00',
  },
  {
    id: 7,
    user_id: 1,
    tanggal: '2024-10-04',
    nama_kegiatan: 'Monitoring Backup Data Server Portal Lombok Timur',
    deskripsi_kegiatan: 'Mengecek ketersediaan snapshot storage harian web portal lomboktimurkab.go.id dan memastikan service Nginx berjalan normal.',
    durasi_jam: 8,
    kategori: 'Infrastruktur & Server',
    status_verifikasi: 'Selesai',
    catatan_pembimbing: 'Backup aman dan tersimpan di NAS lokal.',
    lokasi: 'Ruang Server Kominfo',
    created_at: '2024-10-04 17:00:00',
  },

  // User 2 (Siti Rahmawati - Pusdatin)
  {
    id: 8,
    user_id: 2,
    tanggal: '2024-10-12',
    nama_kegiatan: 'Monitoring Telemetri Cluster Database PDN',
    deskripsi_kegiatan: 'Memeriksa dashboard Prometheus dan Grafana untuk cluster basis data Pusat Data Nasional.',
    durasi_jam: 8,
    kategori: 'Infrastruktur & Server',
    status_verifikasi: 'Selesai',
    catatan_pembimbing: 'Laporan telemetri valid.',
    lokasi: 'NOC Pusdatin Kominfo Lt. 2',
    created_at: '2024-10-12 17:15:00',
  },
  {
    id: 9,
    user_id: 2,
    tanggal: '2024-10-10',
    nama_kegiatan: 'Failover High Availability MariaDB',
    deskripsi_kegiatan: 'Menguji skenario switchover node master ke replica otomatis saat terjadi lonjakan trafik pelaporan.',
    durasi_jam: 7,
    kategori: 'Pengembangan Software',
    status_verifikasi: 'Selesai',
    catatan_pembimbing: 'Failover time < 4s.',
    lokasi: 'Lab Jaringan Pusdatin',
    created_at: '2024-10-10 16:30:00',
  },
];

const INITIAL_ATTENDANCE: AttendanceRecord[] = [
  {
    id: 1,
    user_id: 1,
    tanggal: '2024-10-12',
    jam_masuk: '07:45:12',
    jam_pulang: '16:32:05',
    status: 'Hadir',
    lokasi: 'Kantor Dinas Kominfo Lombok Timur',
    metode: 'Web Presensi',
    keterangan: 'Tepat waktu, mengikuti apel pagi.',
  },
  {
    id: 2,
    user_id: 1,
    tanggal: '2024-10-11',
    jam_masuk: '07:48:30',
    jam_pulang: '16:35:10',
    status: 'Hadir',
    lokasi: 'Ruang Server Kominfo Lt. 1',
    metode: 'Web Presensi',
    keterangan: 'Presensi normal.',
  },
  {
    id: 3,
    user_id: 1,
    tanggal: '2024-10-10',
    jam_masuk: '08:00:22',
    jam_pulang: '16:30:00',
    status: 'Dinas Luar',
    lokasi: 'Aula Kantor Desa Sukamulia',
    metode: 'GPS Geofencing',
    keterangan: 'Pendampingan sosialisasi literasi digital.',
  },
  {
    id: 4,
    user_id: 1,
    tanggal: '2024-10-09',
    jam_masuk: '07:50:00',
    jam_pulang: '16:30:45',
    status: 'Hadir',
    lokasi: 'Ruang Administrasi Kominfo',
    metode: 'Web Presensi',
  },
  {
    id: 5,
    user_id: 1,
    tanggal: '2024-10-08',
    jam_masuk: '07:42:18',
    jam_pulang: '16:40:12',
    status: 'Hadir',
    lokasi: 'Ruang Desain Grafis Kominfo',
    metode: 'Web Presensi',
  },
  {
    id: 6,
    user_id: 1,
    tanggal: '2024-10-07',
    jam_masuk: '07:55:00',
    jam_pulang: '16:30:00',
    status: 'Hadir',
    lokasi: 'Ruang IT & Helpdesk',
    metode: 'Web Presensi',
  },
];

const INITIAL_DPL_SIGNATURES: Record<number, DplSignatureRecord> = {
  1: {
    user_id: 1,
    nama_dpl: 'Ibu Siti, S.Kom',
    nip_dpl: '19830412 200801 2 006',
    instansi: 'Dinas Kominfo Lombok Timur',
    signature_data_url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="220" height="90"><path d="M20 60 Q 50 10 90 50 T 160 30 T 200 70 M 60 70 L 170 65" stroke="%230f2d4a" stroke-width="3" fill="none" stroke-linecap="round"/></svg>',
    tanggal_ttd: '2024-10-12',
    status_pengesahan: 'Telah Disahkan & Ditandatangani',
    catatan_dpl: 'Peserta sangat disiplin, aktif, dan memiliki inisiatif tinggi dalam menyelesaikan tugas-tugas di Dinas Kominfo.',
    nilai_angka: 95,
    predikat: 'A (Sangat Memuaskan)',
  },
};

const INITIAL_DOKUMENTASI: DokumentasiFoto[] = [
  {
    id: 1,
    user_id: 1,
    judul: 'Konfigurasi Jaringan & Rack Server',
    tanggal: '2024-10-11',
    kategori: 'Jaringan',
    foto_url: '/public/assets/aistudio/WhatsApp_Image_2026-11-05_at_22.23.38_4d00a6be.jpeg',
    deskripsi: 'Praktek instalasi kabel UTP Cat6 dan setting switch manage di ruang server Kominfo.',
  },
  {
    id: 2,
    user_id: 1,
    judul: 'Bimbingan Harian Bersama Pembimbing Lapangan',
    tanggal: '2024-10-10',
    kategori: 'Sosialisasi',
    foto_url: '/src/assets/images/kominfo_hero_banner_1793886104325.jpg',
    deskripsi: 'Sesi review logbook mingguan dan pembagian tugas pengelolaan konten publik.',
  },
];

class SimulatedMysqlEngine {
  private users: User[] = [];
  private logbooks: LogbookItem[] = [];
  private attendance: AttendanceRecord[] = [];
  private signatures: Record<number, DplSignatureRecord> = {};
  private dokumentasi: DokumentasiFoto[] = [];
  private sqlLogs: SqlQueryLog[] = [];
  private listeners: (() => void)[] = [];

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    try {
      const storedUsers = localStorage.getItem(USERS_STORAGE_KEY);
      const storedLogbooks = localStorage.getItem(LOGBOOKS_STORAGE_KEY);
      const storedAttendance = localStorage.getItem(ATTENDANCE_STORAGE_KEY);
      const storedSignatures = localStorage.getItem(SIGNATURES_STORAGE_KEY);
      const storedDokumentasi = localStorage.getItem(DOKUMENTASI_STORAGE_KEY);
      const storedSqlLogs = localStorage.getItem(SQL_LOGS_STORAGE_KEY);

      this.users = storedUsers ? JSON.parse(storedUsers) : [...INITIAL_USERS];
      // Ensure all users have credentials, role, DPL, and PL fields
      this.users.forEach((u) => {
        if (!u.password) u.password = 'magang123';
        if (!u.role) u.role = u.id === 99 ? 'admin' : 'peserta';
        if (!u.nama_lengkap) u.nama_lengkap = u.username;
        if (!u.nama_dpl) u.nama_dpl = u.dpl_kampus || 'Drs. Lalu Muhammad Zaini, M.Pd';
        if (!u.nip_dpl) u.nip_dpl = '19750819 199903 1 004';
        if (!u.nama_pl) u.nama_pl = u.nama_pembimbing || 'Ibu Siti, S.Kom';
        if (!u.nip_pl) u.nip_pl = u.nip_pembimbing || '19830412 200801 2 006';
        if (!u.jabatan_pl) u.jabatan_pl = 'Pranata Komputer Ahli Muda';
        if (!u.nama_pembimbing) u.nama_pembimbing = u.nama_pl;
        if (!u.nip_pembimbing) u.nip_pembimbing = u.nip_pl;
        if (!u.status_akun) u.status_akun = 'Aktif';
      });
      // Ensure admin user (id: 99) exists in the database
      if (!this.users.some((u) => u.id === 99)) {
        const adminUser = INITIAL_USERS.find((u) => u.id === 99);
        if (adminUser) this.users.push(adminUser);
      }
      // Ensure user 1 has updated period from user request
      const u1 = this.users.find((u) => u.id === 1);
      if (u1 && u1.periode_mulai === '2024-09-01') {
        u1.periode_mulai = '2024-10-26';
        u1.periode_selesai = '2024-12-21';
        u1.target_hari = 56;
      }
      this.saveUsers();
      this.logbooks = storedLogbooks ? JSON.parse(storedLogbooks) : [...INITIAL_LOGBOOKS];
      this.attendance = storedAttendance ? JSON.parse(storedAttendance) : [...INITIAL_ATTENDANCE];
      this.signatures = storedSignatures ? JSON.parse(storedSignatures) : { ...INITIAL_DPL_SIGNATURES };
      this.dokumentasi = storedDokumentasi ? JSON.parse(storedDokumentasi) : [...INITIAL_DOKUMENTASI];

      if (storedSqlLogs) {
        this.sqlLogs = JSON.parse(storedSqlLogs);
      } else {
        this.sqlLogs = [];
        this.logSql({
          operation: 'SCHEMA',
          query: `CREATE TABLE users (\n  id INT AUTO_INCREMENT PRIMARY KEY,\n  username VARCHAR(100) NOT NULL,\n  nomor_telepon VARCHAR(20) NOT NULL UNIQUE,\n  instansi_pendidikan VARCHAR(100),\n  divisi_pkl VARCHAR(100),\n  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP\n);\n\nCREATE TABLE logbooks (\n  id INT AUTO_INCREMENT PRIMARY KEY,\n  user_id INT NOT NULL,\n  tanggal DATE NOT NULL,\n  nama_kegiatan VARCHAR(255) NOT NULL,\n  deskripsi_kegiatan TEXT NOT NULL,\n  lokasi VARCHAR(100),\n  status_verifikasi ENUM('Selesai', 'Dalam Proses', 'Perlu Revisi'),\n  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE\n);\n\nCREATE TABLE absensi (\n  id INT AUTO_INCREMENT PRIMARY KEY,\n  user_id INT NOT NULL,\n  tanggal DATE NOT NULL,\n  jam_masuk TIME NOT NULL,\n  jam_pulang TIME,\n  status ENUM('Hadir', 'Izin', 'Sakit', 'Dinas Luar'),\n  lokasi VARCHAR(255),\n  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE\n);\n\nCREATE TABLE dpl_signatures (\n  user_id INT PRIMARY KEY,\n  nama_dpl VARCHAR(100),\n  nip_dpl VARCHAR(50),\n  signature_data_url LONGTEXT,\n  tanggal_ttd DATE,\n  catatan_dpl TEXT,\n  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE\n);`,
          parameters: [],
          isolationEnforced: true,
          executionTimeMs: 1.8,
          status: 'SUCCESS',
          details: 'Inisialisasi skema lengkap tabel users, logbooks, absensi, dan dpl_signatures berhasil.',
        });
      }
    } catch {
      this.users = [...INITIAL_USERS];
      this.logbooks = [...INITIAL_LOGBOOKS];
      this.attendance = [...INITIAL_ATTENDANCE];
      this.signatures = { ...INITIAL_DPL_SIGNATURES };
      this.dokumentasi = [...INITIAL_DOKUMENTASI];
      this.sqlLogs = [];
    }
  }

  private saveUsers() {
    try {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(this.users));
    } catch (e) {
      console.warn('Storage error', e);
    }
  }

  private saveLogbooks() {
    try {
      localStorage.setItem(LOGBOOKS_STORAGE_KEY, JSON.stringify(this.logbooks));
    } catch (e) {
      console.warn('Storage error', e);
    }
  }

  private saveAttendance() {
    try {
      localStorage.setItem(ATTENDANCE_STORAGE_KEY, JSON.stringify(this.attendance));
    } catch (e) {
      console.warn('Storage error', e);
    }
  }

  private saveSignatures() {
    try {
      localStorage.setItem(SIGNATURES_STORAGE_KEY, JSON.stringify(this.signatures));
    } catch (e) {
      console.warn('Storage error', e);
    }
  }

  private saveDokumentasi() {
    try {
      localStorage.setItem(DOKUMENTASI_STORAGE_KEY, JSON.stringify(this.dokumentasi));
    } catch (e) {
      console.warn('Storage error', e);
    }
  }

  private saveSqlLogs() {
    try {
      localStorage.setItem(SQL_LOGS_STORAGE_KEY, JSON.stringify(this.sqlLogs.slice(0, 50)));
    } catch (e) {
      console.warn('Storage error', e);
    }
  }

  public subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach((l) => l());
  }

  private logSql(log: Omit<SqlQueryLog, 'id' | 'timestamp'>) {
    const entry: SqlQueryLog = {
      id: 'sql_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      timestamp: new Date().toLocaleTimeString('id-ID', { hour12: false }) + '.' + String(Date.now() % 1000).padStart(3, '0'),
      ...log,
    };
    this.sqlLogs.unshift(entry);
    if (this.sqlLogs.length > 50) {
      this.sqlLogs = this.sqlLogs.slice(0, 50);
    }
    this.saveSqlLogs();
  }

  public getSqlLogs(): SqlQueryLog[] {
    return [...this.sqlLogs];
  }

  public clearSqlLogs() {
    this.sqlLogs = [];
    this.saveSqlLogs();
    this.notify();
  }

  public getAllUsers(): User[] {
    return [...this.users];
  }

  public getRawDatabaseTables() {
    return {
      users: [...this.users],
      logbooks: [...this.logbooks],
      attendance: [...this.attendance],
      signatures: { ...this.signatures },
    };
  }

  public resetDatabaseToDefault() {
    this.users = [...INITIAL_USERS];
    this.logbooks = [...INITIAL_LOGBOOKS];
    this.attendance = [...INITIAL_ATTENDANCE];
    this.signatures = { ...INITIAL_DPL_SIGNATURES };
    this.dokumentasi = [...INITIAL_DOKUMENTASI];
    this.saveUsers();
    this.saveLogbooks();
    this.saveAttendance();
    this.saveSignatures();
    this.saveDokumentasi();
    this.logSql({
      operation: 'SCHEMA',
      query: `TRUNCATE TABLE logbooks;\nTRUNCATE TABLE absensi;\nTRUNCATE TABLE users;\n-- Seeding peserta Rizky Pratama (Dinas Kominfo Lombok Timur)`,
      parameters: [],
      isolationEnforced: true,
      executionTimeMs: 4.2,
      status: 'SUCCESS',
      details: 'Database direset ke kondisi default (Rizky Pratama - Dinas Kominfo Lombok Timur).',
    });
    this.notify();
  }

  // 1. AUTHENTICATION & LOGIN DENGAN USERNAME / NOMOR HP & PASSWORD
  public loginUser(
    identifier: string,
    password?: string
  ): { success: boolean; user?: User; message: string } {
    const cleanId = identifier.trim();
    if (!cleanId) {
      return { success: false, message: 'Masukkan username atau nomor telepon Anda!' };
    }

    // Cari user berdasarkan username (case-insensitive) atau nomor telepon
    const matchedUser = this.users.find(
      (u) =>
        u.username.toLowerCase() === cleanId.toLowerCase() ||
        u.nomor_telepon === cleanId
    );

    if (!matchedUser) {
      this.logSql({
        operation: 'SELECT',
        query: `SELECT * FROM users WHERE username = '${cleanId}' OR nomor_telepon = '${cleanId}' LIMIT 1;`,
        parameters: [cleanId, cleanId],
        isolationEnforced: true,
        executionTimeMs: 0.7,
        status: 'VALIDATION_ERROR',
        details: `Login gagal: Akun '${cleanId}' tidak terdaftar di database Diskominfo.`,
      });
      return {
        success: false,
        message: 'Akun tidak ditemukan. Silakan periksa kembali atau daftar sebagai anak magang baru!',
      };
    }

    // Validasi Password jika ada
    if (password !== undefined && password !== '') {
      const expectedPassword = matchedUser.password || 'magang123';
      if (password !== expectedPassword) {
        this.logSql({
          operation: 'SELECT',
          query: `SELECT id, username, password FROM users WHERE id = ${matchedUser.id} AND password = MD5(?); -- PASSWORD MISMATCH`,
          parameters: ['***'],
          isolationEnforced: true,
          executionTimeMs: 0.9,
          status: 'VALIDATION_ERROR',
          details: `Percobaan login ID #${matchedUser.id} (${matchedUser.username}) gagal: Kata sandi salah.`,
        });
        return { success: false, message: 'Kata sandi (password) salah! Silakan coba lagi.' };
      }
    }

    this.logSql({
      operation: 'SELECT',
      query: `SELECT id, username, role, nomor_telepon, instansi_pendidikan, divisi_pkl FROM users WHERE id = ${matchedUser.id} LIMIT 1;`,
      parameters: [matchedUser.id],
      isolationEnforced: true,
      executionTimeMs: 0.6,
      status: 'SUCCESS',
      affectedRows: 1,
      details: `Login sukses: ${matchedUser.username} (${matchedUser.role === 'admin' ? 'Admin Diskominfo' : 'Peserta PKL'}) -> Sesi Aktif.`,
    });

    this.notify();
    return {
      success: true,
      user: matchedUser,
      message: `Selamat datang kembali, ${matchedUser.nama_lengkap || matchedUser.username}!`,
    };
  }

  // PENDAFTARAN RESMI ANAK MAGANG DISKOMINFO
  public registerIntern(data: {
    username: string;
    password?: string;
    nama_lengkap: string;
    nomor_telepon: string;
    instansi_pendidikan: string;
    jurusan?: string;
    divisi_pkl: string;
    periode_mulai?: string;
    periode_selesai?: string;
    target_hari?: number;
    nama_dpl?: string;
    nip_dpl?: string;
    kontak_dpl?: string;
    nama_pl?: string;
    nip_pl?: string;
    jabatan_pl?: string;
    avatar_url?: string;
  }): { success: boolean; user?: User; message: string } {
    const cleanUsername = data.username.trim();
    const cleanTelp = data.nomor_telepon.trim();
    const cleanNama = data.nama_lengkap.trim() || cleanUsername;
    const cleanInstansi = data.instansi_pendidikan.trim();
    const cleanPassword = data.password ? data.password.trim() : 'magang123';

    if (!cleanUsername || !cleanTelp || !cleanInstansi) {
      return { success: false, message: 'Username, nomor telepon, dan nama sekolah/kampus wajib diisi!' };
    }

    // Periksa keunikan nomor telepon & username
    const duplicateTelp = this.users.find((u) => u.nomor_telepon === cleanTelp);
    if (duplicateTelp) {
      return {
        success: false,
        message: `Nomor telepon ${cleanTelp} sudah terdaftar atas nama ${duplicateTelp.username}. Silakan gunakan nomor lain atau login!`,
      };
    }

    const duplicateUsername = this.users.find(
      (u) => u.username.toLowerCase() === cleanUsername.toLowerCase()
    );
    if (duplicateUsername) {
      return {
        success: false,
        message: `Username '${cleanUsername}' sudah digunakan. Silakan pilih username lain!`,
      };
    }

    const newId = this.users.length > 0 ? Math.max(...this.users.map((u) => u.id)) + 1 : 1;
    const namaDpl = data.nama_dpl?.trim() || 'Drs. Lalu Muhammad Zaini, M.Pd';
    const nipDpl = data.nip_dpl?.trim() || '19750819 199903 1 004';
    const namaPl = data.nama_pl?.trim() || 'Ibu Siti, S.Kom';
    const nipPl = data.nip_pl?.trim() || '19830412 200801 2 006';
    const jabatanPl = data.jabatan_pl?.trim() || 'Pranata Komputer Ahli Muda';

    const newUser: User = {
      id: newId,
      username: cleanUsername,
      password: cleanPassword,
      role: 'peserta',
      nama_lengkap: cleanNama,
      nomor_telepon: cleanTelp,
      instansi_pendidikan: cleanInstansi,
      jurusan: data.jurusan?.trim() || 'Teknik Informatika / TKJ',
      divisi_pkl: data.divisi_pkl?.trim() || 'Bidang Aplikasi Informatika & e-Government',
      kabupaten: 'Kabupaten Lombok Timur',
      nama_dpl: namaDpl,
      nip_dpl: nipDpl,
      kontak_dpl: data.kontak_dpl?.trim() || '',
      dpl_kampus: namaDpl,
      nama_pl: namaPl,
      nip_pl: nipPl,
      jabatan_pl: jabatanPl,
      nama_pembimbing: namaPl,
      nip_pembimbing: nipPl,
      periode_mulai: data.periode_mulai || '2024-10-26',
      periode_selesai: data.periode_selesai || '2024-12-21',
      target_hari: data.target_hari || 56,
      avatar_url: data.avatar_url || '/src/assets/images/avatar_pkl_male_1793886103683.jpg',
      status_akun: 'Aktif',
      created_at: new Date().toISOString().replace('T', ' ').substring(0, 19),
    };

    this.users.push(newUser);
    this.saveUsers();

    this.logSql({
      operation: 'INSERT',
      query: `INSERT INTO users (username, password, nama_lengkap, nomor_telepon, instansi_pendidikan, jurusan, divisi_pkl, nama_dpl, nip_dpl, nama_pl, nip_pl, periode_mulai, periode_selesai)\nVALUES ('${cleanUsername}', MD5('${cleanPassword}'), '${cleanNama}', '${cleanTelp}', '${cleanInstansi}', '${newUser.jurusan}', '${newUser.divisi_pkl}', '${namaDpl}', '${nipDpl}', '${namaPl}', '${nipPl}', '${newUser.periode_mulai}', '${newUser.periode_selesai}');`,
      parameters: [cleanUsername, cleanTelp, cleanInstansi, newUser.divisi_pkl],
      isolationEnforced: true,
      executionTimeMs: 1.4,
      status: 'SUCCESS',
      affectedRows: 1,
      details: `Pendaftaran Anak Magang Diskominfo ID #${newId} (${cleanNama}) berhasil disimpan.`,
    });

    this.notify();
    return {
      success: true,
      user: newUser,
      message: `Pendaftaran berhasil! Selamat datang di Diskominfo Lombok Timur, ${cleanNama}.`,
    };
  }

  // Quick processLoginRegister for backwards compatibility
  public processLoginRegister(username: string, nomorTelepon: string): { success: boolean; user?: User; message: string; isNewUser: boolean } {
    const res = this.loginUser(nomorTelepon);
    if (res.success && res.user) {
      return { success: true, user: res.user, message: res.message, isNewUser: false };
    }
    const reg = this.registerIntern({
      username,
      nama_lengkap: username,
      nomor_telepon: nomorTelepon,
      instansi_pendidikan: 'SMK N 1 Selong — TKJ',
      divisi_pkl: 'Bidang Aplikasi Informatika & e-Government',
    });
    return {
      success: reg.success,
      user: reg.user,
      message: reg.message,
      isNewUser: true,
    };
  }

  // UPDATE PERIODE & PROFIL PESERTA PKL (User Requested)
  public updateUserProfile(
    userId: number,
    data: {
      username?: string;
      password?: string;
      nama_lengkap?: string;
      nomor_telepon?: string;
      avatar_url?: string;
      instansi_pendidikan?: string;
      jurusan?: string;
      divisi_pkl?: string;
      kabupaten?: string;
      nama_dpl?: string;
      nip_dpl?: string;
      kontak_dpl?: string;
      dpl_kampus?: string;
      nama_pl?: string;
      nip_pl?: string;
      jabatan_pl?: string;
      nama_pembimbing?: string;
      nip_pembimbing?: string;
      periode_mulai?: string;
      periode_selesai?: string;
      target_hari?: number;
    }
  ): { success: boolean; message: string; user?: User } {
    const targetUser = this.users.find((u) => u.id === userId);
    if (!targetUser) {
      return { success: false, message: 'Data peserta tidak ditemukan!' };
    }

    if (data.username && data.username.trim()) targetUser.username = data.username.trim();
    if (data.password && data.password.trim()) targetUser.password = data.password.trim();
    if (data.nama_lengkap && data.nama_lengkap.trim()) targetUser.nama_lengkap = data.nama_lengkap.trim();
    if (data.nomor_telepon && data.nomor_telepon.trim()) targetUser.nomor_telepon = data.nomor_telepon.trim();
    if (data.avatar_url) targetUser.avatar_url = data.avatar_url;
    if (data.instansi_pendidikan) targetUser.instansi_pendidikan = data.instansi_pendidikan.trim();
    if (data.jurusan) targetUser.jurusan = data.jurusan.trim();
    if (data.divisi_pkl) targetUser.divisi_pkl = data.divisi_pkl.trim();
    if (data.kabupaten) targetUser.kabupaten = data.kabupaten.trim();
    
    // DPL (Kampus/Sekolah)
    if (data.nama_dpl) {
      targetUser.nama_dpl = data.nama_dpl.trim();
      targetUser.dpl_kampus = targetUser.nama_dpl;
    } else if (data.dpl_kampus) {
      targetUser.nama_dpl = data.dpl_kampus.trim();
      targetUser.dpl_kampus = targetUser.nama_dpl;
    }
    if (data.nip_dpl) targetUser.nip_dpl = data.nip_dpl.trim();
    if (data.kontak_dpl) targetUser.kontak_dpl = data.kontak_dpl.trim();

    // PL (Diskominfo)
    if (data.nama_pl) {
      targetUser.nama_pl = data.nama_pl.trim();
      targetUser.nama_pembimbing = targetUser.nama_pl;
    } else if (data.nama_pembimbing) {
      targetUser.nama_pl = data.nama_pembimbing.trim();
      targetUser.nama_pembimbing = targetUser.nama_pl;
    }
    if (data.nip_pl) {
      targetUser.nip_pl = data.nip_pl.trim();
      targetUser.nip_pembimbing = targetUser.nip_pl;
    } else if (data.nip_pembimbing) {
      targetUser.nip_pl = data.nip_pembimbing.trim();
      targetUser.nip_pembimbing = targetUser.nip_pl;
    }
    if (data.jabatan_pl) targetUser.jabatan_pl = data.jabatan_pl.trim();

    if (data.periode_mulai) targetUser.periode_mulai = data.periode_mulai.trim();
    if (data.periode_selesai) targetUser.periode_selesai = data.periode_selesai.trim();
    if (data.target_hari && data.target_hari > 0) targetUser.target_hari = data.target_hari;

    this.saveUsers();

    this.logSql({
      operation: 'UPDATE',
      query: `UPDATE users \nSET username = '${targetUser.username}', nama_dpl = '${targetUser.nama_dpl}', nama_pl = '${targetUser.nama_pl}', instansi_pendidikan = '${targetUser.instansi_pendidikan}' \nWHERE id = ${userId};`,
      parameters: [targetUser.username, targetUser.nomor_telepon, targetUser.instansi_pendidikan, userId],
      isolationEnforced: true,
      executionTimeMs: 1.1,
      status: 'SUCCESS',
      affectedRows: 1,
      details: `Profil & Pengaturan DPL/PL peserta ID #${userId} (${targetUser.username}) berhasil diperbarui ke database.`,
    });

    this.notify();
    return { success: true, message: 'Profil dan pembimbing (DPL & PL) berhasil diperbarui!', user: targetUser };
  }

  // Backward compatibility alias
  public updateUserPeriodAndProfile(
    userId: number,
    data: Parameters<SimulatedMysqlEngine['updateUserProfile']>[1]
  ) {
    return this.updateUserProfile(userId, data);
  }

  // 2. DASHBOARD LOADER
  public loadDashboard(currentUserId: number) {
    const userLogbooks = this.logbooks.filter((item) => item.user_id === currentUserId);
    const sortedLogbooks = [...userLogbooks].sort((a, b) => {
      const dateDiff = new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime();
      if (dateDiff !== 0) return dateDiff;
      return b.id - a.id;
    });

    const userAttendance = this.attendance.filter((a) => a.user_id === currentUserId);
    const uniqueDates = new Set(userLogbooks.map((l) => l.tanggal));
    const hariAktif = Math.max(uniqueDates.size, userAttendance.length);
    const totalJam = userLogbooks.reduce((acc, curr) => acc + (curr.durasi_jam || 0), 0);

    const hadirCount = userAttendance.filter((a) => a.status === 'Hadir' || a.status === 'Dinas Luar').length;
    const kehadiranPercent = userAttendance.length > 0 ? Math.round((hadirCount / userAttendance.length) * 100) : 98;

    return {
      totalAktivitas: userLogbooks.length,
      totalJam,
      hariAktif: hariAktif || 45,
      kehadiranPercent: kehadiranPercent || 98,
      totalDokumentasi: 128, // Sesuai referensi foto (128 Foto)
      daftarLogbook: sortedLogbooks,
    };
  }

  // 3. LOGBOOK CRUD (CREATE)
  public addLogbook(
    currentUserId: number,
    data: {
      tanggal: string;
      nama_kegiatan: string;
      deskripsi_kegiatan: string;
      durasi_jam?: number;
      kategori?: KategoriKegiatan;
      lokasi?: string;
      status_verifikasi?: StatusVerifikasi;
    }
  ): { success: boolean; message: string; newId?: number } {
    const cleanTanggal = (data.tanggal || '').trim();
    const cleanNama = (data.nama_kegiatan || '').trim();
    const cleanDeskripsi = (data.deskripsi_kegiatan || '').trim();

    if (!cleanTanggal || !cleanNama || !cleanDeskripsi) {
      return { success: false, message: 'Tanggal, nama, dan deskripsi kegiatan wajib diisi!' };
    }

    const newId = this.logbooks.length > 0 ? Math.max(...this.logbooks.map((l) => l.id)) + 1 : 1;
    const newLogbook: LogbookItem = {
      id: newId,
      user_id: currentUserId,
      tanggal: cleanTanggal,
      nama_kegiatan: cleanNama,
      deskripsi_kegiatan: cleanDeskripsi,
      durasi_jam: data.durasi_jam && data.durasi_jam > 0 ? Number(data.durasi_jam) : 8,
      kategori: data.kategori || 'Desain',
      status_verifikasi: data.status_verifikasi || 'Selesai',
      lokasi: data.lokasi || 'Dinas Kominfo Lombok Timur',
      created_at: new Date().toISOString().replace('T', ' ').substring(0, 19),
    };

    this.logbooks.unshift(newLogbook);
    this.saveLogbooks();

    this.logSql({
      operation: 'INSERT',
      query: `INSERT INTO logbooks (user_id, tanggal, nama_kegiatan, deskripsi_kegiatan, lokasi, status_verifikasi)\nVALUES (?, ?, ?, ?, ?, ?);`,
      parameters: [currentUserId, cleanTanggal, cleanNama, cleanDeskripsi.substring(0, 30) + '...', newLogbook.lokasi, newLogbook.status_verifikasi],
      isolationEnforced: true,
      executionTimeMs: 0.9,
      status: 'SUCCESS',
      affectedRows: 1,
      details: `Logbook #${newId} disimpan dengan relasi user_id = ${currentUserId}.`,
    });

    this.notify();
    return { success: true, message: 'Kegiatan berhasil dicatat ke logbook!', newId };
  }

  // 4. LOGBOOK CRUD (UPDATE)
  public updateLogbook(
    currentUserId: number,
    logbookId: number,
    data: {
      tanggal: string;
      nama_kegiatan: string;
      deskripsi_kegiatan: string;
      durasi_jam?: number;
      kategori?: KategoriKegiatan;
      lokasi?: string;
      status_verifikasi?: StatusVerifikasi;
    }
  ): { success: boolean; message: string } {
    const targetData = this.logbooks.find((l) => l.id === logbookId && l.user_id === currentUserId);

    if (!targetData) {
      this.logSql({
        operation: 'UPDATE',
        query: `UPDATE logbooks SET nama_kegiatan = ? WHERE id = ? AND user_id = ?; -- AKSES DITOLAK`,
        parameters: [data.nama_kegiatan, logbookId, currentUserId],
        isolationEnforced: true,
        executionTimeMs: 0.5,
        status: 'REJECTED_UNAUTHORIZED',
        details: `Pelanggaran akses: User ID #${currentUserId} tidak berhak mengubah Logbook #${logbookId}.`,
      });
      return { success: false, message: 'Akses ditolak! Data bukan milik Anda.' };
    }

    targetData.tanggal = data.tanggal.trim() || targetData.tanggal;
    targetData.nama_kegiatan = data.nama_kegiatan.trim() || targetData.nama_kegiatan;
    targetData.deskripsi_kegiatan = data.deskripsi_kegiatan.trim() || targetData.deskripsi_kegiatan;
    if (data.durasi_jam) targetData.durasi_jam = Number(data.durasi_jam);
    if (data.kategori) targetData.kategori = data.kategori;
    if (data.lokasi) targetData.lokasi = data.lokasi;
    if (data.status_verifikasi) targetData.status_verifikasi = data.status_verifikasi;
    targetData.updated_at = new Date().toISOString().replace('T', ' ').substring(0, 19);

    this.saveLogbooks();
    this.notify();
    return { success: true, message: 'Data logbook berhasil diperbarui.' };
  }

  // 5. LOGBOOK CRUD (DELETE)
  public deleteLogbook(currentUserId: number, logbookId: number): { success: boolean; message: string } {
    const targetData = this.logbooks.find((l) => l.id === logbookId && l.user_id === currentUserId);

    if (targetData) {
      this.logbooks = this.logbooks.filter((l) => !(l.id === logbookId && l.user_id === currentUserId));
      this.saveLogbooks();

      this.logSql({
        operation: 'DELETE',
        query: `DELETE FROM logbooks WHERE id = ? AND user_id = ?;`,
        parameters: [logbookId, currentUserId],
        isolationEnforced: true,
        executionTimeMs: 0.7,
        status: 'SUCCESS',
        affectedRows: 1,
        details: `Logbook #${logbookId} milik user #${currentUserId} berhasil dihapus.`,
      });

      this.notify();
      return { success: true, message: 'Data kegiatan berhasil dihapus dari logbook.' };
    } else {
      return { success: false, message: 'Akses ditolak! Data bukan milik Anda.' };
    }
  }

  // 6. ABSENSI (ATTENDANCE) METHODS - Requested by user
  public getAttendanceRecords(currentUserId: number): AttendanceRecord[] {
    const records = this.attendance.filter((a) => a.user_id === currentUserId);
    return [...records].sort((a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime());
  }

  public recordCheckIn(
    currentUserId: number,
    data: {
      tanggal: string;
      jam_masuk: string;
      status: 'Hadir' | 'Izin' | 'Sakit' | 'Dinas Luar';
      lokasi: string;
      keterangan?: string;
    }
  ): { success: boolean; message: string } {
    const existing = this.attendance.find((a) => a.user_id === currentUserId && a.tanggal === data.tanggal);

    if (existing) {
      return { success: false, message: `Anda sudah melakukan presensi masuk untuk tanggal ${data.tanggal}.` };
    }

    const newId = this.attendance.length > 0 ? Math.max(...this.attendance.map((a) => a.id)) + 1 : 1;
    const newRecord: AttendanceRecord = {
      id: newId,
      user_id: currentUserId,
      tanggal: data.tanggal,
      jam_masuk: data.jam_masuk,
      status: data.status,
      lokasi: data.lokasi || 'Dinas Kominfo Lombok Timur',
      keterangan: data.keterangan || 'Presensi Mandiri PKL',
      metode: 'Web Presensi',
    };

    this.attendance.unshift(newRecord);
    this.saveAttendance();

    this.logSql({
      operation: 'INSERT',
      query: `INSERT INTO absensi (user_id, tanggal, jam_masuk, status, lokasi)\nVALUES (?, ?, ?, ?, ?);`,
      parameters: [currentUserId, data.tanggal, data.jam_masuk, data.status, newRecord.lokasi],
      isolationEnforced: true,
      executionTimeMs: 0.8,
      status: 'SUCCESS',
      affectedRows: 1,
      details: `Presensi masuk tercatat: ${data.tanggal} (${data.status}).`,
    });

    this.notify();
    return { success: true, message: 'Presensi masuk berhasil dicatat!' };
  }

  public recordCheckOut(currentUserId: number, attendanceId: number, jamPulang: string): { success: boolean; message: string } {
    const target = this.attendance.find((a) => a.id === attendanceId && a.user_id === currentUserId);
    if (!target) {
      return { success: false, message: 'Data presensi tidak ditemukan atau bukan milik Anda.' };
    }

    target.jam_pulang = jamPulang;
    this.saveAttendance();

    this.logSql({
      operation: 'UPDATE',
      query: `UPDATE absensi SET jam_pulang = ? WHERE id = ? AND user_id = ?;`,
      parameters: [jamPulang, attendanceId, currentUserId],
      isolationEnforced: true,
      executionTimeMs: 0.7,
      status: 'SUCCESS',
      affectedRows: 1,
      details: `Presensi pulang tercatat pada jam ${jamPulang}.`,
    });

    this.notify();
    return { success: true, message: 'Presensi pulang berhasil dicatat. Selamat beristirahat!' };
  }

  // 7. TANDA TANGAN DPL (Dosen Pembimbing Lapangan) - Requested by user
  public getDplSignature(currentUserId: number): DplSignatureRecord {
    if (this.signatures[currentUserId]) {
      return this.signatures[currentUserId];
    }

    const user = this.users.find((u) => u.id === currentUserId);
    return {
      user_id: currentUserId,
      nama_dpl: user?.nama_pembimbing || 'Ibu Siti, S.Kom',
      nip_dpl: user?.nip_pembimbing || '19830412 200801 2 006',
      instansi: user?.divisi_pkl || 'Dinas Kominfo Lombok Timur',
      signature_data_url: '',
      tanggal_ttd: '',
      status_pengesahan: 'Menunggu Tanda Tangan DPL',
      catatan_dpl: '',
    };
  }

  public saveDplSignature(
    currentUserId: number,
    data: {
      nama_dpl: string;
      nip_dpl: string;
      signature_data_url: string;
      catatan_dpl: string;
      nilai_angka?: number;
      predikat?: 'A (Sangat Memuaskan)' | 'B (Baik)' | 'C (Cukup)';
    }
  ): { success: boolean; message: string } {
    const today = new Date().toISOString().split('T')[0];
    const record: DplSignatureRecord = {
      user_id: currentUserId,
      nama_dpl: data.nama_dpl,
      nip_dpl: data.nip_dpl,
      instansi: 'Dinas Kominfo Lombok Timur',
      signature_data_url: data.signature_data_url,
      tanggal_ttd: today,
      status_pengesahan: 'Telah Disahkan & Ditandatangani',
      catatan_dpl: data.catatan_dpl,
      nilai_angka: data.nilai_angka || 95,
      predikat: data.predikat || 'A (Sangat Memuaskan)',
    };

    this.signatures[currentUserId] = record;
    this.saveSignatures();

    this.logSql({
      operation: 'UPDATE',
      query: `INSERT INTO dpl_signatures (user_id, nama_dpl, nip_dpl, signature_data_url, tanggal_ttd, status)\nVALUES (?, ?, ?, [BASE64_SIGNATURE], ?, 'Disahkan')\nON DUPLICATE KEY UPDATE signature_data_url = VALUES(signature_data_url);`,
      parameters: [currentUserId, data.nama_dpl, data.nip_dpl, today],
      isolationEnforced: true,
      executionTimeMs: 1.4,
      status: 'SUCCESS',
      affectedRows: 1,
      details: `Tanda tangan digital DPL (${data.nama_dpl}) untuk Peserta #${currentUserId} berhasil disimpan.`,
    });

    this.notify();
    return { success: true, message: 'Tanda tangan DPL & pengesahan nilai berhasil disimpan!' };
  }

  // 8. DOKUMENTASI FOTO
  public getDokumentasi(currentUserId: number): DokumentasiFoto[] {
    const userDocs = this.dokumentasi.filter((d) => d.user_id === currentUserId);
    return userDocs.length > 0 ? userDocs : this.dokumentasi;
  }

  public addDokumentasi(currentUserId: number, doc: Omit<DokumentasiFoto, 'id' | 'user_id'>) {
    const newId = this.dokumentasi.length > 0 ? Math.max(...this.dokumentasi.map((d) => d.id)) + 1 : 1;
    this.dokumentasi.unshift({
      id: newId,
      user_id: currentUserId,
      ...doc,
    });
    this.saveDokumentasi();
    this.notify();
  }

  // 9. CROSS-USER TAMPER TEST
  public testCrossUserTamper(currentUserId: number, targetLogbookId: number, action: 'DELETE' | 'EDIT' | 'VIEW_DETAIL'): SecurityTestResult {
    const currentUser = this.users.find((u) => u.id === currentUserId);
    const targetLogbook = this.logbooks.find((l) => l.id === targetLogbookId);
    const targetOwner = targetLogbook ? this.users.find((u) => u.id === targetLogbook.user_id) : undefined;

    const currentUserName = currentUser ? currentUser.username : `User #${currentUserId}`;
    const targetOwnerName = targetOwner ? targetOwner.username : 'Unknown';
    const targetOwnerId = targetLogbook ? targetLogbook.user_id : 0;

    let queryExecuted = '';
    let isBlocked = false;
    let message = '';

    if (action === 'DELETE') {
      queryExecuted = `DELETE FROM logbooks WHERE id = ${targetLogbookId} AND user_id = ${currentUserId};`;
      if (targetLogbook && targetLogbook.user_id !== currentUserId) {
        isBlocked = true;
        message = `[Akses Ditolak]: Logbook ID #${targetLogbookId} adalah milik ${targetOwnerName} (user_id=${targetOwnerId}). Klausa "AND user_id = ${currentUserId}" menghasilkan 0 row terdampak. Tindakan diblokir!`;
      } else {
        isBlocked = false;
        message = `Logbook #${targetLogbookId} adalah milik Anda sendiri. Validasi kepemilikan lolos.`;
      }
    } else if (action === 'EDIT') {
      queryExecuted = `UPDATE logbooks SET nama_kegiatan = 'TAMPERED' WHERE id = ${targetLogbookId} AND user_id = ${currentUserId};`;
      if (targetLogbook && targetLogbook.user_id !== currentUserId) {
        isBlocked = true;
        message = `[Akses Ditolak]: Percobaan Update ID #${targetLogbookId} milik ${targetOwnerName} digagalkan karena klausa WHERE user_id tidak cocok.`;
      } else {
        isBlocked = false;
        message = `Logbook #${targetLogbookId} adalah milik Anda sendiri.`;
      }
    } else {
      queryExecuted = `SELECT * FROM logbooks WHERE id = ${targetLogbookId} AND user_id = ${currentUserId};`;
      if (targetLogbook && targetLogbook.user_id !== currentUserId) {
        isBlocked = true;
        message = `[Akses Ditolak]: Query mengembalikan Empty Set (0 rows). User tidak dapat mengintip logbook peserta lain.`;
      } else {
        isBlocked = false;
        message = `Akses diizinkan karena Anda adalah pemilik sah record ini.`;
      }
    }

    this.logSql({
      operation: action === 'VIEW_DETAIL' ? 'SELECT' : action === 'DELETE' ? 'DELETE' : 'UPDATE',
      query: queryExecuted,
      parameters: [targetLogbookId, currentUserId],
      isolationEnforced: true,
      executionTimeMs: 0.5,
      status: isBlocked ? 'REJECTED_UNAUTHORIZED' : 'SUCCESS',
      details: `[Uji Penetrasi Multi-User]: ${message}`,
    });

    this.notify();

    return {
      attemptedAction: action,
      targetLogbookId,
      targetOwnerId,
      currentUserId,
      currentUserName,
      targetOwnerName,
      queryExecuted,
      isBlocked,
      message,
      timestamp: new Date().toLocaleTimeString('id-ID'),
    };
  }

  // 10. GENERATE SQL DUMP
  public generateSqlDump(): string {
    let sql = `-- SKEMA DAN DATA LOGBOOK PKL DINAS KOMINFO LOMBOK TIMUR\n`;
    sql += `-- Generated on ${new Date().toISOString()}\n\n`;
    sql += `CREATE TABLE IF NOT EXISTS \`users\` (\n`;
    sql += `  \`id\` INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,\n`;
    sql += `  \`username\` VARCHAR(100) NOT NULL,\n`;
    sql += `  \`nomor_telepon\` VARCHAR(20) NOT NULL UNIQUE,\n`;
    sql += `  \`instansi_pendidikan\` VARCHAR(100),\n`;
    sql += `  \`divisi_pkl\` VARCHAR(100),\n`;
    sql += `  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP\n`;
    sql += `);\n\n`;
    sql += `CREATE TABLE IF NOT EXISTS \`logbooks\` (\n`;
    sql += `  \`id\` INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,\n`;
    sql += `  \`user_id\` INT(11) NOT NULL,\n`;
    sql += `  \`tanggal\` DATE NOT NULL,\n`;
    sql += `  \`nama_kegiatan\` VARCHAR(255) NOT NULL,\n`;
    sql += `  \`deskripsi_kegiatan\` TEXT NOT NULL,\n`;
    sql += `  \`lokasi\` VARCHAR(100),\n`;
    sql += `  \`status_verifikasi\` ENUM('Selesai', 'Dalam Proses', 'Perlu Revisi') DEFAULT 'Selesai',\n`;
    sql += `  FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE\n`;
    sql += `);\n\n`;
    return sql;
  }
}

export const dbEngine = new SimulatedMysqlEngine();
