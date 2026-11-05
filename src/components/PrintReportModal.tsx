import React from 'react';
import { User, LogbookItem } from '../types/logbook';
import { Printer, X, Download } from 'lucide-react';

interface PrintReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  logbooks: LogbookItem[];
}

export const PrintReportModal: React.FC<PrintReportModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  logbooks,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const totalJam = logbooks.reduce((sum, item) => sum + (item.durasi_jam || 0), 0);
  const uniqueDates = new Set(logbooks.map((l) => l.tanggal));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-4xl w-full my-6 shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Toolbar (hidden on print) */}
        <div className="no-print px-6 py-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div>
            <h3 className="text-sm font-bold tracking-tight">
              Lembar Pengesahan & Rekapitulasi Kegiatan PKL Kominfo
            </h3>
            <p className="text-xs text-slate-300">
              Format Laporan Resmi Siap Cetak (A4 Portrait)
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak / Simpan PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div className="p-8 sm:p-12 overflow-y-auto bg-white text-slate-900 font-sans print:p-0 print:m-0">
          {/* Kop Surat Resmi */}
          <div className="flex items-center justify-center gap-4 border-b-2 border-slate-900 pb-4 mb-6 font-quicksand">
            <div className="w-14 h-14 shrink-0">
              <img
                src="/assets/aistudio/logo-kominfo_869d4e21.png"
                alt="Logo Kominfo"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="text-center">
              <h2 className="text-xs font-bold tracking-wider uppercase text-slate-700">
                PEMERINTAH KABUPATEN LOMBOK TIMUR
              </h2>
              <h1 className="text-sm sm:text-base font-extrabold uppercase tracking-wide text-slate-900 mt-0.5">
                DINAS KOMUNIKASI, INFORMATIKA DAN PERSANDIAN (DISKOMINFO)
              </h1>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Jl. Prof. M. Yamin No. 55 Selong, Lombok Timur, Nusa Tenggara Barat 83612 · kominfo.lomboktimurkab.go.id
              </p>
            </div>
          </div>

          <div className="text-center mb-6">
            <h2 className="text-sm font-bold uppercase underline tracking-tight">
              LEMBAR LAPORAN & PENGESAHAN LOGBOOK KEGIATAN PKL DIGITAL
            </h2>
            <p className="text-xs text-slate-600 mt-0.5 font-mono">
              Periode: {currentUser.periode_mulai} s/d {currentUser.periode_selesai}
            </p>
          </div>

          {/* Biodata Peserta */}
          <div className="mb-6 p-4 bg-slate-50 border border-slate-200 rounded-lg text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
              <div className="flex">
                <span className="w-36 font-semibold text-slate-600">Nama Lengkap</span>
                <span className="font-bold text-slate-900">: {currentUser.username}</span>
              </div>
              <div className="flex">
                <span className="w-36 font-semibold text-slate-600">Nomor Telepon</span>
                <span className="font-mono text-slate-900">: {currentUser.nomor_telepon}</span>
              </div>
              <div className="flex">
                <span className="w-36 font-semibold text-slate-600">Asal Sekolah / Kampus</span>
                <span className="text-slate-900">: {currentUser.instansi_pendidikan}</span>
              </div>
              <div className="flex">
                <span className="w-36 font-semibold text-slate-600">Unit Penempatan</span>
                <span className="text-slate-900">: {currentUser.divisi_pkl}</span>
              </div>
              <div className="flex">
                <span className="w-36 font-semibold text-slate-600">DPL (Kampus/Sekolah)</span>
                <span className="text-slate-900">: {currentUser.nama_dpl || currentUser.dpl_kampus || '-'} (NIP: {currentUser.nip_dpl || '-'})</span>
              </div>
              <div className="flex">
                <span className="w-36 font-semibold text-slate-600">PL (Diskominfo)</span>
                <span className="text-slate-900 font-semibold text-[#e8732a]">: {currentUser.nama_pl || currentUser.nama_pembimbing || '-'} (NIP: {currentUser.nip_pl || currentUser.nip_pembimbing || '-'})</span>
              </div>
            </div>
          </div>

          {/* Tabel Logbook */}
          <div className="mb-6">
            <table className="w-full text-left text-xs border border-slate-300 border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-800 font-bold border-b border-slate-300">
                  <th className="p-2 border border-slate-300 w-10 text-center">No</th>
                  <th className="p-2 border border-slate-300 w-24">Tanggal</th>
                  <th className="p-2 border border-slate-300">Nama & Uraian Kegiatan</th>
                  <th className="p-2 border border-slate-300 w-28">Lokasi</th>
                  <th className="p-2 border border-slate-300 w-24">Kategori</th>
                  <th className="p-2 border border-slate-300 w-20 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-[11px]">
                {logbooks.map((item, idx) => (
                  <tr key={item.id} className="align-top">
                    <td className="p-2 border border-slate-300 text-center font-mono">
                      {idx + 1}
                    </td>
                    <td className="p-2 border border-slate-300 font-mono whitespace-nowrap">
                      {item.tanggal}
                    </td>
                    <td className="p-2 border border-slate-300">
                      <div className="font-semibold text-slate-900">
                        {item.nama_kegiatan}
                      </div>
                      <div className="text-slate-600 mt-0.5 leading-relaxed">
                        {item.deskripsi_kegiatan}
                      </div>
                    </td>
                    <td className="p-2 border border-slate-300 text-slate-700">
                      {item.lokasi || 'Dinas Kominfo'}
                    </td>
                    <td className="p-2 border border-slate-300 text-slate-700">
                      {item.kategori}
                    </td>
                    <td className="p-2 border border-slate-300 text-center font-semibold text-emerald-800">
                      {item.status_verifikasi}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-slate-50 font-semibold border-t-2 border-slate-300">
                  <td colSpan={4} className="p-2 border border-slate-300 text-right">
                    Total Aktivitas Terverifikasi: {logbooks.length} Kegiatan ({uniqueDates.size} Hari Aktif)
                  </td>
                  <td colSpan={2} className="p-2 border border-slate-300 text-center text-emerald-800 font-bold">
                    Disetujui DPL
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Lembar Tanda Tangan & Pengesahan DPL */}
          <div className="mt-8 pt-4 border-t border-slate-200">
            <div className="text-right text-xs text-slate-600 mb-2">
              Selong, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
            </div>

            <div className="grid grid-cols-2 gap-8 text-center text-xs">
              <div>
                <p className="text-slate-600 mb-12">Mengetahui,<br />Peserta Praktik Kerja Lapangan</p>
                <p className="font-bold text-slate-900 underline">{currentUser.username}</p>
                <p className="text-slate-500 font-mono mt-0.5">{currentUser.nomor_telepon}</p>
              </div>

              <div>
                <p className="text-slate-600 mb-2">Menyetujui & Mengesahkan,<br />Pembimbing Lapangan (DPL)</p>
                
                {/* Embed actual DPL signature if available */}
                <div className="h-16 flex items-center justify-center">
                  <img
                    src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='60'><path d='M10 40 Q 30 10 70 35 T 120 20 T 160 45 M 40 50 L 140 45' stroke='%230f2d4a' stroke-width='2.5' fill='none' stroke-linecap='round'/></svg>"
                    alt="TTD DPL"
                    className="max-h-14 object-contain"
                  />
                </div>

                <p className="font-bold text-slate-900 underline mt-1">{currentUser.nama_pembimbing}</p>
                <p className="text-slate-500 font-mono mt-0.5">NIP. {currentUser.nip_pembimbing}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
