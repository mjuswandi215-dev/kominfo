import React, { useState, useMemo } from 'react';
import { User } from '../types/logbook';
import { dbEngine } from '../services/mysqlEngine';
import {
  Users,
  Building2,
  Calendar,
  GraduationCap,
  ShieldCheck,
  Search,
  CheckCircle2,
  Clock,
  BookOpen,
  UserCheck,
  ExternalLink,
  Plus,
  ArrowRight,
  Database,
  Briefcase
} from 'lucide-react';

interface AdminDiskominfoViewProps {
  currentAdmin: User;
  onSelectUserToInspect: (userId: number) => void;
  onOpenRegisterModal: () => void;
}

export const AdminDiskominfoView: React.FC<AdminDiskominfoViewProps> = ({
  currentAdmin,
  onSelectUserToInspect,
  onOpenRegisterModal,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDivisi, setFilterDivisi] = useState('ALL');

  const allUsers = useMemo(() => {
    return dbEngine.getAllUsers();
  }, []);

  const internUsers = useMemo(() => {
    return allUsers.filter((u) => u.role !== 'admin');
  }, [allUsers]);

  // Compute stats across all intern students
  const stats = useMemo(() => {
    const totalInterns = internUsers.length;
    let totalLogbooksAll = 0;
    let totalPresentToday = 0;
    const todayStr = new Date().toISOString().substring(0, 10);

    internUsers.forEach((u) => {
      const dbData = dbEngine.loadDashboard(u.id);
      totalLogbooksAll += dbData.totalAktivitas;
      const att = dbEngine.getAttendanceRecords(u.id);
      if (att.some((a) => a.tanggal === todayStr && a.status === 'Hadir')) {
        totalPresentToday += 1;
      }
    });

    return {
      totalInterns,
      totalLogbooksAll,
      totalPresentToday,
    };
  }, [internUsers]);

  const filteredInterns = useMemo(() => {
    return internUsers.filter((u) => {
      const matchSearch =
        u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (u.nama_lengkap && u.nama_lengkap.toLowerCase().includes(searchQuery.toLowerCase())) ||
        u.instansi_pendidikan.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.nomor_telepon.includes(searchQuery);

      const matchDivisi = filterDivisi === 'ALL' || u.divisi_pkl === filterDivisi;
      return matchSearch && matchDivisi;
    });
  }, [internUsers, searchQuery, filterDivisi]);

  return (
    <div className="space-y-6 font-quicksand">
      {/* Admin Top Banner */}
      <div className="bg-gradient-to-r from-[#0b2239] via-[#0f2d4a] to-[#1e3a5f] rounded-2xl p-6 sm:p-8 text-white shadow-md border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-[#e8732a] text-white text-[11px] font-bold rounded-full uppercase tracking-wider">
                Portal Administrator Diskominfo
              </span>
              <span className="text-xs text-blue-200">Kabupaten Lombok Timur</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Manajemen & Monitoring Anak Magang (PKL)
            </h1>
            <p className="text-xs sm:text-sm text-blue-100 max-w-2xl leading-relaxed">
              Selamat datang, <strong>{currentAdmin.nama_lengkap || currentAdmin.username}</strong>. Pantau seluruh peserta magang dari sekolah/kampus mitra, verifikasi pembimbing (DPL & PL), serta kelola logbook dan presensi harian.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={onOpenRegisterModal}
              className="px-4 py-2.5 bg-[#e8732a] hover:bg-[#d4621b] text-white text-xs font-bold rounded-xl flex items-center gap-2 transition-all shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Daftarkan Anak Magang Baru</span>
            </button>
          </div>
        </div>

        {/* Highlight Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mt-6 pt-6 border-t border-white/10">
          <div className="bg-white/10 backdrop-blur-xs p-4 rounded-xl border border-white/10">
            <div className="flex items-center justify-between text-blue-200 text-xs">
              <span>Total Anak Magang Aktif</span>
              <Users className="w-4 h-4 text-orange-400" />
            </div>
            <div className="text-2xl font-bold text-white mt-1">
              {stats.totalInterns} <span className="text-xs font-normal text-blue-200">Orang</span>
            </div>
            <div className="text-[11px] text-blue-300 mt-1">Terdaftar di Diskominfo Lotim</div>
          </div>

          <div className="bg-white/10 backdrop-blur-xs p-4 rounded-xl border border-white/10">
            <div className="flex items-center justify-between text-blue-200 text-xs">
              <span>Total Logbook Terkumpul</span>
              <BookOpen className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-bold text-white mt-1">
              {stats.totalLogbooksAll} <span className="text-xs font-normal text-blue-200">Kegiatan</span>
            </div>
            <div className="text-[11px] text-blue-300 mt-1">Semua peserta magang</div>
          </div>

          <div className="bg-white/10 backdrop-blur-xs p-4 rounded-xl border border-white/10">
            <div className="flex items-center justify-between text-blue-200 text-xs">
              <span>Presensi Masuk Hari Ini</span>
              <UserCheck className="w-4 h-4 text-blue-300" />
            </div>
            <div className="text-2xl font-bold text-white mt-1">
              {stats.totalPresentToday} <span className="text-xs font-normal text-blue-200">Peserta</span>
            </div>
            <div className="text-[11px] text-blue-300 mt-1">Kehadiran terverifikasi web</div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama, no. HP, sekolah/kampus..."
            className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0b2239]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <label className="text-xs font-semibold text-slate-600 whitespace-nowrap">
            Filter Divisi:
          </label>
          <select
            value={filterDivisi}
            onChange={(e) => setFilterDivisi(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-[#0b2239]"
          >
            <option value="ALL">Semua Divisi Diskominfo</option>
            <option value="Bidang Aplikasi Informatika & e-Government">Aplikasi Informatika & e-Gov</option>
            <option value="Bidang Informasi & Komunikasi Publik (IKP)">Informasi & Komunikasi Publik (IKP)</option>
            <option value="Bidang Persandian & Keamanan Siber">Persandian & Keamanan Siber</option>
            <option value="Bidang Statistik Sektoral">Statistik Sektoral</option>
            <option value="Sekretariat & Tata Usaha Diskominfo">Sekretariat & Tata Usaha</option>
          </select>
        </div>
      </div>

      {/* Table of Interns */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-sm text-slate-900">
              Daftar Anak Magang Terdaftar ({filteredInterns.length})
            </h3>
            <p className="text-xs text-slate-500">
              Peserta harus mendaftar akun terlebih dahulu sebelum dapat mengakses portal logbook.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Peserta & Akun</th>
                <th className="py-3.5 px-4">Sekolah / Kampus</th>
                <th className="py-3.5 px-4">Divisi Diskominfo</th>
                <th className="py-3.5 px-4">DPL (Kampus)</th>
                <th className="py-3.5 px-4">PL (Diskominfo)</th>
                <th className="py-3.5 px-4 text-center">Logbook</th>
                <th className="py-3.5 px-4 text-center">Aksi Admin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredInterns.map((intern) => {
                const userDashboard = dbEngine.loadDashboard(intern.id);
                return (
                  <tr key={intern.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                          <img
                            src={intern.avatar_url || '/src/assets/images/avatar_pkl_male_1793886103683.jpg'}
                            alt={intern.username}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 text-xs">
                            {intern.nama_lengkap || intern.username}
                          </div>
                          <div className="text-[11px] text-slate-500 font-mono">
                            @{intern.username} · {intern.nomor_telepon}
                          </div>
                          <span className="inline-block mt-0.5 text-[9px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-full">
                            {intern.status_akun || 'Aktif'}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-800">
                        {intern.instansi_pendidikan}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {intern.jurusan || 'Teknik Informatika / TKJ'}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 bg-blue-50 text-blue-800 border border-blue-200 rounded-lg text-[11px] font-semibold block w-fit">
                        {intern.divisi_pkl}
                      </span>
                      <span className="text-[10px] text-slate-400 block mt-1 font-mono">
                        {intern.periode_mulai} s/d {intern.periode_selesai}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-800">
                        {intern.nama_dpl || intern.dpl_kampus || '-'}
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">
                        NIP: {intern.nip_dpl || '-'}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-[#e8732a]">
                        {intern.nama_pl || intern.nama_pembimbing || '-'}
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">
                        NIP: {intern.nip_pl || intern.nip_pembimbing || '-'}
                      </div>
                      {intern.jabatan_pl && (
                        <div className="text-[10px] text-slate-400">
                          {intern.jabatan_pl}
                        </div>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <div className="font-bold text-slate-800 font-mono text-sm">
                        {userDashboard.totalAktivitas}
                      </div>
                      <span className="text-[10px] text-slate-500">Kegiatan</span>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => onSelectUserToInspect(intern.id)}
                        className="px-3 py-1.5 bg-[#0b2239] hover:bg-[#153e65] text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 mx-auto transition-colors shadow-xs"
                        title="Buka & pantau dashboard logbook anak magang ini"
                      >
                        <span>Periksa Logbook</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* SQL & System Flow for Diskominfo Administrator */}
      <div className="p-4 bg-slate-900 text-slate-200 rounded-2xl border border-slate-800 text-xs font-mono space-y-2">
        <div className="flex items-center gap-2 text-orange-400 font-bold">
          <Database className="w-4 h-4" />
          <span>Sistem Isolasi Multi-User Diskominfo (WHERE user_id = :session_user_id)</span>
        </div>
        <p className="text-slate-400 text-[11px] leading-relaxed">
          Setiap anak magang yang mendaftar mandiri menggunakan username, password, dan nomor HP secara otomatis diisolasi datanya dalam tabel <code className="text-blue-300">users</code> dan <code className="text-blue-300">logbooks</code>. Sebagai admin Diskominfo, Anda memiliki kewenangan penuh memeriksa dan mengesahkan seluruh kegiatan magang.
        </p>
      </div>
    </div>
  );
};
