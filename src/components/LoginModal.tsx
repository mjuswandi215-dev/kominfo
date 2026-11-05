import React, { useState } from 'react';
import { User } from '../types/logbook';
import {
  Shield,
  Smartphone,
  User as UserIcon,
  CheckCircle2,
  ArrowRight,
  X,
  AlertCircle,
  Lock,
  Building2,
  GraduationCap,
  Calendar,
  Sparkles,
  UserCheck
} from 'lucide-react';
import { dbEngine } from '../services/mysqlEngine';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessLogin: (user: User) => void;
  availableUsers: User[];
  initialMode?: 'login' | 'register';
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onSuccessLogin,
  availableUsers,
  initialMode = 'login',
}) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>(initialMode);

  // Login form state
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form state
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

  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);

    const res = dbEngine.loginUser(loginIdentifier, loginPassword);
    if (res.success && res.user) {
      setStatusMessage({ type: 'success', text: res.message });
      setTimeout(() => {
        onSuccessLogin(res.user!);
        onClose();
        setStatusMessage(null);
      }, 700);
    } else {
      setStatusMessage({ type: 'error', text: res.message });
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);

    const res = dbEngine.registerIntern({
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

    if (res.success && res.user) {
      setStatusMessage({ type: 'success', text: res.message });
      setTimeout(() => {
        onSuccessLogin(res.user!);
        onClose();
        setStatusMessage(null);
      }, 800);
    } else {
      setStatusMessage({ type: 'error', text: res.message });
    }
  };

  const handleQuickLogin = (u: User) => {
    onSuccessLogin(u);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto font-quicksand">
      <div className="bg-white rounded-2xl max-w-lg w-full my-6 overflow-hidden shadow-2xl border border-slate-200 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-[#0b2239] text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white p-1 border-2 border-orange-400 flex items-center justify-center shrink-0">
              <img
                src="/assets/aistudio/logo-kominfo_869d4e21.png"
                alt="Logo Kominfo"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h3 className="text-sm font-bold tracking-tight">
                Portal Akses Logbook PKL
              </h3>
              <p className="text-xs text-blue-200">
                Diskominfo Kabupaten Lombok Timur
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-300 hover:text-white transition-colors p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center border-b border-slate-200 px-6 pt-2 bg-slate-50 shrink-0">
          <button
            type="button"
            onClick={() => {
              setActiveTab('login');
              setStatusMessage(null);
            }}
            className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'login'
                ? 'border-[#e8732a] text-[#e8732a]'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Masuk (Login)</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('register');
              setStatusMessage(null);
            }}
            className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'register'
                ? 'border-[#e8732a] text-[#e8732a]'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Pendaftaran Anak Magang Baru</span>
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-4 text-xs flex-1">
          {statusMessage && (
            <div
              className={`p-3 rounded-xl border flex items-center gap-2 ${
                statusMessage.type === 'success'
                  ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
                  : 'bg-rose-50 text-rose-900 border-rose-200'
              }`}
            >
              {statusMessage.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              )}
              <span className="font-semibold">{statusMessage.text}</span>
            </div>
          )}

          {activeTab === 'login' ? (
            /* Form Login */
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Username atau Nomor HP/WhatsApp
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    placeholder="Contoh: Rizky Pratama atau 081234567890"
                    className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0b2239]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Kata Sandi (Password)
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Masukkan kata sandi (default: magang123)"
                    className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0b2239]"
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-1">
                  * Untuk akun demo, kata sandi adalah <code className="font-mono text-slate-600">magang123</code> (peserta) atau <code className="font-mono text-slate-600">admin</code> (admin).
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
              <div className="pt-4 border-t border-slate-100 space-y-2">
                <span className="font-bold text-slate-700 block">
                  Pilih Cepat Akun Demo Tersedia:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {availableUsers.map((u) => (
                    <button
                      key={u.id}
                      type="button"
                      onClick={() => handleQuickLogin(u)}
                      className={`text-left p-2.5 rounded-xl border transition-all flex items-center gap-2.5 ${
                        u.role === 'admin'
                          ? 'border-blue-300 bg-blue-50/70 hover:bg-blue-100/70'
                          : 'border-slate-200 bg-slate-50 hover:bg-orange-50 hover:border-orange-200'
                      }`}
                    >
                      <div className="w-7 h-7 rounded-full bg-slate-200 overflow-hidden shrink-0 border border-slate-300">
                        <img
                          src={u.avatar_url || '/src/assets/images/avatar_pkl_male_1793886103683.jpg'}
                          alt={u.username}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-bold text-slate-900 truncate text-[11px] flex items-center justify-between">
                          <span>{u.username}</span>
                          {u.role === 'admin' && (
                            <span className="text-[9px] bg-blue-700 text-white px-1.5 py-0.2 rounded font-mono">
                              Admin
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-500 truncate">
                          {u.instansi_pendidikan.split('—')[0]}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </form>
          ) : (
            /* Form Registrasi Anak Magang */
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              <div className="p-3 bg-orange-50 border border-orange-200 rounded-xl text-orange-950 text-[11px] leading-relaxed">
                <span className="font-bold block text-orange-900 mb-0.5">
                  Ketentuan Magang Diskominfo Lombok Timur:
                </span>
                Setiap mahasiswa / siswa magang wajib mengisi data lengkap, asal sekolah/kampus, serta nama pembimbing kampus (DPL) dan pembimbing Diskominfo (PL).
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Nama Lengkap Peserta *
                  </label>
                  <input
                    type="text"
                    value={regNamaLengkap}
                    onChange={(e) => setRegNamaLengkap(e.target.value)}
                    placeholder="Contoh: Muhammad Rizky Pratama"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
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
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-mono text-slate-900"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Nomor WhatsApp / HP *
                  </label>
                  <input
                    type="tel"
                    value={regNomorHp}
                    onChange={(e) => setRegNomorHp(e.target.value)}
                    placeholder="Contoh: 081234567890"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-mono text-slate-900"
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
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-mono text-slate-900"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Asal Sekolah / Universitas *
                  </label>
                  <input
                    type="text"
                    value={regSekolah}
                    onChange={(e) => setRegSekolah(e.target.value)}
                    placeholder="Contoh: SMK N 1 Selong / Univ. Hamzanwadi"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
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
                    placeholder="Contoh: Teknik Komputer Jaringan (TKJ)"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
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
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] text-slate-600 mb-0.5">Nama DPL (Kampus/Sekolah)</label>
                    <input
                      type="text"
                      value={regNamaDpl}
                      onChange={(e) => setRegNamaDpl(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-md text-xs"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-600 mb-0.5">Nama PL (Diskominfo Lotim)</label>
                    <input
                      type="text"
                      value={regNamaPl}
                      onChange={(e) => setRegNamaPl(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-md text-xs"
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
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-mono text-slate-900"
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
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-mono text-slate-900"
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
  );
};
