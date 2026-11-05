import React, { useState } from 'react';
import { useAuthSession } from './hooks/useAuthSession';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { AdminDiskominfoView } from './components/AdminDiskominfoView';
import { ArchitectureInspector } from './components/ArchitectureInspector';
import { LoginModal } from './components/LoginModal';
import { LogbookFormModal } from './components/LogbookFormModal';
import { LogbookDetailModal } from './components/LogbookDetailModal';
import { PrintReportModal } from './components/PrintReportModal';
import { AbsensiModal } from './components/AbsensiModal';
import { DplSignatureModal } from './components/DplSignatureModal';
import { DokumentasiModal } from './components/DokumentasiModal';
import { EditPeriodModal } from './components/EditPeriodModal';
import { EditProfileModal } from './components/EditProfileModal';
import { LogbookItem } from './types/logbook';
import { dbEngine } from './services/mysqlEngine';
import {
  LayoutDashboard,
  BookOpen,
  Camera,
  CalendarCheck,
  PenTool,
  FileText,
  User as UserIcon,
  Database,
  LogOut,
  Menu,
  X,
  Plus,
  ArrowRight,
  ShieldCheck,
  GraduationCap,
  Lock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export function App() {
  const {
    currentUser,
    availableUsers,
    isLoading,
    loginOrRegister,
    loginUser,
    registerIntern,
    switchUser,
    logout,
  } = useAuthSession();

  const [activeNav, setActiveNav] = useState<'dashboard' | 'architecture' | 'laporan'>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Modals state
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState<LogbookItem | null>(null);
  const [detailItem, setDetailItem] = useState<LogbookItem | null>(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isAbsensiModalOpen, setIsAbsensiModalOpen] = useState(false);
  const [isDplModalOpen, setIsDplModalOpen] = useState(false);
  const [isDokumentasiModalOpen, setIsDokumentasiModalOpen] = useState(false);
  const [isEditPeriodModalOpen, setIsEditPeriodModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // State to refresh dashboard upon modal saves
  const [, setRefreshKey] = useState(0);
  const triggerRefresh = () => setRefreshKey((prev) => prev + 1);

  // Landing page tabs & form states
  const [landingTab, setLandingTab] = useState<'login' | 'register'>('login');
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [landingNotice, setLandingNotice] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Registration state
  const [regUsername, setRegUsername] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regNamaLengkap, setRegNamaLengkap] = useState('');
  const [regNomorHp, setRegNomorHp] = useState('');
  const [regSekolah, setRegSekolah] = useState('');
  const [regJurusan, setRegJurusan] = useState('');
  const [regDivisi, setRegDivisi] = useState('Bidang Aplikasi Informatika & e-Government');
  const [regNamaDpl, setRegNamaDpl] = useState('Drs. Lalu Muhammad Zaini, M.Pd');
  const [regNipDpl, setRegNipDpl] = useState('19750819 199903 1 004');
  const [regNamaPl, setRegNamaPl] = useState('Ibu Siti, S.Kom');
  const [regNipPl, setRegNipPl] = useState('19830412 200801 2 006');
  const [regPeriodeMulai, setRegPeriodeMulai] = useState('2024-10-26');
  const [regPeriodeSelesai, setRegPeriodeSelesai] = useState('2024-12-21');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0b2239] flex items-center justify-center text-white">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-orange-400 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-mono text-slate-300">Memuat Sistem Logbook PKL Digital...</p>
        </div>
      </div>
    );
  }

  const handleOpenEdit = (item: LogbookItem) => {
    setItemToEdit(item);
    setIsFormModalOpen(true);
  };

  const handleOpenNew = () => {
    setItemToEdit(null);
    setIsFormModalOpen(true);
  };

  const handleDeleteItem = (id: number) => {
    if (!currentUser) return;
    dbEngine.deleteLogbook(currentUser.id, id);
    setDetailItem(null);
    triggerRefresh();
  };

  const handleLandingLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLandingNotice(null);
    const res = loginUser(loginIdentifier, loginPassword);
    if (!res.success) {
      setLandingNotice({ type: 'error', message: res.message });
    }
  };

  const handleLandingRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLandingNotice(null);
    const res = registerIntern({
      username: regUsername,
      password: regPassword,
      nama_lengkap: regNamaLengkap,
      nomor_telepon: regNomorHp,
      instansi_pendidikan: regSekolah,
      jurusan: regJurusan,
      divisi_pkl: regDivisi,
      nama_dpl: regNamaDpl,
      nip_dpl: regNipDpl,
      nama_pl: regNamaPl,
      nip_pl: regNipPl,
      periode_mulai: regPeriodeMulai,
      periode_selesai: regPeriodeSelesai,
    });
    if (!res.success) {
      setLandingNotice({ type: 'error', message: res.message });
    }
  };

  return (
    <div className="min-h-screen bg-[#f0f4f8] text-slate-900 flex flex-col font-sans">
      {/* Top Navbar */}
      <Header
        currentUser={currentUser}
        availableUsers={availableUsers}
        onSwitchUser={switchUser}
        onOpenLoginModal={() => setIsLoginModalOpen(true)}
        onOpenEditProfile={() => setIsProfileModalOpen(true)}
        onLogout={logout}
      />

      {/* Main Container with Left Sidebar & Content */}
      <div className="flex-1 flex max-w-[1520px] w-full mx-auto">
        {currentUser && (
          <>
            {/* Sidebar Overlay for Mobile */}
            {sidebarOpen && (
              <div
                onClick={() => setSidebarOpen(false)}
                className="fixed inset-0 bg-black/50 z-30 lg:hidden"
              />
            )}

            {/* Left Dark Navy Sidebar matching user's reference image */}
            <aside
              className={`fixed lg:static top-16 bottom-0 left-0 z-30 w-56 bg-[#0b2239] text-slate-200 border-r border-slate-800 flex flex-col justify-between p-3.5 transition-transform duration-200 ease-in-out shrink-0 ${
                sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
              }`}
            >
              <div className="space-y-6">
                {/* Mobile close button / Hamburger Header */}
                <div className="flex items-center justify-between px-2 pt-1 text-slate-400">
                  <span className="text-[11px] font-bold tracking-wider uppercase text-slate-400">
                    Menu Utama
                  </span>
                  <button
                    onClick={() => setSidebarOpen(false)}
                    className="p-1 hover:text-white lg:hidden"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Navigation Items */}
                <nav className="space-y-1.5 text-xs font-medium">
                  {/* Dynamic Navigation according to Role */}
                  {currentUser.role === 'admin' ? (
                    <>
                      {/* Admin Navigation */}
                      <button
                        onClick={() => {
                          setActiveNav('dashboard');
                          setSidebarOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-semibold transition-all ${
                          activeNav === 'dashboard'
                            ? 'bg-[#e8732a] text-white shadow-sm'
                            : 'text-slate-300 hover:text-white hover:bg-white/10'
                        }`}
                      >
                        <ShieldCheck className="w-4 h-4 text-orange-200" />
                        <span>Monitoring Magang</span>
                      </button>

                      <button
                        onClick={() => {
                          setIsLoginModalOpen(true);
                          setSidebarOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
                      >
                        <Plus className="w-4 h-4 text-emerald-400" />
                        <span>Daftar Anak Magang</span>
                      </button>

                      <button
                        onClick={() => {
                          setIsProfileModalOpen(true);
                          setSidebarOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
                      >
                        <UserIcon className="w-4 h-4 text-orange-400" />
                        <span>Pengaturan & DPL/PL</span>
                      </button>

                      <button
                        onClick={() => {
                          setActiveNav('architecture');
                          setSidebarOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium transition-all ${
                          activeNav === 'architecture'
                            ? 'bg-[#0f2d4a] text-white border border-blue-400/40'
                            : 'text-slate-300 hover:text-white hover:bg-white/10'
                        }`}
                      >
                        <Database className="w-4 h-4 text-blue-400" />
                        <span>Database & SQL</span>
                      </button>

                      {/* Quick Intern View Switcher for Admin */}
                      <div className="pt-3 border-t border-slate-800/80">
                        <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold block mb-1.5 px-1">
                          Pratinjau Peserta Magang
                        </span>
                        {availableUsers
                          .filter((u) => u.role !== 'admin')
                          .slice(0, 3)
                          .map((intern) => (
                            <button
                              key={intern.id}
                              onClick={() => {
                                switchUser(intern.id);
                                setSidebarOpen(false);
                              }}
                              className="w-full text-left px-2.5 py-1.5 rounded-lg text-[11px] text-slate-300 hover:bg-white/10 hover:text-white flex items-center gap-2 truncate transition-colors"
                              title={`Masuk ke mode peserta ${intern.username}`}
                            >
                              <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                              <span className="truncate">{intern.username}</span>
                            </button>
                          ))}
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Peserta Magang Navigation */}
                      <button
                        onClick={() => {
                          setActiveNav('dashboard');
                          setSidebarOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-semibold transition-all ${
                          activeNav === 'dashboard'
                            ? 'bg-[#e8732a] text-white shadow-sm'
                            : 'text-slate-300 hover:text-white hover:bg-white/10'
                        }`}
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        <span>Dashboard</span>
                      </button>

                      <button
                        onClick={() => {
                          handleOpenNew();
                          setSidebarOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
                      >
                        <BookOpen className="w-4 h-4" />
                        <span>Logbook Harian</span>
                      </button>

                      <button
                        onClick={() => {
                          setIsDokumentasiModalOpen(true);
                          setSidebarOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
                      >
                        <Camera className="w-4 h-4" />
                        <span>Dokumentasi</span>
                      </button>

                      <button
                        onClick={() => {
                          setIsAbsensiModalOpen(true);
                          setSidebarOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
                      >
                        <CalendarCheck className="w-4 h-4 text-emerald-400" />
                        <span className="font-semibold text-emerald-300">Absensi PKL</span>
                      </button>

                      <button
                        onClick={() => {
                          setIsDplModalOpen(true);
                          setSidebarOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
                      >
                        <PenTool className="w-4 h-4 text-orange-300" />
                        <span className="font-semibold text-orange-300">Tanda Tangan DPL</span>
                      </button>

                      <button
                        onClick={() => {
                          setIsReportModalOpen(true);
                          setSidebarOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
                      >
                        <FileText className="w-4 h-4" />
                        <span>Laporan</span>
                      </button>

                      <button
                        onClick={() => {
                          setIsProfileModalOpen(true);
                          setSidebarOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
                      >
                        <UserIcon className="w-4 h-4 text-orange-400" />
                        <span>Profil, DPL & PL</span>
                      </button>

                      <button
                        onClick={() => {
                          setActiveNav('architecture');
                          setSidebarOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium transition-all ${
                          activeNav === 'architecture'
                            ? 'bg-[#0f2d4a] text-white border border-blue-400/40'
                            : 'text-slate-300 hover:text-white hover:bg-white/10'
                        }`}
                      >
                        <Database className="w-4 h-4 text-blue-400" />
                        <span>Database & SQL</span>
                      </button>

                      {/* Switch to Admin View */}
                      <div className="pt-3 border-t border-slate-800/80">
                        <button
                          onClick={() => {
                            const adminAcc = availableUsers.find((u) => u.role === 'admin');
                            if (adminAcc) switchUser(adminAcc.id);
                            setSidebarOpen(false);
                          }}
                          className="w-full py-2 px-2.5 rounded-xl bg-blue-900/60 hover:bg-blue-800 border border-blue-700/60 text-blue-200 hover:text-white text-[11px] font-bold flex items-center gap-2 transition-colors"
                        >
                          <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                          <span>Masuk Mode Admin</span>
                        </button>
                      </div>
                    </>
                  )}
                </nav>
              </div>

              {/* Bottom Keluar Button matching screenshot */}
              <div className="pt-4 border-t border-slate-800/80">
                <button
                  onClick={logout}
                  className="w-full py-2 px-3 rounded-xl border border-slate-700 hover:border-rose-500 hover:bg-rose-500/10 text-slate-300 hover:text-rose-400 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Keluar</span>
                </button>
              </div>
            </aside>
          </>
        )}

        {/* Content View Area */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8">
          {currentUser ? (
            <>
              {/* Mobile hamburger button */}
              <div className="lg:hidden mb-4 flex items-center justify-between bg-white p-3 rounded-xl border border-slate-200">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="flex items-center gap-2 text-xs font-bold text-slate-800"
                >
                  <Menu className="w-5 h-5 text-[#e8732a]" />
                  <span>Buka Menu Navigasi</span>
                </button>
                <div className="flex items-center gap-1.5">
                  {currentUser.role === 'admin' && (
                    <span className="text-[10px] bg-blue-700 text-white px-2 py-0.5 rounded font-bold">
                      Admin
                    </span>
                  )}
                  <span className="text-xs text-slate-500 font-mono">
                    {currentUser.username}
                  </span>
                </div>
              </div>

              {activeNav === 'dashboard' && (
                currentUser.role === 'admin' ? (
                  <AdminDiskominfoView
                    currentAdmin={currentUser}
                    onSelectUserToInspect={(id) => {
                      switchUser(id);
                      setActiveNav('dashboard');
                    }}
                    onOpenRegisterModal={() => setIsLoginModalOpen(true)}
                  />
                ) : (
                  <DashboardView
                    currentUser={currentUser}
                    onOpenNewLogModal={handleOpenNew}
                    onOpenEditLogModal={handleOpenEdit}
                    onOpenDetailModal={(item) => setDetailItem(item)}
                    onNavigateToArchitecture={() => setActiveNav('architecture')}
                    onNavigateToReport={() => setIsReportModalOpen(true)}
                    onOpenAbsensiModal={() => setIsAbsensiModalOpen(true)}
                    onOpenDplModal={() => setIsDplModalOpen(true)}
                    onOpenDokumentasiModal={() => setIsDokumentasiModalOpen(true)}
                    onOpenEditPeriodModal={() => setIsEditPeriodModalOpen(true)}
                    onOpenEditProfileModal={() => setIsProfileModalOpen(true)}
                  />
                )
              )}

              {activeNav === 'architecture' && (
                <ArchitectureInspector
                  currentUser={currentUser}
                  availableUsers={availableUsers}
                />
              )}
            </>
          ) : (
            /* Login & Register Landing Screen for Anak Magang & Admin */
            <div className="max-w-2xl mx-auto py-8 sm:py-12 space-y-6 font-quicksand">
              {/* Branding Header */}
              <div className="text-center space-y-3">
                <div className="w-16 h-16 mx-auto rounded-full bg-white p-1.5 border-2 border-orange-400 shadow-md overflow-hidden">
                  <img
                    src="/assets/aistudio/logo-kominfo_869d4e21.png"
                    alt="Logo Kominfo"
                    className="w-full h-full object-contain"
                  />
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                  Logbook Praktik kerja lapangan
                </h1>
                <p className="text-xs sm:text-sm font-semibold text-slate-600 max-w-lg mx-auto">
                  Dinas Komunikasi, Informatika dan Persandian (Diskominfo) Kabupaten Lombok Timur
                </p>
              </div>

              {/* Main Auth Card with Dual Tabs */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                {/* Tabs */}
                <div className="grid grid-cols-2 border-b border-slate-200 bg-slate-50 text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => {
                      setLandingTab('login');
                      setLandingNotice(null);
                    }}
                    className={`py-3.5 px-4 flex items-center justify-center gap-2 border-b-2 transition-all ${
                      landingTab === 'login'
                        ? 'border-[#e8732a] text-[#e8732a] bg-white'
                        : 'border-transparent text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <Lock className="w-4 h-4" />
                    <span>Masuk ke Sistem</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setLandingTab('register');
                      setLandingNotice(null);
                    }}
                    className={`py-3.5 px-4 flex items-center justify-center gap-2 border-b-2 transition-all ${
                      landingTab === 'register'
                        ? 'border-[#e8732a] text-[#e8732a] bg-white'
                        : 'border-transparent text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <GraduationCap className="w-4 h-4" />
                    <span>Pendaftaran Anak Magang Baru</span>
                  </button>
                </div>

                <div className="p-6 sm:p-8 space-y-5">
                  {landingNotice && (
                    <div
                      className={`p-3.5 rounded-xl border flex items-center gap-2.5 text-xs font-semibold ${
                        landingNotice.type === 'success'
                          ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
                          : 'bg-rose-50 text-rose-900 border-rose-200'
                      }`}
                    >
                      {landingNotice.type === 'success' ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                      )}
                      <span>{landingNotice.message}</span>
                    </div>
                  )}

                  {landingTab === 'login' ? (
                    /* Tab 1: Login Form */
                    <form onSubmit={handleLandingLoginSubmit} className="space-y-4 text-xs">
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">
                          Username atau Nomor HP/WhatsApp
                        </label>
                        <div className="relative">
                          <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                          <input
                            type="text"
                            value={loginIdentifier}
                            onChange={(e) => setLoginIdentifier(e.target.value)}
                            placeholder="Contoh: Rizky Pratama atau 081234567890"
                            className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0b2239]"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">
                          Kata Sandi (Password)
                        </label>
                        <div className="relative">
                          <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                          <input
                            type="password"
                            value={loginPassword}
                            onChange={(e) => setLoginPassword(e.target.value)}
                            placeholder="Kata sandi akun"
                            className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0b2239]"
                          />
                        </div>
                        <p className="text-[11px] text-slate-400 mt-1">
                          * Sandi akun demo: <code className="font-mono text-slate-600">magang123</code> (peserta) atau <code className="font-mono text-slate-600">admin</code> (admin).
                        </p>
                      </div>

                      <button
                        type="submit"
                        className="w-full py-2.5 bg-[#e8732a] hover:bg-[#d4621b] text-white rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-colors shadow-xs"
                      >
                        <span>Masuk ke Dashboard</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>

                      {/* Quick Select Demo Accounts */}
                      <div className="pt-4 border-t border-slate-100">
                        <span className="text-xs font-semibold text-slate-700 block mb-2">
                          Masuk Cepat Menggunakan Akun Referensi Diskominfo:
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {availableUsers.map((u) => (
                            <button
                              key={u.id}
                              type="button"
                              onClick={() => switchUser(u.id)}
                              className={`p-3 text-left border rounded-xl transition-all flex items-center gap-2.5 ${
                                u.role === 'admin'
                                  ? 'border-blue-300 bg-blue-50/70 hover:bg-blue-100'
                                  : 'border-slate-200 bg-slate-50/70 hover:border-orange-300 hover:bg-orange-50/50'
                              }`}
                            >
                              <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden shrink-0 border border-slate-300">
                                <img
                                  src={u.avatar_url || '/src/assets/images/avatar_pkl_male_1793886103683.jpg'}
                                  alt={u.username}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="font-bold text-xs text-slate-900 flex items-center justify-between">
                                  <span className="truncate">{u.username}</span>
                                  {u.role === 'admin' && (
                                    <span className="text-[9px] bg-blue-700 text-white px-1.5 py-0.2 rounded font-mono font-bold">
                                      Admin
                                    </span>
                                  )}
                                </div>
                                <div className="text-[11px] font-mono text-slate-500">{u.nomor_telepon}</div>
                                <div className="text-[10px] text-slate-600 font-medium truncate mt-0.5">
                                  {u.instansi_pendidikan.split('—')[0]}
                                </div>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    </form>
                  ) : (
                    /* Tab 2: Register Form for New Intern */
                    <form onSubmit={handleLandingRegisterSubmit} className="space-y-4 text-xs">
                      <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-blue-950 text-[11px] leading-relaxed">
                        <span className="font-bold block text-blue-900 mb-0.5">
                          Formulir Pendaftaran Anak Magang Diskominfo Lombok Timur
                        </span>
                        Daftarkan data diri, asal sekolah/kampus, serta pembimbing lapangan (DPL & PL) untuk mendapatkan akses ke dashboard logbook dan presensi.
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block font-semibold text-slate-700 mb-1">
                            Nama Lengkap Peserta *
                          </label>
                          <input
                            type="text"
                            value={regNamaLengkap}
                            onChange={(e) => setRegNamaLengkap(e.target.value)}
                            placeholder="Contoh: Muhammad Rizky Pratama"
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 text-xs"
                            required
                          />
                        </div>
                        <div>
                          <label className="block font-semibold text-slate-700 mb-1">
                            Username Login *
                          </label>
                          <input
                            type="text"
                            value={regUsername}
                            onChange={(e) => setRegUsername(e.target.value)}
                            placeholder="Contoh: rizky_pratama"
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-mono text-slate-900 text-xs"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block font-semibold text-slate-700 mb-1">
                            Nomor WhatsApp / HP *
                          </label>
                          <input
                            type="tel"
                            value={regNomorHp}
                            onChange={(e) => setRegNomorHp(e.target.value)}
                            placeholder="Contoh: 081234567890"
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-mono text-slate-900 text-xs"
                            required
                          />
                        </div>
                        <div>
                          <label className="block font-semibold text-slate-700 mb-1">
                            Kata Sandi (Password) *
                          </label>
                          <input
                            type="text"
                            value={regPassword}
                            onChange={(e) => setRegPassword(e.target.value)}
                            placeholder="Minimal 6 karakter"
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-mono text-slate-900 text-xs"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block font-semibold text-slate-700 mb-1">
                            Asal Sekolah / Universitas *
                          </label>
                          <input
                            type="text"
                            value={regSekolah}
                            onChange={(e) => setRegSekolah(e.target.value)}
                            placeholder="Contoh: SMK N 1 Selong / Universitas Hamzanwadi"
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 text-xs"
                            required
                          />
                        </div>
                        <div>
                          <label className="block font-semibold text-slate-700 mb-1">
                            Jurusan / Program Studi
                          </label>
                          <input
                            type="text"
                            value={regJurusan}
                            onChange={(e) => setRegJurusan(e.target.value)}
                            placeholder="Contoh: Teknik Komputer dan Jaringan (TKJ)"
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 text-xs"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">
                          Penempatan Divisi di Diskominfo Lombok Timur *
                        </label>
                        <select
                          value={regDivisi}
                          onChange={(e) => setRegDivisi(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 text-xs"
                        >
                          <option value="Bidang Aplikasi Informatika & e-Government">Bidang Aplikasi Informatika & e-Government</option>
                          <option value="Bidang Informasi & Komunikasi Publik (IKP)">Bidang Informasi & Komunikasi Publik (IKP)</option>
                          <option value="Bidang Persandian & Keamanan Siber">Bidang Persandian & Keamanan Siber</option>
                          <option value="Bidang Statistik Sektoral">Bidang Statistik Sektoral</option>
                          <option value="Sekretariat & Tata Usaha Diskominfo">Sekretariat & Tata Usaha Diskominfo</option>
                        </select>
                      </div>

                      {/* Mentors DPL & PL */}
                      <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                        <span className="font-bold text-slate-800 block text-[11px]">
                          Pembimbing Lapangan (DPL & PL):
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[10px] text-slate-600 mb-0.5">Nama DPL (Kampus/Sekolah)</label>
                            <input
                              type="text"
                              value={regNamaDpl}
                              onChange={(e) => setRegNamaDpl(e.target.value)}
                              className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-md text-xs text-slate-900"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] text-slate-600 mb-0.5">Nama PL (Diskominfo Lotim)</label>
                            <input
                              type="text"
                              value={regNamaPl}
                              onChange={(e) => setRegNamaPl(e.target.value)}
                              className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-md text-xs text-slate-900"
                              required
                            />
                          </div>
                        </div>
                      </div>

                      {/* Periode */}
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block font-semibold text-slate-700 mb-1">
                            Periode Mulai
                          </label>
                          <input
                            type="date"
                            value={regPeriodeMulai}
                            onChange={(e) => setRegPeriodeMulai(e.target.value)}
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-mono text-slate-900 text-xs"
                            required
                          />
                        </div>
                        <div>
                          <label className="block font-semibold text-slate-700 mb-1">
                            Periode Selesai
                          </label>
                          <input
                            type="date"
                            value={regPeriodeSelesai}
                            onChange={(e) => setRegPeriodeSelesai(e.target.value)}
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-mono text-slate-900 text-xs"
                            required
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="w-full py-2.5 bg-[#e8732a] hover:bg-[#d4621b] text-white rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-colors shadow-xs"
                      >
                        <span>Daftarkan Akun Magang & Masuk</span>
                        <CheckCircle2 className="w-4 h-4" />
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Global Modals */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSuccessLogin={(u) => {
          switchUser(u.id);
          triggerRefresh();
        }}
        availableUsers={availableUsers}
      />

      {currentUser && (
        <>
          <LogbookFormModal
            isOpen={isFormModalOpen}
            onClose={() => setIsFormModalOpen(false)}
            currentUser={currentUser}
            itemToEdit={itemToEdit}
            onSaved={() => {
              setIsFormModalOpen(false);
              setItemToEdit(null);
              triggerRefresh();
            }}
          />

          <LogbookDetailModal
            isOpen={detailItem !== null}
            onClose={() => setDetailItem(null)}
            logbook={detailItem}
            currentUser={currentUser}
            onEdit={handleOpenEdit}
            onDelete={handleDeleteItem}
          />

          <AbsensiModal
            isOpen={isAbsensiModalOpen}
            onClose={() => setIsAbsensiModalOpen(false)}
            currentUser={currentUser}
            onSaved={triggerRefresh}
          />

          <DplSignatureModal
            isOpen={isDplModalOpen}
            onClose={() => setIsDplModalOpen(false)}
            currentUser={currentUser}
            onSaved={triggerRefresh}
          />

          <DokumentasiModal
            isOpen={isDokumentasiModalOpen}
            onClose={() => setIsDokumentasiModalOpen(false)}
            currentUser={currentUser}
            onSaved={triggerRefresh}
          />

          <EditPeriodModal
            isOpen={isEditPeriodModalOpen}
            onClose={() => setIsEditPeriodModalOpen(false)}
            currentUser={currentUser}
            onSaved={(updatedUser) => {
              switchUser(updatedUser.id);
              triggerRefresh();
            }}
          />

          <EditProfileModal
            isOpen={isProfileModalOpen}
            onClose={() => setIsProfileModalOpen(false)}
            currentUser={currentUser}
            onSaved={(updatedUser) => {
              switchUser(updatedUser.id);
              triggerRefresh();
            }}
          />

          <PrintReportModal
            isOpen={isReportModalOpen}
            onClose={() => setIsReportModalOpen(false)}
            currentUser={currentUser}
            logbooks={dbEngine.loadDashboard(currentUser.id).daftarLogbook}
          />
        </>
      )}

      {/* Footer matching reference image */}
      <footer className="no-print bg-white border-t border-slate-200 py-4 text-center text-xs text-slate-500">
        © 2024 Dinas Kominfo Lombok Timur | Logbook PKL Digital v2.1
      </footer>
    </div>
  );
}

export default App;
