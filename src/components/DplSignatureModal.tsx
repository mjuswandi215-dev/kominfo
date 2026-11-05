import React, { useRef, useState, useEffect } from 'react';
import { User, DplSignatureRecord } from '../types/logbook';
import { dbEngine } from '../services/mysqlEngine';
import { X, CheckCircle2, Eraser, PenTool, Award, ShieldCheck, FileCheck } from 'lucide-react';

interface DplSignatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  onSaved: () => void;
}

export const DplSignatureModal: React.FC<DplSignatureModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSaved,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [namaDpl, setNamaDpl] = useState(currentUser.nama_pembimbing || 'Ibu Siti, S.Kom');
  const [nipDpl, setNipDpl] = useState(currentUser.nip_pembimbing || '19830412 200801 2 006');
  const [catatanDpl, setCatatanDpl] = useState('');
  const [nilaiAngka, setNilaiAngka] = useState<number>(95);
  const [predikat, setPredikat] = useState<'A (Sangat Memuaskan)' | 'B (Baik)' | 'C (Cukup)'>('A (Sangat Memuaskan)');
  const [existingRecord, setExistingRecord] = useState<DplSignatureRecord | null>(null);

  useEffect(() => {
    if (isOpen) {
      const sig = dbEngine.getDplSignature(currentUser.id);
      setExistingRecord(sig);
      setNamaDpl(sig.nama_dpl || currentUser.nama_pembimbing);
      setNipDpl(sig.nip_dpl || currentUser.nip_pembimbing);
      setCatatanDpl(sig.catatan_dpl || 'Peserta sangat disiplin, aktif, dan menyelesaikan seluruh tugas dengan sangat baik.');
      setNilaiAngka(sig.nilai_angka || 95);
      setPredikat(sig.predikat || 'A (Sangat Memuaskan)');
      setHasDrawn(!!sig.signature_data_url);

      setTimeout(() => {
        const canvas = canvasRef.current;
        if (canvas) {
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            if (sig.signature_data_url) {
              const img = new Image();
              img.onload = () => {
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
              };
              img.src = sig.signature_data_url;
            }
          }
        }
      }, 100);
    }
  }, [isOpen, currentUser]);

  if (!isOpen) return null;

  // Drawing event handlers for canvas
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    setHasDrawn(true);
    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = '#0f2d4a';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const handleClearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
  };

  const handleApplyPresetSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.strokeStyle = '#0f2d4a';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';

    // Draw stylized signature
    ctx.moveTo(30, 80);
    ctx.bezierCurveTo(60, 20, 110, 80, 150, 40);
    ctx.bezierCurveTo(180, 20, 220, 70, 280, 50);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(70, 95);
    ctx.lineTo(240, 85);
    ctx.stroke();

    setHasDrawn(true);
  };

  const handleSaveSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let signatureUrl = canvas.toDataURL('image/png');
    if (!hasDrawn && existingRecord?.signature_data_url) {
      signatureUrl = existingRecord.signature_data_url;
    }

    dbEngine.saveDplSignature(currentUser.id, {
      nama_dpl: namaDpl,
      nip_dpl: nipDpl,
      signature_data_url: signatureUrl,
      catatan_dpl: catatanDpl,
      nilai_angka: nilaiAngka,
      predikat: predikat,
    });

    onSaved();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-xl w-full my-6 shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-[#0d2238] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#e8732a] text-white flex items-center justify-center">
              <PenTool className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold tracking-tight">
                Pengesahan & Tanda Tangan Digital DPL
              </h3>
              <p className="text-xs text-blue-200">
                Peserta: {currentUser.username} ({currentUser.instansi_pendidikan})
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

        <div className="p-6 space-y-4 text-xs">
          {/* Status Banner */}
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2.5 text-emerald-900">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <div className="font-semibold">Validasi Resmi Dinas Kominfo Lombok Timur</div>
              <div className="text-[11px] text-emerald-700">
                Tanda tangan akan tersemat otomatis pada Lembar Pengesahan PKL dan Laporan Akhir.
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Nama Pembimbing Lapangan (DPL)
              </label>
              <input
                type="text"
                value={namaDpl}
                onChange={(e) => setNamaDpl(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0d2238]"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                NIP Pembimbing
              </label>
              <input
                type="text"
                value={nipDpl}
                onChange={(e) => setNipDpl(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0d2238]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-[#e8732a]" />
                <span>Nilai Evaluasi Akhir (0 - 100)</span>
              </label>
              <input
                type="number"
                min="70"
                max="100"
                value={nilaiAngka}
                onChange={(e) => setNilaiAngka(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-mono text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-[#0d2238]"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Predikat Kelulusan PKL
              </label>
              <select
                value={predikat}
                onChange={(e) => setPredikat(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-medium"
              >
                <option value="A (Sangat Memuaskan)">A (Sangat Memuaskan)</option>
                <option value="B (Baik)">B (Baik)</option>
                <option value="C (Cukup)">C (Cukup)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Catatan & Ulasan Pembimbing Lapangan
            </label>
            <textarea
              rows={2}
              value={catatanDpl}
              onChange={(e) => setCatatanDpl(e.target.value)}
              placeholder="Catatan kemajuan dan evaluasi kinerja peserta magang..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0d2238]"
            />
          </div>

          {/* Interactive Signature Canvas */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="font-semibold text-slate-700 flex items-center gap-1">
                <PenTool className="w-3.5 h-3.5 text-slate-500" />
                <span>Area Goresan Tanda Tangan Digital DPL</span>
              </label>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleApplyPresetSignature}
                  className="text-[11px] text-[#e8732a] hover:underline font-semibold"
                >
                  Gunakan Contoh TTD
                </button>
                <span className="text-slate-300">·</span>
                <button
                  type="button"
                  onClick={handleClearCanvas}
                  className="text-[11px] text-slate-500 hover:text-slate-800 flex items-center gap-0.5"
                >
                  <Eraser className="w-3 h-3" />
                  <span>Hapus</span>
                </button>
              </div>
            </div>

            <div className="border-2 border-dashed border-slate-300 rounded-xl bg-slate-50/50 p-2 text-center cursor-crosshair">
              <canvas
                ref={canvasRef}
                width={480}
                height={130}
                className="w-full h-32 bg-white rounded-lg shadow-xs touch-none border border-slate-200"
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
              />
              <span className="text-[10px] text-slate-400 block mt-1">
                Goreskan tanda tangan di atas kotak putih menggunakan mouse atau jari/stylus.
              </span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleSaveSignature}
              className="px-5 py-2 font-semibold text-white bg-[#e8732a] hover:bg-[#d4621b] rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Sahkan & Simpan Tanda Tangan</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
