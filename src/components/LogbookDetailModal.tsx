import React from 'react';
import { LogbookItem, User } from '../types/logbook';
import { X, Calendar, Clock, MapPin, Tag, CheckCircle2, ShieldCheck, UserCheck } from 'lucide-react';

interface LogbookDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  logbook: LogbookItem | null;
  currentUser: User;
  onEdit: (item: LogbookItem) => void;
  onDelete: (id: number) => void;
}

export const LogbookDetailModal: React.FC<LogbookDetailModalProps> = ({
  isOpen,
  onClose,
  logbook,
  currentUser,
  onEdit,
  onDelete,
}) => {
  if (!isOpen || !logbook) return null;

  const isOwner = logbook.user_id === currentUser.id;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-800 text-blue-200 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold tracking-tight">
                Rincian Logbook PKL #{logbook.id}
              </h3>
              <p className="text-xs text-slate-300">
                Terverifikasi: {currentUser.username} · {currentUser.divisi_pkl}
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

        {/* Modal Content */}
        <div className="p-6 space-y-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-1.5">
              <span>{logbook.kategori}</span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1 font-mono">
                <Calendar className="w-3.5 h-3.5" />
                {logbook.tanggal}
              </span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1 font-mono">
                <Clock className="w-3.5 h-3.5" />
                {logbook.durasi_jam} Jam
              </span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 leading-snug">
              {logbook.nama_kegiatan}
            </h2>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <span className="text-xs font-semibold text-slate-700 block">
              Deskripsi Lengkap Kegiatan:
            </span>
            <p className="text-sm text-slate-800 leading-relaxed whitespace-pre-line">
              {logbook.deskripsi_kegiatan}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-white border border-slate-200 rounded-lg">
              <span className="text-slate-500 block mb-1">Status Verifikasi</span>
              <div className="flex items-center gap-1.5 font-semibold text-emerald-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{logbook.status_verifikasi}</span>
              </div>
            </div>

            <div className="p-3 bg-white border border-slate-200 rounded-lg">
              <span className="text-slate-500 block mb-1">Lokasi Kerja</span>
              <div className="flex items-center gap-1 text-slate-800 truncate">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate">{logbook.lokasi || 'Kantor Kominfo Pusat'}</span>
              </div>
            </div>
          </div>

          {logbook.catatan_pembimbing && (
            <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-xl text-xs">
              <div className="font-semibold text-blue-950 flex items-center gap-1.5 mb-1">
                <UserCheck className="w-4 h-4 text-blue-800" />
                <span>Catatan Pembimbing ({currentUser.nama_pembimbing}):</span>
              </div>
              <p className="text-blue-900 leading-relaxed">
                "{logbook.catatan_pembimbing}"
              </p>
            </div>
          )}

          {/* Database & Isolation Row Metadata */}
          <div className="p-3 bg-slate-900 text-slate-300 rounded-xl font-mono text-[11px] space-y-1">
            <div className="text-slate-400 font-semibold mb-1">
              Metadata Database (MySQL / XAMPP):
            </div>
            <div>ID: {logbook.id} · user_id: {logbook.user_id} (Pemilik Sah: {currentUser.username})</div>
            <div>Klausa Isolasi: WHERE logbooks.user_id = {currentUser.id}</div>
            <div className="text-slate-400">Created: {logbook.created_at}</div>
          </div>

          {/* Modal Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Tutup
            </button>

            {isOwner && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    onClose();
                    onEdit(logbook);
                  }}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  Ubah Kegiatan
                </button>
                <button
                  onClick={() => {
                    onClose();
                    onDelete(logbook.id);
                  }}
                  className="px-3.5 py-2 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors"
                >
                  Hapus
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
