import React, { useState, useEffect } from 'react';
import { User } from '../types/logbook';
import { dbEngine } from '../services/mysqlEngine';
import { X, Calendar, CheckCircle2, AlertCircle, Clock, UserCheck, School, Database, Sparkles } from 'lucide-react';

interface EditPeriodModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  onSaved: (updatedUser: User) => void;
}

export const EditPeriodModal: React.FC<EditPeriodModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSaved,
}) => {
  const [periodeMulai, setPeriodeMulai] = useState(currentUser.periode_mulai || '2024-10-26');
  const [periodeSelesai, setPeriodeSelesai] = useState(currentUser.periode_selesai || '2024-12-21');
  const [targetHari, setTargetHari] = useState<number>(currentUser.target_hari || 56);
  const [username, setUsername] = useState(currentUser.username);
  const [instansiPendidikan, setInstansiPendidikan] = useState(currentUser.instansi_pendidikan);
  const [namaDpl, setNamaDpl] = useState(currentUser.nama_dpl || currentUser.dpl_kampus || '');
  const [nipDpl, setNipDpl] = useState(currentUser.nip_dpl || '');
  const [namaPl, setNamaPl] = useState(currentUser.nama_pl || currentUser.nama_pembimbing || '');
  const [nipPl, setNipPl] = useState(currentUser.nip_pl || currentUser.nip_pembimbing || '');
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (isOpen) {
      setPeriodeMulai(currentUser.periode_mulai || '2024-10-26');
      setPeriodeSelesai(currentUser.periode_selesai || '2024-12-21');
      setTargetHari(currentUser.target_hari || 56);
      setUsername(currentUser.username);
      setInstansiPendidikan(currentUser.instansi_pendidikan);
      setNamaDpl(currentUser.nama_dpl || currentUser.dpl_kampus || '');
      setNipDpl(currentUser.nip_dpl || '');
      setNamaPl(currentUser.nama_pl || currentUser.nama_pembimbing || '');
      setNipPl(currentUser.nip_pl || currentUser.nip_pembimbing || '');
      setMsg(null);
    }
  }, [isOpen, currentUser]);

  if (!isOpen) return null;

  // Calculate day difference automatically when dates change
  const handleCalculateDays = (start: string, end: string) => {
    if (!start || !end) return;
    const s = new Date(start).getTime();
    const e = new Date(end).getTime();
    if (e >= s) {
      const diffDays = Math.round((e - s) / (1000 * 60 * 60 * 24)) + 1;
      setTargetHari(diffDays);
    }
  };

  const handleApplyPreset26Okt21Des = () => {
    setPeriodeMulai('2024-10-26');
    setPeriodeSelesai('2024-12-21');
    setTargetHari(56);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);

    const res = dbEngine.updateUserProfile(currentUser.id, {
      periode_mulai: periodeMulai,
      periode_selesai: periodeSelesai,
      target_hari: targetHari,
      username,
      instansi_pendidikan: instansiPendidikan,
      nama_dpl: namaDpl,
      nip_dpl: nipDpl,
      nama_pl: namaPl,
      nip_pl: nipPl,
      nama_pembimbing: namaPl,
      nip_pembimbing: nipPl,
    });

    if (res.success && res.user) {
      setMsg({ type: 'success', text: res.message });
      setTimeout(() => {
        onSaved(res.user!);
        onClose();
      }, 700);
    } else {
      setMsg({ type: 'error', text: res.message });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-lg w-full my-6 shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-[#0d2238] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#e8732a] text-white flex items-center justify-center font-bold">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold tracking-tight">
                Sistem Pengaturan Periode PKL & Profil
              </h3>
              <p className="text-xs text-blue-200">
                Ubah tanggal magang, durasi hari, dan data pembimbing
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

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {/* Quick Preset Banner */}
          <div className="p-3 bg-orange-50 border border-orange-200 rounded-xl flex items-center justify-between gap-3 text-orange-950">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#e8732a] shrink-0" />
              <span>
                Permintaan: <strong>26 Oktober s/d 21 Desember</strong>
              </span>
            </div>
            <button
              type="button"
              onClick={handleApplyPreset26Okt21Des}
              className="px-2.5 py-1 bg-[#e8732a] hover:bg-[#d4621b] text-white font-bold rounded-lg text-[11px] shrink-0 shadow-xs"
            >
              Terapkan Cepat
            </button>
          </div>

          {msg && (
            <div
              className={`p-3 rounded-lg flex items-center gap-2 ${
                msg.type === 'success'
                  ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                  : 'bg-rose-50 text-rose-900 border border-rose-200'
              }`}
            >
              {msg.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              )}
              <span>{msg.text}</span>
            </div>
          )}

          {/* Tanggal Mulai & Tanggal Selesai */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Tanggal Mulai PKL
              </label>
              <input
                type="date"
                value={periodeMulai}
                onChange={(e) => {
                  setPeriodeMulai(e.target.value);
                  handleCalculateDays(e.target.value, periodeSelesai);
                }}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-[#0d2238]"
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
                onChange={(e) => {
                  setPeriodeSelesai(e.target.value);
                  handleCalculateDays(periodeMulai, e.target.value);
                }}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-[#0d2238]"
                required
              />
            </div>
          </div>

          {/* Target Hari & Format Tampilan Preview */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                <span>Target Durasi (Hari)</span>
              </label>
              <input
                type="number"
                min="1"
                max="180"
                value={targetHari}
                onChange={(e) => setTargetHari(parseInt(e.target.value, 10) || 56)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-mono text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-[#0d2238]"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Pratinjau Label Periode
              </label>
              <div className="px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg font-mono font-semibold text-slate-800 truncate">
                {periodeMulai} - {periodeSelesai}
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100">
            <span className="font-bold text-slate-800 block mb-2">
              Informasi Biodata & Pembimbing
            </span>

            <div className="space-y-3">
              <div>
                <label className="block text-slate-600 mb-1">Nama Lengkap Peserta</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-600 mb-1">Asal Sekolah / Kampus & Jurusan</label>
                <input
                  type="text"
                  value={instansiPendidikan}
                  onChange={(e) => setInstansiPendidikan(e.target.value)}
                  placeholder="Contoh: SMK N 1 Selong — TKJ"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                  required
                />
              </div>

              {/* DPL (Kampus/Sekolah) */}
              <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-200 space-y-2">
                <span className="text-[11px] font-bold text-blue-900 block">
                  Dosen / Guru Pembimbing Lapangan (DPL Kampus/Sekolah)
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] text-slate-600 mb-0.5">Nama DPL</label>
                    <input
                      type="text"
                      value={namaDpl}
                      onChange={(e) => setNamaDpl(e.target.value)}
                      placeholder="Drs. Lalu Muhammad Zaini, M.Pd"
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-900 text-xs"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-600 mb-0.5">NIP / NIDN DPL</label>
                    <input
                      type="text"
                      value={nipDpl}
                      onChange={(e) => setNipDpl(e.target.value)}
                      placeholder="19750819 199903 1 004"
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg font-mono text-slate-900 text-xs"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* PL (Diskominfo) */}
              <div className="p-3 bg-orange-50/60 rounded-xl border border-orange-200 space-y-2">
                <span className="text-[11px] font-bold text-orange-900 block">
                  Pembimbing Lapangan (PL Diskominfo Lombok Timur)
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] text-slate-600 mb-0.5">Nama PL</label>
                    <input
                      type="text"
                      value={namaPl}
                      onChange={(e) => setNamaPl(e.target.value)}
                      placeholder="Ibu Siti, S.Kom"
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-900 text-xs"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-600 mb-0.5">NIP PL</label>
                    <input
                      type="text"
                      value={nipPl}
                      onChange={(e) => setNipPl(e.target.value)}
                      placeholder="19830412 200801 2 006"
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg font-mono text-slate-900 text-xs"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* SQL Preview of the UPDATE query */}
          <div className="p-2.5 bg-slate-900 rounded-xl text-slate-300 font-mono text-[11px]">
            <div className="text-slate-400 mb-0.5 flex items-center gap-1">
              <Database className="w-3 h-3 text-[#e8732a]" />
              <span>Query SQL UPDATE yang dijalankan:</span>
            </div>
            <code className="text-emerald-400">
              UPDATE users SET periode_mulai = &apos;{periodeMulai}&apos;, periode_selesai = &apos;{periodeSelesai}&apos;, target_hari = {targetHari} WHERE id = {currentUser.id};
            </code>
          </div>

          {/* Actions */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
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
              <span>Simpan Perubahan Periode</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
