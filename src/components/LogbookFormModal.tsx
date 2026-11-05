import React, { useState, useEffect } from 'react';
import { User, LogbookItem, KategoriKegiatan } from '../types/logbook';
import { dbEngine } from '../services/mysqlEngine';
import { X, Calendar, Clock, Tag, FileText, CheckCircle2, AlertCircle, Database } from 'lucide-react';

interface LogbookFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  itemToEdit?: LogbookItem | null;
  onSaved: () => void;
}

const KATEGORI_OPTIONS: KategoriKegiatan[] = [
  'Desain',
  'Administrasi',
  'Jaringan',
  'Sosialisasi',
  'Pengembangan Software',
  'Infrastruktur & Server',
  'Dokumentasi & Humas',
];

export const LogbookFormModal: React.FC<LogbookFormModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  itemToEdit,
  onSaved,
}) => {
  const isEditing = !!itemToEdit;

  const [tanggal, setTanggal] = useState('');
  const [namaKegiatan, setNamaKegiatan] = useState('');
  const [deskripsiKegiatan, setDeskripsiKegiatan] = useState('');
  const [durasiJam, setDurasiJam] = useState<number>(8);
  const [kategori, setKategori] = useState<KategoriKegiatan>('Desain');
  const [lokasi, setLokasi] = useState('Dinas Kominfo Lombok Timur');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (itemToEdit) {
      setTanggal(itemToEdit.tanggal);
      setNamaKegiatan(itemToEdit.nama_kegiatan);
      setDeskripsiKegiatan(itemToEdit.deskripsi_kegiatan);
      setDurasiJam(itemToEdit.durasi_jam || 8);
      setKategori(itemToEdit.kategori);
      setLokasi(itemToEdit.lokasi || '');
    } else {
      const today = new Date().toISOString().split('T')[0];
      setTanggal(today);
      setNamaKegiatan('');
      setDeskripsiKegiatan('');
      setDurasiJam(8);
      setKategori('Pengembangan Software');
      setLokasi('Kementerian Komunikasi dan Digital RI');
    }
    setErrorMessage('');
  }, [itemToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (isEditing && itemToEdit) {
      const res = dbEngine.updateLogbook(currentUser.id, itemToEdit.id, {
        tanggal,
        nama_kegiatan: namaKegiatan,
        deskripsi_kegiatan: deskripsiKegiatan,
        durasi_jam: durasiJam,
        kategori,
        lokasi,
      });

      if (res.success) {
        onSaved();
        onClose();
      } else {
        setErrorMessage(res.message);
      }
    } else {
      const res = dbEngine.addLogbook(currentUser.id, {
        tanggal,
        nama_kegiatan: namaKegiatan,
        deskripsi_kegiatan: deskripsiKegiatan,
        durasi_jam: durasiJam,
        kategori,
        lokasi,
      });

      if (res.success) {
        onSaved();
        onClose();
      } else {
        setErrorMessage(res.message);
      }
    }
  };

  const previewSqlQuery = isEditing && itemToEdit
    ? `UPDATE logbooks SET\n  tanggal = '${tanggal}',\n  nama_kegiatan = '${namaKegiatan.replace(/'/g, "''")}',\n  deskripsi_kegiatan = '...',\n  durasi_jam = ${durasiJam}\nWHERE id = ${itemToEdit.id} AND user_id = ${currentUser.id};`
    : `INSERT INTO logbooks (user_id, tanggal, nama_kegiatan, deskripsi_kegiatan, durasi_jam, kategori)\nVALUES (${currentUser.id}, '${tanggal}', '${namaKegiatan.replace(/'/g, "''")}', '...', ${durasiJam}, '${kategori}');`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full my-8 shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-800 text-blue-100 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold tracking-tight">
                {isEditing ? 'Ubah Data Logbook Kegiatan' : 'Catat Kegiatan PKL Baru'}
              </h3>
              <p className="text-xs text-slate-300">
                Peserta: {currentUser.username} (ID: {currentUser.id}) · {currentUser.divisi_pkl}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMessage && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                <span>Tanggal Pelaksanaan</span>
              </label>
              <input
                type="date"
                value={tanggal}
                onChange={(e) => setTanggal(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                <span>Durasi Pelaksanaan (Jam)</span>
              </label>
              <input
                type="number"
                min="0.5"
                max="16"
                step="0.5"
                value={durasiJam}
                onChange={(e) => setDurasiJam(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-blue-900"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-slate-500" />
                <span>Kategori Kegiatan</span>
              </label>
              <select
                value={kategori}
                onChange={(e) => setKategori(e.target.value as KategoriKegiatan)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900"
              >
                {KATEGORI_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Lokasi / Ruang Kerja
              </label>
              <input
                type="text"
                value={lokasi}
                onChange={(e) => setLokasi(e.target.value)}
                placeholder="Contoh: Gedung Kominfo Lt. 4 / Daring"
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Nama / Judul Kegiatan (Ringkasan)
            </label>
            <input
              type="text"
              value={namaKegiatan}
              onChange={(e) => setNamaKegiatan(e.target.value)}
              placeholder="Contoh: Penyusunan Arsitektur Basis Data Terdistribusi SPBE"
              className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Deskripsi Detail Kegiatan PKL
            </label>
            <textarea
              rows={4}
              value={deskripsiKegiatan}
              onChange={(e) => setDeskripsiKegiatan(e.target.value)}
              placeholder="Tuliskan uraian tugas, langkah penyelesaian, teknologi yang digunakan, serta kendala dan solusinya secara rinci..."
              className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900 leading-relaxed"
              required
            />
          </div>

          {/* SQL Query Live Preview to explain the isolation enforcement */}
          <div className="bg-slate-900 text-slate-200 rounded-xl p-3 border border-slate-800">
            <div className="text-[11px] font-mono text-blue-400 mb-1 flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5" />
              <span>Pratinjau Query SQL (Isolasi WHERE user_id = {currentUser.id}):</span>
            </div>
            <pre className="text-xs font-mono text-emerald-400 whitespace-pre-wrap overflow-x-auto leading-relaxed">
              {previewSqlQuery}
            </pre>
          </div>

          <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-blue-900 hover:bg-blue-800 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isEditing ? 'Simpan Perubahan' : 'Simpan Logbook'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
