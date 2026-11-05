import React, { useState, useEffect, useRef } from 'react';
import { User } from '../types/logbook';
import { dbEngine } from '../services/mysqlEngine';
import {
  X,
  Camera,
  Upload,
  User as UserIcon,
  Phone,
  Building2,
  GraduationCap,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Database,
  Image as ImageIcon,
  Sparkles,
  RefreshCw
} from 'lucide-react';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  onSaved: (updatedUser: User) => void;
}

const PRESET_AVATARS = [
  { label: 'Jas Almamater Pria', url: '/src/assets/images/avatar_pkl_male_1793886103683.jpg' },
  { label: 'Hijab Almamater Wanita', url: '/src/assets/images/avatar_pkl_female_1793886103792.jpg' },
  { label: 'Gedung Kominfo', url: '/src/assets/images/kominfo_hero_banner_1793886104325.jpg' },
];

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSaved,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [activeTab, setActiveTab] = useState<'avatar' | 'period'>('avatar');
  const [avatarUrl, setAvatarUrl] = useState<string>(currentUser.avatar_url || '');
  const [username, setUsername] = useState(currentUser.username);
  const [namaLengkap, setNamaLengkap] = useState(currentUser.nama_lengkap || currentUser.username);
  const [password, setPassword] = useState(currentUser.password || 'magang123');
  const [nomorTelepon, setNomorTelepon] = useState(currentUser.nomor_telepon);
  const [instansiPendidikan, setInstansiPendidikan] = useState(currentUser.instansi_pendidikan);
  const [jurusan, setJurusan] = useState(currentUser.jurusan || '');
  const [divisiPkl, setDivisiPkl] = useState(currentUser.divisi_pkl);
  const [kabupaten, setKabupaten] = useState(currentUser.kabupaten || 'Kabupaten Lombok Timur');
  
  // DPL (Kampus/Sekolah)
  const [namaDpl, setNamaDpl] = useState(currentUser.nama_dpl || currentUser.dpl_kampus || '');
  const [nipDpl, setNipDpl] = useState(currentUser.nip_dpl || '');
  const [kontakDpl, setKontakDpl] = useState(currentUser.kontak_dpl || '');
  
  // PL (Diskominfo)
  const [namaPl, setNamaPl] = useState(currentUser.nama_pl || currentUser.nama_pembimbing || '');
  const [nipPl, setNipPl] = useState(currentUser.nip_pl || currentUser.nip_pembimbing || '');
  const [jabatanPl, setJabatanPl] = useState(currentUser.jabatan_pl || 'Pranata Komputer Ahli Muda');
  
  const [periodeMulai, setPeriodeMulai] = useState(currentUser.periode_mulai || '2024-10-26');
  const [periodeSelesai, setPeriodeSelesai] = useState(currentUser.periode_selesai || '2024-12-21');
  const [targetHari, setTargetHari] = useState<number>(currentUser.target_hari || 56);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    if (isOpen) {
      setAvatarUrl(currentUser.avatar_url || '');
      setUsername(currentUser.username);
      setNamaLengkap(currentUser.nama_lengkap || currentUser.username);
      setPassword(currentUser.password || 'magang123');
      setNomorTelepon(currentUser.nomor_telepon);
      setInstansiPendidikan(currentUser.instansi_pendidikan);
      setJurusan(currentUser.jurusan || '');
      setDivisiPkl(currentUser.divisi_pkl);
      setKabupaten(currentUser.kabupaten || 'Kabupaten Lombok Timur');
      setNamaDpl(currentUser.nama_dpl || currentUser.dpl_kampus || '');
      setNipDpl(currentUser.nip_dpl || '');
      setKontakDpl(currentUser.kontak_dpl || '');
      setNamaPl(currentUser.nama_pl || currentUser.nama_pembimbing || '');
      setNipPl(currentUser.nip_pl || currentUser.nip_pembimbing || '');
      setJabatanPl(currentUser.jabatan_pl || 'Pranata Komputer Ahli Muda');
      setPeriodeMulai(currentUser.periode_mulai || '2024-10-26');
      setPeriodeSelesai(currentUser.periode_selesai || '2024-12-21');
      setTargetHari(currentUser.target_hari || 56);
      setFeedback(null);
    }
  }, [isOpen, currentUser]);

  if (!isOpen) return null;

  // Handle local file upload (converts to base64 data url for persistent client storage)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setFeedback({ type: 'error', message: 'Ukuran file maksimal 5MB.' });
        return;
      }
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const result = uploadEvent.target?.result as string;
        if (result) {
          setAvatarUrl(result);
          setFeedback({ type: 'success', message: 'Foto berhasil dimuat. Klik Simpan untuk menerapkan.' });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleApplyPreset26Okt21Des = () => {
    setPeriodeMulai('2024-10-26');
    setPeriodeSelesai('2024-12-21');
    setTargetHari(56);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    const res = dbEngine.updateUserProfile(currentUser.id, {
      username,
      nama_lengkap: namaLengkap,
      password,
      nomor_telepon: nomorTelepon,
      avatar_url: avatarUrl,
      instansi_pendidikan: instansiPendidikan,
      jurusan,
      divisi_pkl: divisiPkl,
      kabupaten,
      nama_dpl: namaDpl,
      nip_dpl: nipDpl,
      kontak_dpl: kontakDpl,
      nama_pl: namaPl,
      nip_pl: nipPl,
      jabatan_pl: jabatanPl,
      nama_pembimbing: namaPl,
      nip_pembimbing: nipPl,
      periode_mulai: periodeMulai,
      periode_selesai: periodeSelesai,
      target_hari: targetHari,
    });

    if (res.success && res.user) {
      setFeedback({ type: 'success', message: res.message });
      setTimeout(() => {
        onSaved(res.user!);
        onClose();
      }, 700);
    } else {
      setFeedback({ type: 'error', message: res.message });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-xl w-full my-6 shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-[#0d2238] text-white flex items-center justify-between shrink-0 font-quicksand">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#e8732a] text-white flex items-center justify-center font-bold">
              <UserIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold tracking-tight">
                Pengaturan Akun & Pembimbing (DPL & PL)
              </h3>
              <p className="text-xs text-blue-200">
                Ubah profil anak magang, kata sandi, nama DPL & PL Diskominfo
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
        <div className="flex items-center border-b border-slate-200 px-6 pt-2 bg-slate-50 shrink-0 font-quicksand">
          <button
            type="button"
            onClick={() => setActiveTab('avatar')}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'avatar'
                ? 'border-[#e8732a] text-[#e8732a]'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Foto & Identitas Anak Magang
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('period')}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'period'
                ? 'border-[#e8732a] text-[#e8732a]'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Pembimbing (DPL & PL) & Periode PKL
          </button>
        </div>

        {/* Content Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs flex-1">
          {feedback && (
            <div
              className={`p-3 rounded-xl border flex items-center gap-2 ${
                feedback.type === 'success'
                  ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
                  : 'bg-rose-50 text-rose-900 border-rose-200'
              }`}
            >
              {feedback.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              )}
              <span>{feedback.message}</span>
            </div>
          )}

          {activeTab === 'avatar' && (
            <>
              {/* Photo Upload Section */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col sm:flex-row items-center gap-4">
                <div className="relative group shrink-0">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden bg-white border-2 border-[#e8732a] shadow-sm">
                    {avatarUrl ? (
                      <img
                        src={avatarUrl}
                        alt="Avatar Preview"
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-bold text-xl text-slate-400 bg-slate-100">
                        {username.charAt(0)}
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-[#0d2238] hover:bg-[#e8732a] text-white flex items-center justify-center shadow-md transition-colors"
                    title="Ganti Foto"
                  >
                    <Camera className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-1.5 flex-1 text-center sm:text-left">
                  <span className="font-bold text-slate-800 text-sm block">Foto Profil Peserta</span>
                  <p className="text-slate-500 text-[11px] leading-relaxed">
                    Unggah foto formal Anda (JPG/PNG maks. 5MB) atau pilih salah satu avatar resmi di bawah ini.
                  </p>

                  <div className="flex flex-wrap items-center gap-2 pt-1 justify-center sm:justify-start">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3 py-1.5 bg-[#0d2238] hover:bg-[#1f3a55] text-white rounded-lg font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Unggah Foto dari HP/Laptop</span>
                    </button>
                    {avatarUrl && (
                      <button
                        type="button"
                        onClick={() => setAvatarUrl('')}
                        className="px-2.5 py-1.5 text-slate-500 hover:text-rose-600 transition-colors"
                      >
                        Reset Inisial
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Preset Avatars Selection */}
              <div>
                <span className="font-semibold text-slate-700 block mb-2">
                  Atau Pilih Avatar Bawaan:
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {PRESET_AVATARS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setAvatarUrl(preset.url)}
                      className={`p-2 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                        avatarUrl === preset.url
                          ? 'border-[#e8732a] bg-orange-50/50 shadow-xs ring-1 ring-[#e8732a]'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-200">
                        <img
                          src={preset.url}
                          alt={preset.label}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <span className="text-[10px] text-slate-700 font-medium truncate max-w-full">
                        {preset.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Personal Info Form */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <span className="font-bold text-slate-900 block">Identitas Pribadi</span>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      Nama Lengkap Anak Magang
                    </label>
                    <input
                      type="text"
                      value={namaLengkap}
                      onChange={(e) => setNamaLengkap(e.target.value)}
                      placeholder="Contoh: Muhammad Rizky Pratama"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0d2238]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      Username Login
                    </label>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0d2238]"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      Nomor HP / WhatsApp
                    </label>
                    <input
                      type="tel"
                      value={nomorTelepon}
                      onChange={(e) => setNomorTelepon(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0d2238]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      Kata Sandi (Password) Akun
                    </label>
                    <input
                      type="text"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Kata sandi login"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0d2238]"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      Asal Sekolah / Universitas
                    </label>
                    <input
                      type="text"
                      value={instansiPendidikan}
                      onChange={(e) => setInstansiPendidikan(e.target.value)}
                      placeholder="Contoh: SMK N 1 Selong"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      Jurusan / Program Studi
                    </label>
                    <input
                      type="text"
                      value={jurusan}
                      onChange={(e) => setJurusan(e.target.value)}
                      placeholder="Contoh: Teknik Informatika / TKJ"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      Penempatan Divisi Diskominfo
                    </label>
                    <select
                      value={divisiPkl}
                      onChange={(e) => setDivisiPkl(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 text-xs"
                      required
                    >
                      <option value="Bidang Aplikasi Informatika & e-Government">Bidang Aplikasi Informatika & e-Gov</option>
                      <option value="Bidang Informasi & Komunikasi Publik (IKP)">Bidang Informasi & Komunikasi Publik (IKP)</option>
                      <option value="Bidang Persandian & Keamanan Siber">Bidang Persandian & Keamanan Siber</option>
                      <option value="Bidang Statistik Sektoral">Bidang Statistik Sektoral</option>
                      <option value="Sekretariat & Tata Usaha Diskominfo">Sekretariat & Tata Usaha Diskominfo</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      Kabupaten / Wilayah
                    </label>
                    <input
                      type="text"
                      value={kabupaten}
                      onChange={(e) => setKabupaten(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                      required
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'period' && (
            <div className="space-y-4">
              {/* Bagian 1: DPL (Kampus / Sekolah) */}
              <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-md bg-blue-700 text-white font-bold flex items-center justify-center text-[11px]">
                      DPL
                    </span>
                    <div>
                      <h4 className="font-bold text-slate-900 text-xs">
                        Dosen / Guru Pembimbing Lapangan (DPL)
                      </h4>
                      <p className="text-[10px] text-slate-500">
                        Pembimbing resmi dari pihak Sekolah / Kampus asal peserta
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      Nama Lengkap & Gelar DPL
                    </label>
                    <input
                      type="text"
                      value={namaDpl}
                      onChange={(e) => setNamaDpl(e.target.value)}
                      placeholder="Contoh: Drs. Lalu Muhammad Zaini, M.Pd"
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      NIP / NIDN DPL
                    </label>
                    <input
                      type="text"
                      value={nipDpl}
                      onChange={(e) => setNipDpl(e.target.value)}
                      placeholder="Contoh: 19750819 199903 1 004"
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg font-mono text-slate-900"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    No. Kontak / WhatsApp DPL (Opsional)
                  </label>
                  <input
                    type="tel"
                    value={kontakDpl}
                    onChange={(e) => setKontakDpl(e.target.value)}
                    placeholder="Contoh: 081987654321"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg font-mono text-slate-900"
                  />
                </div>
              </div>

              {/* Bagian 2: PL (Diskominfo Lombok Timur) */}
              <div className="p-3.5 bg-orange-50/70 border border-orange-200 rounded-xl space-y-3">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-md bg-[#e8732a] text-white font-bold flex items-center justify-center text-[11px]">
                    PL
                  </span>
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs">
                      Pembimbing Lapangan (PL) Diskominfo
                    </h4>
                    <p className="text-[10px] text-slate-500">
                      Pejabat / Staf Pembimbing dari Dinas Kominfo Lombok Timur
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      Nama Lengkap & Gelar PL
                    </label>
                    <input
                      type="text"
                      value={namaPl}
                      onChange={(e) => setNamaPl(e.target.value)}
                      placeholder="Contoh: Ibu Siti, S.Kom"
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      NIP Pembimbing Lapangan
                    </label>
                    <input
                      type="text"
                      value={nipPl}
                      onChange={(e) => setNipPl(e.target.value)}
                      placeholder="Contoh: 19830412 200801 2 006"
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg font-mono text-slate-900"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Jabatan / Penugasan di Diskominfo
                  </label>
                  <input
                    type="text"
                    value={jabatanPl}
                    onChange={(e) => setJabatanPl(e.target.value)}
                    placeholder="Contoh: Pranata Komputer Ahli Muda / Sub Koordinator"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900"
                  />
                </div>
              </div>

              {/* Bagian 3: Periode PKL */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#e8732a] shrink-0" />
                    <span className="font-bold text-slate-900">
                      Periode Resmi: 26 Oktober s/d 21 Desember
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleApplyPreset26Okt21Des}
                    className="px-2.5 py-1 bg-[#e8732a] hover:bg-[#d4621b] text-white font-bold rounded-lg text-[11px] shrink-0 shadow-xs"
                  >
                    Terapkan Periode Ini
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Tanggal Mulai PKL
                    </label>
                    <input
                      type="date"
                      value={periodeMulai}
                      onChange={(e) => setPeriodeMulai(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 font-mono"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Tanggal Selesai PKL
                    </label>
                    <input
                      type="date"
                      value={periodeSelesai}
                      onChange={(e) => setPeriodeSelesai(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 font-mono"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Target Total Hari PKL
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="180"
                      value={targetHari}
                      onChange={(e) => setTargetHari(parseInt(e.target.value, 10) || 56)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg font-mono text-slate-900 font-bold"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Ringkasan Durasi
                    </label>
                    <div className="px-3 py-2 bg-white border border-slate-200 rounded-lg font-mono text-slate-800 font-semibold truncate">
                      {periodeMulai} s/d {periodeSelesai} ({targetHari} Hari)
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SQL Telemetry */}
          <div className="p-2.5 bg-slate-900 rounded-xl text-slate-300 font-mono text-[11px]">
            <div className="text-slate-400 mb-0.5 flex items-center gap-1">
              <Database className="w-3 h-3 text-[#e8732a]" />
              <span>Query SQL UPDATE Basis Data:</span>
            </div>
            <code className="text-emerald-400 truncate block">
              UPDATE users SET username = &apos;{username}&apos;, avatar_url = [URI], instansi_pendidikan = &apos;{instansiPendidikan}&apos; WHERE id = {currentUser.id};
            </code>
          </div>

          {/* Action buttons */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 font-bold text-white bg-[#e8732a] hover:bg-[#d4621b] rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Simpan Perubahan Profil</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
