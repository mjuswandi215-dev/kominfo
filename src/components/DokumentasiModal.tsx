import React, { useState } from 'react';
import { User, DokumentasiFoto } from '../types/logbook';
import { dbEngine } from '../services/mysqlEngine';
import { X, Image as ImageIcon, Plus, Calendar, Tag, CheckCircle2 } from 'lucide-react';

interface DokumentasiModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  onSaved: () => void;
}

export const DokumentasiModal: React.FC<DokumentasiModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSaved,
}) => {
  const [docs, setDocs] = useState<DokumentasiFoto[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [judul, setJudul] = useState('');
  const [kategori, setKategori] = useState('Jaringan');
  const [deskripsi, setDeskripsi] = useState('');
  const [fotoUrl, setFotoUrl] = useState('/public/assets/aistudio/WhatsApp_Image_2026-11-05_at_22.23.38_4d00a6be.jpeg');
  const [previewActive, setPreviewActive] = useState<DokumentasiFoto | null>(null);

  React.useEffect(() => {
    if (isOpen) {
      setDocs(dbEngine.getDokumentasi(currentUser.id));
    }
  }, [isOpen, currentUser]);

  if (!isOpen) return null;

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!judul.trim()) return;

    dbEngine.addDokumentasi(currentUser.id, {
      judul: judul.trim(),
      tanggal: new Date().toISOString().split('T')[0],
      kategori,
      foto_url: fotoUrl,
      deskripsi: deskripsi.trim() || 'Dokumentasi kegiatan PKL Dinas Kominfo.',
    });

    setDocs(dbEngine.getDokumentasi(currentUser.id));
    setIsAdding(false);
    setJudul('');
    setDeskripsi('');
    onSaved();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full my-6 shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-[#0d2238] text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#e8732a] text-white flex items-center justify-center">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold tracking-tight">
                Galeri Foto Dokumentasi Kegiatan PKL
              </h3>
              <p className="text-xs text-blue-200">
                Total 128 Foto · Dinas Kominfo Lombok Timur
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

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs flex-1">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-slate-700">
              Dokumentasi Resmi Peserta ({currentUser.username})
            </span>
            <button
              onClick={() => setIsAdding(!isAdding)}
              className="px-3 py-1.5 bg-[#e8732a] hover:bg-[#d4621b] text-white rounded-lg font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{isAdding ? 'Tutup Form' : 'Unggah Foto Baru'}</span>
            </button>
          </div>

          {/* Form to add photo */}
          {isAdding && (
            <form onSubmit={handleAddSubmit} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
              <h4 className="font-bold text-slate-900">Tambah Foto Dokumentasi Kegiatan</h4>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Judul Kegiatan / Foto</label>
                  <input
                    type="text"
                    value={judul}
                    onChange={(e) => setJudul(e.target.value)}
                    placeholder="Contoh: Instalasi Kabel Jaringan Ruang Server"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0d2238]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Kategori</label>
                  <select
                    value={kategori}
                    onChange={(e) => setKategori(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900"
                  >
                    <option value="Jaringan">Jaringan</option>
                    <option value="Desain">Desain</option>
                    <option value="Administrasi">Administrasi</option>
                    <option value="Sosialisasi">Sosialisasi</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Keterangan Aktivitas</label>
                <textarea
                  rows={2}
                  value={deskripsi}
                  onChange={(e) => setDeskripsi(e.target.value)}
                  placeholder="Uraian singkat foto..."
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0d2238]"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="px-3 py-1.5 text-slate-600 hover:bg-slate-200 rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#0d2238] hover:bg-[#1a3856] text-white font-semibold rounded-lg shadow-xs"
                >
                  Simpan Foto
                </button>
              </div>
            </form>
          )}

          {/* Grid of Photos */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {docs.map((doc) => (
              <div
                key={doc.id}
                onClick={() => setPreviewActive(doc)}
                className="group relative rounded-xl border border-slate-200 overflow-hidden bg-slate-100 hover:shadow-md transition-all cursor-pointer aspect-4/3"
              >
                <img
                  src={doc.foto_url}
                  alt={doc.judul}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/20 to-transparent opacity-90 group-hover:opacity-100 transition-opacity p-2.5 flex flex-col justify-end text-white">
                  <div className="text-[10px] text-[#f28e4e] font-mono">{doc.tanggal} · {doc.kategori}</div>
                  <div className="font-semibold text-xs leading-tight truncate">{doc.judul}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Active Preview Modal */}
          {previewActive && (
            <div className="p-4 bg-slate-900 text-white rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-sm text-[#f28e4e]">{previewActive.judul}</h4>
                <button onClick={() => setPreviewActive(null)} className="text-slate-400 hover:text-white">
                  ×
                </button>
              </div>
              <div className="max-h-72 rounded-lg overflow-hidden border border-slate-800">
                <img
                  src={previewActive.foto_url}
                  alt={previewActive.judul}
                  className="w-full h-auto max-h-72 object-contain mx-auto"
                  referrerPolicy="no-referrer"
                />
              </div>
              <p className="text-slate-300 text-xs leading-relaxed">{previewActive.deskripsi}</p>
            </div>
          )}
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 font-semibold text-slate-700 hover:bg-slate-200 rounded-lg"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
