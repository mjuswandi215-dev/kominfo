import React, { useState, useEffect } from 'react';
import { User, AttendanceRecord, StatusAbsensi } from '../types/logbook';
import { dbEngine } from '../services/mysqlEngine';
import { X, Clock, Calendar, MapPin, CheckCircle2, AlertCircle, LogIn, LogOut, CheckSquare } from 'lucide-react';

interface AbsensiModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  onSaved: () => void;
}

export const AbsensiModal: React.FC<AbsensiModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSaved,
}) => {
  const [attendanceList, setAttendanceList] = useState<AttendanceRecord[]>([]);
  const [currentClock, setCurrentClock] = useState('');
  const [statusAbsen, setStatusAbsen] = useState<StatusAbsensi>('Hadir');
  const [lokasi, setLokasi] = useState('Kantor Dinas Kominfo Lombok Timur');
  const [keterangan, setKeterangan] = useState('');
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const todayStr = new Date().toISOString().split('T')[0];

  useEffect(() => {
    if (isOpen) {
      setAttendanceList(dbEngine.getAttendanceRecords(currentUser.id));
      const updateTime = () => {
        const now = new Date();
        setCurrentClock(now.toLocaleTimeString('id-ID', { hour12: false }));
      };
      updateTime();
      const interval = setInterval(updateTime, 1000);
      return () => clearInterval(interval);
    }
  }, [isOpen, currentUser]);

  if (!isOpen) return null;

  const todayRecord = attendanceList.find((a) => a.tanggal === todayStr);

  const handleCheckIn = () => {
    setMsg(null);
    const timeNow = new Date().toLocaleTimeString('id-ID', { hour12: false });
    const res = dbEngine.recordCheckIn(currentUser.id, {
      tanggal: todayStr,
      jam_masuk: timeNow,
      status: statusAbsen,
      lokasi: lokasi,
      keterangan: keterangan,
    });

    if (res.success) {
      setMsg({ type: 'success', text: res.message });
      setAttendanceList(dbEngine.getAttendanceRecords(currentUser.id));
      onSaved();
    } else {
      setMsg({ type: 'error', text: res.message });
    }
  };

  const handleCheckOut = (recordId: number) => {
    setMsg(null);
    const timeNow = new Date().toLocaleTimeString('id-ID', { hour12: false });
    const res = dbEngine.recordCheckOut(currentUser.id, recordId, timeNow);

    if (res.success) {
      setMsg({ type: 'success', text: res.message });
      setAttendanceList(dbEngine.getAttendanceRecords(currentUser.id));
      onSaved();
    } else {
      setMsg({ type: 'error', text: res.message });
    }
  };

  const totalHadir = attendanceList.filter((a) => a.status === 'Hadir' || a.status === 'Dinas Luar').length;
  const ratePersen = attendanceList.length > 0 ? Math.round((totalHadir / attendanceList.length) * 100) : 98;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full my-6 shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-[#0d2238] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#e8732a] text-white flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold tracking-tight">
                Presensi & Absensi PKL Digital
              </h3>
              <p className="text-xs text-blue-200">
                {currentUser.username} · {currentUser.divisi_pkl}
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

        <div className="p-6 space-y-5 text-xs">
          {/* Notification feedback */}
          {msg && (
            <div
              className={`p-3 rounded-xl border flex items-center gap-2 ${
                msg.type === 'success'
                  ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
                  : 'bg-rose-50 text-rose-900 border-rose-200'
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

          {/* Real-time Clock & Check-in card */}
          <div className="p-4 bg-gradient-to-r from-slate-900 to-[#0f2d4a] rounded-2xl text-white shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-[11px] text-blue-200 uppercase tracking-wider block font-semibold">
                Waktu Server Presensi (WITA)
              </span>
              <div className="text-3xl font-extrabold font-mono tracking-wider mt-0.5 text-white">
                {currentClock || '08:00:00'}
              </div>
              <div className="text-xs text-blue-200 mt-1 flex items-center gap-1.5 font-mono">
                <Calendar className="w-3.5 h-3.5" />
                <span>{todayStr}</span>
                <span>·</span>
                <span>Tingkat Kehadiran: {ratePersen}%</span>
              </div>
            </div>

            {/* Check-in or Check-out status */}
            <div className="w-full sm:w-auto">
              {todayRecord ? (
                <div className="bg-white/10 p-3 rounded-xl border border-white/20 text-center space-y-1.5">
                  <div className="text-[11px] text-emerald-300 font-semibold flex items-center justify-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Sudah Masuk: {todayRecord.jam_masuk} WITA</span>
                  </div>
                  {todayRecord.jam_pulang ? (
                    <div className="text-[11px] text-blue-200 font-mono">
                      Pulang: {todayRecord.jam_pulang} WITA (Lengkap)
                    </div>
                  ) : (
                    <button
                      onClick={() => handleCheckOut(todayRecord.id)}
                      className="w-full px-4 py-2 bg-[#e8732a] hover:bg-[#d4621b] text-white font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Presensi Pulang Sekarang</span>
                    </button>
                  )}
                </div>
              ) : (
                <div className="flex flex-col gap-2 w-full sm:w-64">
                  <div className="flex gap-2">
                    <select
                      value={statusAbsen}
                      onChange={(e) => setStatusAbsen(e.target.value as StatusAbsensi)}
                      className="px-2 py-1.5 bg-white/15 border border-white/20 rounded-lg text-white font-medium focus:outline-none"
                    >
                      <option value="Hadir" className="text-slate-900">Hadir</option>
                      <option value="Dinas Luar" className="text-slate-900">Dinas Luar</option>
                      <option value="Izin" className="text-slate-900">Izin</option>
                      <option value="Sakit" className="text-slate-900">Sakit</option>
                    </select>

                    <button
                      onClick={handleCheckIn}
                      className="flex-1 px-4 py-2 bg-[#e8732a] hover:bg-[#d4621b] text-white font-bold rounded-lg flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                    >
                      <LogIn className="w-4 h-4" />
                      <span>Absen Masuk</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Quick Stats Strip */}
          <div className="grid grid-cols-4 gap-2 text-center">
            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="text-[10px] text-slate-500 block">Total Hari</span>
              <span className="text-base font-bold font-mono text-slate-900">{attendanceList.length}</span>
            </div>
            <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl">
              <span className="text-[10px] text-emerald-700 block">Hadir</span>
              <span className="text-base font-bold font-mono text-emerald-800">{totalHadir}</span>
            </div>
            <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl">
              <span className="text-[10px] text-amber-700 block">Izin/Sakit</span>
              <span className="text-base font-bold font-mono text-amber-800">
                {attendanceList.filter((a) => a.status === 'Izin' || a.status === 'Sakit').length}
              </span>
            </div>
            <div className="p-2.5 bg-blue-50 border border-blue-200 rounded-xl">
              <span className="text-[10px] text-blue-700 block">Persentase</span>
              <span className="text-base font-bold font-mono text-blue-900">{ratePersen}%</span>
            </div>
          </div>

          {/* Attendance History Table */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-bold text-slate-900">Riwayat Presensi Kehadiran</h4>
              <span className="text-[11px] text-slate-500 font-mono">
                Tersimpan di tabel `absensi` (WHERE user_id = {currentUser.id})
              </span>
            </div>

            <div className="border border-slate-200 rounded-xl overflow-hidden max-h-56 overflow-y-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 font-semibold text-slate-600">
                    <th className="py-2 px-3">Tanggal</th>
                    <th className="py-2 px-3">Masuk</th>
                    <th className="py-2 px-3">Pulang</th>
                    <th className="py-2 px-3">Status</th>
                    <th className="py-2 px-3">Lokasi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                  {attendanceList.map((rec) => (
                    <tr key={rec.id} className="hover:bg-slate-50">
                      <td className="py-2 px-3 text-slate-700">{rec.tanggal}</td>
                      <td className="py-2 px-3 text-emerald-700 font-semibold">{rec.jam_masuk}</td>
                      <td className="py-2 px-3 text-slate-600">{rec.jam_pulang || '-'}</td>
                      <td className="py-2 px-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                            rec.status === 'Hadir'
                              ? 'bg-emerald-100 text-emerald-800'
                              : rec.status === 'Dinas Luar'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {rec.status}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-slate-500 font-sans truncate max-w-xs">
                        {rec.lokasi}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Footer actions */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 font-semibold text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
