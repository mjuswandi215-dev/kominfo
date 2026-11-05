import React, { useState, useMemo } from 'react';
import { User, LogbookItem, KategoriKegiatan } from '../types/logbook';
import { dbEngine } from '../services/mysqlEngine';
import {
  Calendar as CalendarIcon,
  Clock,
  Search,
  Plus,
  Trash2,
  Edit3,
  ExternalLink,
  Building2,
  GraduationCap,
  UserCheck,
  FileSpreadsheet,
  Database,
  ArrowUpDown,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Camera,
  BarChart2,
  PenTool,
  CheckSquare,
  ChevronRight,
  TrendingUp,
  MapPin,
  CalendarDays
} from 'lucide-react';

interface DashboardViewProps {
  currentUser: User;
  onOpenNewLogModal: () => void;
  onOpenEditLogModal: (item: LogbookItem) => void;
  onOpenDetailModal: (item: LogbookItem) => void;
  onNavigateToArchitecture: () => void;
  onNavigateToReport: () => void;
  onOpenAbsensiModal: () => void;
  onOpenDplModal: () => void;
  onOpenDokumentasiModal: () => void;
  onOpenEditPeriodModal: () => void;
  onOpenEditProfileModal: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  currentUser,
  onOpenNewLogModal,
  onOpenEditLogModal,
  onOpenDetailModal,
  onNavigateToArchitecture,
  onNavigateToReport,
  onOpenAbsensiModal,
  onOpenDplModal,
  onOpenDokumentasiModal,
  onOpenEditPeriodModal,
  onOpenEditProfileModal,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedKategori, setSelectedKategori] = useState<string>('ALL');
  const [deleteCandidateId, setDeleteCandidateId] = useState<number | null>(null);
  const [feedbackNotice, setFeedbackNotice] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Load dashboard data strictly for current_user_id
  const dashboardData = useMemo(() => {
    return dbEngine.loadDashboard(currentUser.id);
  }, [currentUser.id]);

  const dplSignature = useMemo(() => {
    return dbEngine.getDplSignature(currentUser.id);
  }, [currentUser.id]);

  const attendanceList = useMemo(() => {
    return dbEngine.getAttendanceRecords(currentUser.id);
  }, [currentUser.id]);

  // 5 latest logbooks as shown in the screenshot table
  const latestFiveLogbooks = useMemo(() => {
    let list = [...dashboardData.daftarLogbook];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (l) =>
          l.nama_kegiatan.toLowerCase().includes(q) ||
          l.deskripsi_kegiatan.toLowerCase().includes(q) ||
          l.lokasi.toLowerCase().includes(q)
      );
    }
    if (selectedKategori !== 'ALL') {
      list = list.filter((l) => l.kategori === selectedKategori);
    }
    return list.slice(0, 5);
  }, [dashboardData.daftarLogbook, searchQuery, selectedKategori]);

  const handleDeleteConfirm = () => {
    if (!deleteCandidateId) return;

    const res = dbEngine.deleteLogbook(currentUser.id, deleteCandidateId);
    if (res.success) {
      setFeedbackNotice({ type: 'success', message: res.message });
    } else {
      setFeedbackNotice({ type: 'error', message: res.message });
    }
    setDeleteCandidateId(null);

    setTimeout(() => {
      setFeedbackNotice(null);
    }, 3500);
  };

  // Calendar days representation for Oktober 2024 (matching the reference image)
  const calendarDays = [
    { day: 29, currentMonth: false },
    { day: 30, currentMonth: false },
    { day: 1, currentMonth: true },
    { day: 2, currentMonth: true },
    { day: 3, currentMonth: true },
    { day: 4, currentMonth: true, active: true },
    { day: 5, currentMonth: true },
    { day: 6, currentMonth: true },
    { day: 7, currentMonth: true, active: true },
    { day: 8, currentMonth: true, active: true },
    { day: 9, currentMonth: true, active: true },
    { day: 10, currentMonth: true, active: true },
    { day: 11, currentMonth: true, active: true },
    { day: 12, currentMonth: true, active: true, today: true },
    { day: 13, currentMonth: true },
    { day: 14, currentMonth: true },
    { day: 15, currentMonth: true },
    { day: 16, currentMonth: true },
    { day: 17, currentMonth: true },
    { day: 18, currentMonth: true },
    { day: 19, currentMonth: true },
    { day: 20, currentMonth: true },
    { day: 21, currentMonth: true },
    { day: 22, currentMonth: true },
    { day: 23, currentMonth: true },
    { day: 24, currentMonth: true },
    { day: 25, currentMonth: true },
    { day: 26, currentMonth: true },
    { day: 27, currentMonth: true },
    { day: 28, currentMonth: true },
    { day: 29, currentMonth: true },
    { day: 30, currentMonth: true },
    { day: 31, currentMonth: true },
    { day: 1, currentMonth: false },
    { day: 2, currentMonth: false },
  ];

  return (
    <div className="space-y-6">
      {/* Toast Notice */}
      {feedbackNotice && (
        <div
          className={`p-3.5 rounded-xl text-xs flex items-center justify-between border ${
            feedbackNotice.type === 'success'
              ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
              : 'bg-rose-50 text-rose-900 border-rose-200'
          }`}
        >
          <div className="flex items-center gap-2">
            {feedbackNotice.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            )}
            <span>{feedbackNotice.message}</span>
          </div>
          <button
            onClick={() => setFeedbackNotice(null)}
            className="text-slate-400 hover:text-slate-600 font-bold"
          >
            ×
          </button>
        </div>
      )}

      {/* Main 2-Column Grid Layout matching user's reference image */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left / Center 8 Cols */}
        <div className="lg:col-span-8 space-y-6">
          {/* Header Title & Breadcrumb */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Dashboard</h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Beranda / Dashboard / Ringkasan
              </p>
            </div>

            {/* Quick Action Badges */}
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenAbsensiModal}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
              >
                <CheckSquare className="w-3.5 h-3.5" />
                <span>Presensi Hari Ini</span>
              </button>
              <button
                onClick={onOpenNewLogModal}
                className="px-3.5 py-1.5 bg-[#e8732a] hover:bg-[#d4621b] text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Catat Kegiatan</span>
              </button>
            </div>
          </div>

          {/* Row 1: 4 Stat Cards (Exactly as in user reference image) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {/* 1. Total Hari PKL */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 font-medium">Total Hari PKL</span>
                <div className="w-8 h-8 rounded-lg bg-orange-100 text-[#e8732a] flex items-center justify-center">
                  <CalendarDays className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-2">
                <div className="text-2xl font-bold font-mono tabular-nums text-slate-900">
                  {dashboardData.hariAktif} Hari
                </div>
                <div className="text-[11px] text-emerald-600 flex items-center gap-1 mt-0.5">
                  <span>↑ 5 hari dari bulan lalu</span>
                </div>
              </div>
            </div>

            {/* 2. Total Kegiatan */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 font-medium">Total Kegiatan</span>
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-[#0f2d4a] flex items-center justify-center">
                  <BarChart2 className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-2">
                <div className="text-2xl font-bold font-mono tabular-nums text-slate-900">
                  {Math.max(32, dashboardData.totalAktivitas)} Kegiatan
                </div>
                <div className="text-[11px] text-emerald-600 flex items-center gap-1 mt-0.5">
                  <span>↑ 3 kegiatan minggu ini</span>
                </div>
              </div>
            </div>

            {/* 3. Total Dokumentasi */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 font-medium">Total Dokumentasi</span>
                <div className="w-8 h-8 rounded-lg bg-orange-100 text-[#e8732a] flex items-center justify-center">
                  <Camera className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-2">
                <div className="text-2xl font-bold font-mono tabular-nums text-slate-900">
                  {dashboardData.totalDokumentasi} Foto
                </div>
                <div className="text-[11px] text-emerald-600 flex items-center gap-1 mt-0.5">
                  <span>↑ 12 foto baru</span>
                </div>
              </div>
            </div>

            {/* 4. Kehadiran */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 font-medium">Kehadiran</span>
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-2">
                <div className="text-2xl font-bold font-mono tabular-nums text-slate-900">
                  {dashboardData.kehadiranPercent}%
                </div>
                <div className="text-[11px] text-emerald-700 font-semibold mt-0.5">
                  Sangat Baik
                </div>
              </div>
            </div>
          </div>

          {/* Row 2: Charts Row (Aktivitas Mingguan & Kategori Kegiatan) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Aktivitas Mingguan (Bar Chart) */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Aktivitas Mingguan</h3>
                <p className="text-xs text-slate-500">Jumlah kegiatan per hari dalam seminggu terakhir</p>
              </div>

              {/* Weekly bar graph matching reference screenshot */}
              <div className="h-44 flex items-end justify-between pt-4 pb-2 px-2 border-b border-slate-100">
                {[
                  { day: 'Sen', bar1: 4, bar2: 3.5 },
                  { day: 'Sel', bar1: 5.5, bar2: 4 },
                  { day: 'Rab', bar1: 7, bar2: 8.5 },
                  { day: 'Kam', bar1: 8, bar2: 5 },
                  { day: 'Jum', bar1: 6, bar2: 7.5 },
                  { day: 'Sab', bar1: 7, bar2: 6.5 },
                  { day: 'Min', bar1: 6.5, bar2: 8 },
                ].map((item, idx) => (
                  <div key={idx} className="flex flex-col items-center gap-1.5 group">
                    <div className="flex items-end gap-1 h-32">
                      <div
                        className="w-2.5 sm:w-3.5 bg-[#f28e4e] rounded-t-sm transition-all group-hover:brightness-95"
                        style={{ height: `${item.bar1 * 10}%` }}
                        title={`${item.day} Sesi 1: ${item.bar1} tugas`}
                      />
                      <div
                        className="w-2.5 sm:w-3.5 bg-[#0f2d4a] rounded-t-sm transition-all group-hover:brightness-125"
                        style={{ height: `${item.bar2 * 10}%` }}
                        title={`${item.day} Sesi 2: ${item.bar2} tugas`}
                      />
                    </div>
                    <span className="text-[11px] font-medium text-slate-600">{item.day}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-center gap-6 text-[11px] text-slate-600 pt-1">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 bg-[#f28e4e] rounded-full inline-block" />
                  <span>Kegiatan Rutin</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 bg-[#0f2d4a] rounded-full inline-block" />
                  <span>Tugas Khusus / Lapangan</span>
                </span>
              </div>
            </div>

            {/* Kategori Kegiatan (Donut / Pie Chart) */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Kategori Kegiatan</h3>
                <p className="text-xs text-slate-500">Distribusi kategori kegiatan PKL</p>
              </div>

              <div className="flex items-center justify-center py-2">
                {/* Visual donut representation matching reference image */}
                <div className="relative w-36 h-36">
                  <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                    {/* Desain: 35% */}
                    <circle
                      cx="18"
                      cy="18"
                      r="14"
                      fill="transparent"
                      stroke="#f28e4e"
                      strokeWidth="6"
                      strokeDasharray="35 65"
                      strokeDashoffset="0"
                    />
                    {/* Administrasi: 30% */}
                    <circle
                      cx="18"
                      cy="18"
                      r="14"
                      fill="transparent"
                      stroke="#0f2d4a"
                      strokeWidth="6"
                      strokeDasharray="30 70"
                      strokeDashoffset="-35"
                    />
                    {/* Jaringan: 20% */}
                    <circle
                      cx="18"
                      cy="18"
                      r="14"
                      fill="transparent"
                      stroke="#2b6cb0"
                      strokeWidth="6"
                      strokeDasharray="20 80"
                      strokeDashoffset="-65"
                    />
                    {/* Sosialisasi: 15% */}
                    <circle
                      cx="18"
                      cy="18"
                      r="14"
                      fill="transparent"
                      stroke="#f6ad55"
                      strokeWidth="6"
                      strokeDasharray="15 85"
                      strokeDashoffset="-85"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="text-xs font-bold text-slate-800">100%</span>
                    <span className="text-[9px] text-slate-500">Terdistribusi</span>
                  </div>
                </div>

                {/* Legend list matching reference image */}
                <div className="ml-4 space-y-1.5 text-xs text-slate-700">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#f28e4e]" />
                    <span>Desain — 35%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#0f2d4a]" />
                    <span>Administrasi — 30%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#2b6cb0]" />
                    <span>Jaringan — 20%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#f6ad55]" />
                    <span>Sosialisasi — 15%</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center gap-4 text-[10px] text-slate-500 border-t border-slate-100 pt-2">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>Selesai (85%)</span>
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  <span>Dalam Proses (15%)</span>
                </span>
              </div>
            </div>
          </div>

          {/* Row 3: Logbook Terbaru Table (Exactly matching user's reference image) */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Logbook Terbaru</h3>
                <p className="text-xs text-slate-500">5 kegiatan terbaru yang dicatat</p>
              </div>
              <button
                onClick={onOpenNewLogModal}
                className="text-xs font-semibold text-[#e8732a] hover:underline flex items-center gap-1"
              >
                <span>+ Tambah Kegiatan</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#0f2d4a] text-white font-semibold">
                    <th className="py-2.5 px-4 w-10 text-center">No</th>
                    <th className="py-2.5 px-4">Nama Kegiatan</th>
                    <th className="py-2.5 px-4 w-28">Tanggal</th>
                    <th className="py-2.5 px-4 w-40">Lokasi</th>
                    <th className="py-2.5 px-4 w-28 text-center">Status</th>
                    <th className="py-2.5 px-4 w-20 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800">
                  {latestFiveLogbooks.map((item, idx) => (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 text-center font-mono text-slate-400">
                        {idx + 1}.
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-900">
                        <div className="truncate max-w-sm">{item.nama_kegiatan}</div>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap text-slate-600 font-mono">
                        {item.tanggal}
                      </td>
                      <td className="py-3 px-4 text-slate-600 whitespace-nowrap">
                        {item.lokasi || 'Kantor Kominfo'}
                      </td>
                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        <span
                          className={`inline-block px-3 py-0.5 rounded-full text-[11px] font-semibold text-white ${
                            item.status_verifikasi === 'Selesai'
                              ? 'bg-emerald-600'
                              : 'bg-[#e8732a]'
                          }`}
                        >
                          {item.status_verifikasi}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => onOpenDetailModal(item)}
                            className="p-1 text-slate-400 hover:text-slate-800 rounded"
                            title="Detail"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onOpenEditLogModal(item)}
                            className="p-1 text-slate-400 hover:text-slate-800 rounded"
                            title="Edit"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeleteCandidateId(item.id)}
                            className="p-1 text-slate-400 hover:text-rose-600 rounded"
                            title="Hapus"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right 4 Cols: Dokumentasi Terbaru, Kalender, & Profil Peserta (As shown in screenshot) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Widget 1: Dokumentasi Terbaru (2x2 photo grid) */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Dokumentasi Terbaru</h3>
                <p className="text-xs text-slate-500">Galeri foto kegiatan PKL</p>
              </div>
              <button
                onClick={onOpenDokumentasiModal}
                className="text-xs font-semibold text-[#e8732a] hover:underline"
              >
                Lihat Semua
              </button>
            </div>

            {/* 2x2 Photo Grid matching the screenshot */}
            <div className="grid grid-cols-2 gap-2">
              <div
                onClick={onOpenDokumentasiModal}
                className="group relative rounded-xl overflow-hidden aspect-4/3 bg-slate-100 cursor-pointer border border-slate-200"
              >
                <img
                  src="/public/assets/aistudio/WhatsApp_Image_2026-11-05_at_22.23.38_4d00a6be.jpeg"
                  alt="Dokumentasi PKL 1"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div
                onClick={onOpenDokumentasiModal}
                className="group relative rounded-xl overflow-hidden aspect-4/3 bg-slate-100 cursor-pointer border border-slate-200"
              >
                <img
                  src="/src/assets/images/kominfo_hero_banner_1793886104325.jpg"
                  alt="Dokumentasi PKL 2"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div
                onClick={onOpenDokumentasiModal}
                className="group relative rounded-xl overflow-hidden aspect-4/3 bg-slate-100 cursor-pointer border border-slate-200"
              >
                <img
                  src="/public/assets/aistudio/WhatsApp_Image_2026-11-05_at_22.23.38_4d00a6be.jpeg"
                  alt="Dokumentasi PKL 3"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 object-right"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div
                onClick={onOpenDokumentasiModal}
                className="group relative rounded-xl overflow-hidden aspect-4/3 bg-slate-100 cursor-pointer border border-slate-200"
              >
                <img
                  src="/public/assets/aistudio/WhatsApp_Image_2026-11-05_at_22.23.38_4d00a6be.jpeg"
                  alt="Dokumentasi PKL 4"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 object-bottom"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          </div>

          {/* Widget 2: Kalender Oktober 2024 (Exact replica of screenshot) */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Kalender Oktober 2024</h3>
              <span className="text-xs text-slate-400 font-mono">Oktober 2024</span>
            </div>

            {/* Days of week */}
            <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-semibold text-slate-500">
              <span>S</span>
              <span>M</span>
              <span>E</span>
              <span>D</span>
              <span>W</span>
              <span>T</span>
              <span>F</span>
            </div>

            {/* Calendar numeric days */}
            <div className="grid grid-cols-7 gap-1 text-center text-xs">
              {calendarDays.slice(0, 35).map((cd, i) => (
                <div
                  key={i}
                  className={`py-1 rounded-full text-[11px] font-mono transition-colors ${
                    cd.today
                      ? 'bg-[#e8732a] text-white font-bold shadow-xs'
                      : cd.active
                      ? 'bg-orange-100 text-[#e8732a] font-semibold'
                      : cd.currentMonth
                      ? 'text-slate-800 hover:bg-slate-50'
                      : 'text-slate-300'
                  }`}
                >
                  {cd.day}
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[10px] text-slate-500">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#e8732a]" />
                <span>Hari Ini (12 Okt)</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-orange-200" />
                <span>Logbook Terisi</span>
              </span>
            </div>
          </div>

          {/* Widget 3: Profil Peserta & Tanda Tangan DPL (As shown in screenshot + DPL signature) */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Profil Peserta</h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={onOpenEditProfileModal}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1"
                  title="Ganti Foto Profil & Data Diri"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Ubah Profil</span>
                </button>
                <span className="text-slate-300">·</span>
                <button
                  onClick={onOpenDplModal}
                  className="text-xs font-semibold text-[#e8732a] hover:underline flex items-center gap-1"
                >
                  <PenTool className="w-3.5 h-3.5" />
                  <span>Tanda Tangan DPL</span>
                </button>
              </div>
            </div>

            {/* Avatar & Name - Clickable to open profile changer */}
            <div className="flex items-center gap-3">
              <div
                onClick={onOpenEditProfileModal}
                className="relative group cursor-pointer w-13 h-13 rounded-full overflow-hidden bg-slate-100 border-2 border-white shadow-xs shrink-0 ring-2 ring-orange-200 hover:ring-orange-400 transition-all"
                title="Klik untuk ganti foto profil & data peserta"
              >
                <img
                  src={currentUser.avatar_url || '/src/assets/images/avatar_pkl_male_1793886103683.jpg'}
                  alt={currentUser.username}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white text-[9px] font-semibold transition-opacity">
                  <Camera className="w-3.5 h-3.5 mb-0.5" />
                  <span>Ganti</span>
                </div>
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-slate-900 truncate">
                    {currentUser.username}
                  </h4>
                </div>
                <p className="text-xs text-slate-500 font-medium truncate">
                  {currentUser.instansi_pendidikan}
                </p>
                <button
                  onClick={onOpenEditProfileModal}
                  className="text-[11px] font-semibold text-[#e8732a] hover:underline flex items-center gap-1 mt-0.5"
                >
                  <Camera className="w-3 h-3" />
                  <span>Ganti foto / edit data</span>
                </button>
              </div>
            </div>

            {/* Period & Mentors (DPL & PL) Info */}
            <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Periode:</span>
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-slate-800 font-mono">
                    {currentUser.periode_mulai} - {currentUser.periode_selesai}
                  </span>
                  <button
                    onClick={onOpenEditPeriodModal}
                    className="p-1 hover:bg-orange-100 rounded text-[#e8732a] transition-colors"
                    title="Ubah Periode PKL & Profil"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <div className="flex justify-between items-start pt-1 border-t border-slate-50">
                <span className="text-slate-500">DPL (Kampus):</span>
                <span className="font-semibold text-slate-800 text-right truncate max-w-[170px]" title={currentUser.nama_dpl || currentUser.dpl_kampus}>
                  {currentUser.nama_dpl || currentUser.dpl_kampus || '-'}
                </span>
              </div>
              <div className="flex justify-between items-start">
                <span className="text-slate-500">PL (Diskominfo):</span>
                <span className="font-semibold text-[#e8732a] text-right truncate max-w-[170px]" title={currentUser.nama_pl || currentUser.nama_pembimbing}>
                  {currentUser.nama_pl || currentUser.nama_pembimbing || '-'}
                </span>
              </div>
            </div>

            {/* DPL Signature Verification Box */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-700 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Status Tanda Tangan DPL:</span>
                </span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-full">
                  {dplSignature.status_pengesahan === 'Telah Disahkan & Ditandatangani' ? 'Disahkan' : 'Menunggu'}
                </span>
              </div>

              {dplSignature.signature_data_url ? (
                <div className="bg-white p-2 rounded-lg border border-slate-200 text-center">
                  <img
                    src={dplSignature.signature_data_url}
                    alt="Tanda Tangan DPL"
                    className="h-12 mx-auto object-contain"
                  />
                  <div className="text-[10px] text-slate-500 mt-1 font-mono">
                    Ditandatangani oleh {dplSignature.nama_dpl}
                  </div>
                </div>
              ) : (
                <button
                  onClick={onOpenDplModal}
                  className="w-full py-1.5 bg-[#0f2d4a] hover:bg-[#1a3856] text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <PenTool className="w-3.5 h-3.5" />
                  <span>Bubuhkan Tanda Tangan DPL</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteCandidateId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200">
            <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mb-3">
              <Trash2 className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">
              Konfirmasi Hapus Kegiatan?
            </h3>
            <p className="text-xs text-slate-600 mt-1 mb-4 leading-relaxed">
              Logbook #{deleteCandidateId} akan dihapus secara permanen dari database.
              Sistem akan memverifikasi bahwa record ini memang milik <strong className="text-slate-900">user_id = {currentUser.id}</strong>.
            </p>
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setDeleteCandidateId(null)}
                className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-800 rounded-lg"
              >
                Batal
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-xs"
              >
                Hapus Sekarang
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
