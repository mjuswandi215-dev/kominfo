import React, { useState, useEffect } from 'react';
import { User, SqlQueryLog, SecurityTestResult, LogbookItem } from '../types/logbook';
import { dbEngine } from '../services/mysqlEngine';
import {
  Database,
  ShieldAlert,
  Code2,
  Table,
  Download,
  Trash2,
  Play,
  CheckCircle2,
  AlertTriangle,
  Lock,
  ArrowRight,
  Server,
  FileCode
} from 'lucide-react';

interface ArchitectureInspectorProps {
  currentUser: User | null;
  availableUsers: User[];
}

export const ArchitectureInspector: React.FC<ArchitectureInspectorProps> = ({
  currentUser,
  availableUsers,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'flow' | 'sql_logs' | 'schema' | 'tamper_test' | 'raw_db'>('flow');
  const [sqlLogs, setSqlLogs] = useState<SqlQueryLog[]>([]);
  const [rawDb, setRawDb] = useState<{ users: User[]; logbooks: LogbookItem[] }>({ users: [], logbooks: [] });

  // Tamper Test state
  const [tamperAction, setTamperAction] = useState<'VIEW_DETAIL' | 'EDIT' | 'DELETE'>('DELETE');
  const [tamperTargetId, setTamperTargetId] = useState<number>(5); // Logbook milik user 2
  const [tamperResult, setTamperResult] = useState<SecurityTestResult | null>(null);

  const refreshData = () => {
    setSqlLogs(dbEngine.getSqlLogs());
    setRawDb(dbEngine.getRawDatabaseTables());
  };

  useEffect(() => {
    refreshData();
    const unsub = dbEngine.subscribe(refreshData);
    return () => unsub();
  }, []);

  const handleRunTamperTest = () => {
    if (!currentUser) return;
    const res = dbEngine.testCrossUserTamper(currentUser.id, tamperTargetId, tamperAction);
    setTamperResult(res);
  };

  const handleDownloadSql = () => {
    const dump = dbEngine.generateSqlDump();
    const blob = new Blob([dump], { type: 'text/sql;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `kominfo_logbook_pkl_dump_${Date.now()}.sql`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-blue-400 mb-1">
              <Server className="w-4 h-4" />
              <span>XAMPP / MySQL / PHP Multi-User Architecture Engine</span>
            </div>
            <h2 className="text-xl font-bold tracking-tight">
              Arsitektur Sistem & Isolasi Data Multi-Pengguna
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Membedah implementasi pemartisian data (<code className="text-blue-300 font-mono">WHERE user_id = ?</code>),
              autentikasi otomatis berbasis nomor telepon unik, pencegahan bypass URL langsung, serta verifikasi kepemilikan CRUD.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleDownloadSql}
              className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Unduh .SQL (phpMyAdmin)</span>
            </button>
            <button
              onClick={() => dbEngine.resetDatabaseToDefault()}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium rounded-lg transition-colors"
              title="Reset data ke default 3 peserta & 9 logbook"
            >
              Reset Data
            </button>
          </div>
        </div>

        {/* Sub Navigation */}
        <div className="flex flex-wrap items-center gap-2 mt-6 pt-4 border-t border-slate-800">
          <button
            onClick={() => setActiveSubTab('flow')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
              activeSubTab === 'flow'
                ? 'bg-blue-600 text-white'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Alur Sistem & Pseudocode</span>
          </button>

          <button
            onClick={() => setActiveSubTab('tamper_test')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
              activeSubTab === 'tamper_test'
                ? 'bg-blue-600 text-white'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
            <span>Sandbox Uji Penetrasi (Tamper Test)</span>
          </button>

          <button
            onClick={() => setActiveSubTab('sql_logs')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
              activeSubTab === 'sql_logs'
                ? 'bg-blue-600 text-white'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>Live SQL Stream ({sqlLogs.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('schema')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
              activeSubTab === 'schema'
                ? 'bg-blue-600 text-white'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Table className="w-3.5 h-3.5" />
            <span>Skema Database & ERD</span>
          </button>

          <button
            onClick={() => setActiveSubTab('raw_db')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
              activeSubTab === 'raw_db'
                ? 'bg-blue-600 text-white'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>Tabel Fisik MySQL ({rawDb.users.length} Users · {rawDb.logbooks.length} Logs)</span>
          </button>
        </div>
      </div>

      {/* Subtab 1: Flowchart & Pseudocode */}
      {activeSubTab === 'flow' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Card 1: Alur Autentikasi & Registrasi Otomatis */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-blue-100 text-blue-900 font-bold text-xs flex items-center justify-center">
                1
              </span>
              <h3 className="text-sm font-bold text-slate-900">
                Alur Autentikasi & Registrasi Berbasis No. Telepon
              </h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Mekanisme login tanpa password yang efisien untuk peserta PKL. Sistem memeriksa apakah nomor telepon telah terdaftar di database MySQL.
            </p>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 font-mono text-xs text-slate-800 space-y-2">
              <div className="text-blue-900 font-bold">// Pseudocode Autentikasi</div>
              <div className="text-slate-600">
                input_username = TRIM(input_username)<br />
                clean_telp = TRIM(input_nomor_telepon)<br />
                user = SELECT * FROM users WHERE nomor_telepon == clean_telp
              </div>
              <div className="pl-3 border-l-2 border-blue-900 text-slate-700 space-y-1">
                <div>IF user DITEMUKAN THEN:</div>
                <div className="text-emerald-700 font-semibold pl-3">
                  $_SESSION['user_id'] = user.id (Login Otomatis)
                </div>
                <div>ELSE:</div>
                <div className="text-blue-700 font-semibold pl-3">
                  INSERT INTO users (username, nomor_telepon) VALUES (...)<br />
                  $_SESSION['user_id'] = new_id (Registrasi Baru)
                </div>
              </div>
              <div className="text-slate-700">REDIRECT_TO('dashboard.php')</div>
            </div>

            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900">
              <strong>Penanganan Edge Case:</strong> Kolom <code className="font-mono bg-white px-1 py-0.5 rounded">nomor_telepon</code> memiliki indeks <code className="font-mono bg-white px-1 py-0.5 rounded">UNIQUE</code> di MySQL guna mencegah duplikasi entri atau race-condition.
            </div>
          </div>

          {/* Card 2: Isolasi Data Pengguna (WHERE user_id) */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-blue-100 text-blue-900 font-bold text-xs flex items-center justify-center">
                2
              </span>
              <h3 className="text-sm font-bold text-slate-900">
                Prinsip Isolasi Data Pengguna (Data Partitioning)
              </h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Menjamin bahwa User A tidak pernah dapat membaca, mengedit, atau menghapus data milik User B sekalipun keduanya berbagi satu tabel fisik MySQL <code className="font-mono bg-slate-100 px-1 py-0.5 rounded">logbooks</code>.
            </p>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 font-mono text-xs text-slate-800 space-y-2">
              <div className="text-blue-900 font-bold">// Algoritma Operasi Terisolasi</div>
              <div>
                <span className="text-purple-700">READ:</span> SELECT * FROM logbooks <strong className="text-rose-600">WHERE user_id = ?</strong>
              </div>
              <div>
                <span className="text-purple-700">AGGREGATE:</span> SELECT COUNT(*) <strong className="text-rose-600">WHERE user_id = ?</strong>
              </div>
              <div>
                <span className="text-purple-700">UPDATE:</span> UPDATE logbooks SET ... <strong className="text-rose-600">WHERE id = ? AND user_id = ?</strong>
              </div>
              <div>
                <span className="text-purple-700">DELETE:</span> DELETE FROM logbooks <strong className="text-rose-600">WHERE id = ? AND user_id = ?</strong>
              </div>
            </div>

            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-900">
              <strong>Validasi Kepemilikan CRUD:</strong> Query UPDATE dan DELETE selalu menyertakan <code className="font-mono bg-white px-1 py-0.5 rounded">AND user_id = session_id</code>. Jika ID logbook milik orang lain dimasukkan, MySQL mengembalikan 0 affected rows dan sistem langsung menolak akses.
            </div>
          </div>
        </div>
      )}

      {/* Subtab 2: Sandbox Uji Penetrasi Multi-User */}
      {activeSubTab === 'tamper_test' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-200">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Lock className="w-5 h-5 text-blue-900" />
                <span>Simulasi Penetrasi Akses Lintas Akun (Cross-User Tamper Test)</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Uji langsung ketahanan algoritma saat seorang peserta mencoba memodifikasi atau menghapus ID logbook milik peserta lain.
              </p>
            </div>
            {currentUser && (
              <div className="text-xs bg-slate-100 px-3 py-1.5 rounded-lg text-slate-700 font-mono">
                Sesi Aktif: <strong>{currentUser.username}</strong> (ID: {currentUser.id})
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Operasi yang Dicoba (Aksi Penetrasi)
              </label>
              <select
                value={tamperAction}
                onChange={(e) => setTamperAction(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-800"
              >
                <option value="DELETE">DELETE (Mencoba Hapus Record)</option>
                <option value="EDIT">UPDATE (Mencoba Ubah Record)</option>
                <option value="VIEW_DETAIL">SELECT (Mencoba Baca Detail)</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Target Record Logbook ID yang Diuji
              </label>
              <select
                value={tamperTargetId}
                onChange={(e) => setTamperTargetId(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-800"
              >
                {rawDb.logbooks.map((l) => {
                  const owner = rawDb.users.find((u) => u.id === l.user_id);
                  const isOwnedByMe = currentUser && l.user_id === currentUser.id;
                  return (
                    <option key={l.id} value={l.id}>
                      Logbook #{l.id} - &quot;{l.nama_kegiatan.substring(0, 32)}...&quot; [Pemilik: {owner ? owner.username : `User #${l.user_id}`}] {isOwnedByMe ? '(Milik Anda Sendiri)' : '(MILIK ORANG LAIN)'}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>

          <button
            onClick={handleRunTamperTest}
            className="px-5 py-2.5 bg-blue-900 hover:bg-blue-800 text-white rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors shadow-xs"
          >
            <Play className="w-3.5 h-3.5" />
            <span>Jalankan Pengujian Validasi Keamanan</span>
          </button>

          {/* Test Results Banner */}
          {tamperResult && (
            <div
              className={`p-4 rounded-xl border text-xs space-y-2.5 transition-all ${
                tamperResult.isBlocked
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                  : 'bg-blue-50 border-blue-300 text-blue-950'
              }`}
            >
              <div className="flex items-center gap-2 font-bold text-sm">
                {tamperResult.isBlocked ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span>ISOLASI DATA SUKSES: Akses Berhasil Dicegah!</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0" />
                    <span>Akses Diizinkan (Record Milik Sendiri)</span>
                  </>
                )}
              </div>

              <p className="leading-relaxed">{tamperResult.message}</p>

              <div className="bg-slate-900 text-slate-200 p-3 rounded-lg font-mono text-[11px] overflow-x-auto space-y-1">
                <div className="text-slate-400 font-semibold">// Query yang dieksekusi mesin basis data:</div>
                <div className="text-emerald-400">{tamperResult.queryExecuted}</div>
                <div className="text-slate-400 mt-1">
                  Pengguna Aktif: ID #{tamperResult.currentUserId} ({tamperResult.currentUserName}) · Pemilik Sah Target: ID #{tamperResult.targetOwnerId} ({tamperResult.targetOwnerName})
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Subtab 3: Live SQL Stream */}
      {activeSubTab === 'sql_logs' && (
        <div className="bg-slate-950 text-slate-200 rounded-2xl p-6 border border-slate-800 shadow-md space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2">
                <Database className="w-4 h-4 text-emerald-400" />
                <span>Live MySQL Query Execution Stream (Real-Time XAMPP Telemetry)</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Setiap klik pada antarmuka menghasilkan query SQL nyata dengan klausa isolasi terlampir.
              </p>
            </div>
            <button
              onClick={() => dbEngine.clearSqlLogs()}
              className="text-xs text-slate-400 hover:text-white px-2.5 py-1 rounded bg-slate-900 border border-slate-800 transition-colors"
            >
              Bersihkan Log
            </button>
          </div>

          <div className="space-y-2 max-h-[520px] overflow-y-auto pr-1">
            {sqlLogs.map((log) => (
              <div
                key={log.id}
                className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 font-mono text-xs space-y-1.5"
              >
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-1.5 py-0.2 rounded font-bold text-[10px] ${
                        log.operation === 'SELECT'
                          ? 'bg-blue-900 text-blue-200'
                          : log.operation === 'INSERT'
                          ? 'bg-emerald-900 text-emerald-200'
                          : log.operation === 'UPDATE'
                          ? 'bg-amber-900 text-amber-200'
                          : log.operation === 'DELETE'
                          ? 'bg-rose-900 text-rose-200'
                          : 'bg-purple-900 text-purple-200'
                      }`}
                    >
                      {log.operation}
                    </span>
                    <span>{log.timestamp}</span>
                    <span>·</span>
                    <span>{log.executionTimeMs} ms</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {log.isolationEnforced && (
                      <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800 px-1.5 py-0.2 rounded">
                        WHERE user_id Verified
                      </span>
                    )}
                    <span
                      className={`font-semibold ${
                        log.status === 'SUCCESS'
                          ? 'text-emerald-400'
                          : log.status === 'REJECTED_UNAUTHORIZED'
                          ? 'text-rose-400'
                          : 'text-amber-400'
                      }`}
                    >
                      [{log.status}]
                    </span>
                  </div>
                </div>

                <pre className="text-slate-100 overflow-x-auto whitespace-pre-wrap leading-relaxed">
                  {log.query}
                </pre>

                {log.details && (
                  <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-800/80">
                    Keterangan: {log.details}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Subtab 4: Skema Database & ERD */}
      {activeSubTab === 'schema' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Tabel users */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Table className="w-4 h-4 text-blue-900" />
                  <h4 className="text-sm font-bold text-slate-900 font-mono">
                    Tabel: `users`
                  </h4>
                </div>
                <span className="text-[11px] font-mono text-slate-500">
                  {rawDb.users.length} rows
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                      <th className="py-2 px-2.5">Field</th>
                      <th className="py-2 px-2.5">Type</th>
                      <th className="py-2 px-2.5">Key</th>
                      <th className="py-2 px-2.5">Keterangan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                    <tr>
                      <td className="py-2 px-2.5 font-bold text-blue-900">id</td>
                      <td className="py-2 px-2.5 text-slate-600">INT(11)</td>
                      <td className="py-2 px-2.5 text-amber-600 font-bold">PRIMARY KEY</td>
                      <td className="py-2 px-2.5 text-slate-500 font-sans">Auto Increment</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-2.5 font-bold">username</td>
                      <td className="py-2 px-2.5 text-slate-600">VARCHAR(100)</td>
                      <td className="py-2 px-2.5 text-slate-400">-</td>
                      <td className="py-2 px-2.5 text-slate-500 font-sans">Nama lengkap peserta PKL</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-2.5 font-bold">nomor_telepon</td>
                      <td className="py-2 px-2.5 text-slate-600">VARCHAR(20)</td>
                      <td className="py-2 px-2.5 text-purple-600 font-bold">UNIQUE KEY</td>
                      <td className="py-2 px-2.5 text-slate-500 font-sans">Identifikasi & Login Mandiri</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-2.5">divisi_pkl</td>
                      <td className="py-2 px-2.5 text-slate-600">VARCHAR(100)</td>
                      <td className="py-2 px-2.5 text-slate-400">-</td>
                      <td className="py-2 px-2.5 text-slate-500 font-sans">Unit kerja penempatan Kominfo</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-2.5">created_at</td>
                      <td className="py-2 px-2.5 text-slate-600">TIMESTAMP</td>
                      <td className="py-2 px-2.5 text-slate-400">-</td>
                      <td className="py-2 px-2.5 text-slate-500 font-sans">Waktu registrasi akun</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Tabel logbooks */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Table className="w-4 h-4 text-blue-900" />
                  <h4 className="text-sm font-bold text-slate-900 font-mono">
                    Tabel: `logbooks`
                  </h4>
                </div>
                <span className="text-[11px] font-mono text-slate-500">
                  {rawDb.logbooks.length} rows
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                      <th className="py-2 px-2.5">Field</th>
                      <th className="py-2 px-2.5">Type</th>
                      <th className="py-2 px-2.5">Key</th>
                      <th className="py-2 px-2.5">Keterangan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                    <tr>
                      <td className="py-2 px-2.5 font-bold text-blue-900">id</td>
                      <td className="py-2 px-2.5 text-slate-600">INT(11)</td>
                      <td className="py-2 px-2.5 text-amber-600 font-bold">PRIMARY KEY</td>
                      <td className="py-2 px-2.5 text-slate-500 font-sans">Auto Increment</td>
                    </tr>
                    <tr className="bg-blue-50/50">
                      <td className="py-2 px-2.5 font-bold text-blue-900">user_id</td>
                      <td className="py-2 px-2.5 text-slate-600">INT(11)</td>
                      <td className="py-2 px-2.5 text-rose-600 font-bold">FOREIGN KEY</td>
                      <td className="py-2 px-2.5 text-slate-700 font-sans font-medium">Relasi ke users.id (ISOLASI)</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-2.5 font-bold">tanggal</td>
                      <td className="py-2 px-2.5 text-slate-600">DATE</td>
                      <td className="py-2 px-2.5 text-slate-400">INDEX</td>
                      <td className="py-2 px-2.5 text-slate-500 font-sans">Tanggal pelaksanaan kegiatan</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-2.5 font-bold">nama_kegiatan</td>
                      <td className="py-2 px-2.5 text-slate-600">VARCHAR(255)</td>
                      <td className="py-2 px-2.5 text-slate-400">-</td>
                      <td className="py-2 px-2.5 text-slate-500 font-sans">Judul atau ringkasan aktivitas</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-2.5 font-bold">deskripsi_kegiatan</td>
                      <td className="py-2 px-2.5 text-slate-600">TEXT</td>
                      <td className="py-2 px-2.5 text-slate-400">-</td>
                      <td className="py-2 px-2.5 text-slate-500 font-sans">Penjelasan detail kegiatan</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-2.5">durasi_jam</td>
                      <td className="py-2 px-2.5 text-slate-600">DECIMAL(4,1)</td>
                      <td className="py-2 px-2.5 text-slate-400">-</td>
                      <td className="py-2 px-2.5 text-slate-500 font-sans">Lama pengerjaan tugas</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* ERD Diagram Explanation */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
            <h4 className="text-sm font-bold text-slate-900 mb-3">
              Entity Relationship Diagram (ERD): 1 to N Partition
            </h4>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs text-slate-800 flex flex-col md:flex-row items-center justify-around gap-4 text-center">
              <div className="p-3 bg-white border border-slate-300 rounded-lg shadow-xs w-52">
                <div className="font-bold text-blue-900">TABLE users (1)</div>
                <div className="text-[11px] text-slate-500 mt-1">PK: id</div>
                <div className="text-[11px] text-slate-500">nomor_telepon (UQ)</div>
              </div>

              <div className="flex items-center gap-1 text-blue-900 font-bold">
                <span className="text-xs font-mono">1 : Banyak (1:N)</span>
                <ArrowRight className="w-5 h-5 text-blue-900" />
              </div>

              <div className="p-3 bg-white border border-slate-300 rounded-lg shadow-xs w-52">
                <div className="font-bold text-blue-900">TABLE logbooks (N)</div>
                <div className="text-[11px] text-slate-500 mt-1">PK: id</div>
                <div className="text-[11px] text-rose-700 font-semibold">FK: user_id</div>
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-3 leading-relaxed">
              Kunci foreign key <code className="font-mono bg-slate-100 px-1 py-0.5 rounded text-slate-800">logbooks.user_id REFERENCES users(id) ON DELETE CASCADE</code> memastikan integritas referensial. Jika seorang peserta dihapus, seluruh data riwayat logbook miliknya terhapus bersih tanpa meninggalkan orphaned records.
            </p>
          </div>
        </div>
      )}

      {/* Subtab 5: Raw MySQL Tables */}
      {activeSubTab === 'raw_db' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
            <h4 className="text-sm font-bold text-slate-900 mb-3 font-mono flex items-center justify-between">
              <span>Isi Fisik Tabel `users` di Database MySQL</span>
              <span className="text-xs font-normal text-slate-500">Total {rawDb.users.length} akun</span>
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 font-mono text-slate-600">
                    <th className="py-2 px-3">id</th>
                    <th className="py-2 px-3">username</th>
                    <th className="py-2 px-3">nomor_telepon</th>
                    <th className="py-2 px-3">divisi_pkl</th>
                    <th className="py-2 px-3">pembimbing</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                  {rawDb.users.map((u) => (
                    <tr key={u.id} className={currentUser && u.id === currentUser.id ? 'bg-blue-50/50' : ''}>
                      <td className="py-2 px-3 font-bold text-blue-900">{u.id}</td>
                      <td className="py-2 px-3 font-sans font-medium text-slate-900">{u.username}</td>
                      <td className="py-2 px-3 text-slate-700">{u.nomor_telepon}</td>
                      <td className="py-2 px-3 text-slate-600 font-sans">{u.divisi_pkl}</td>
                      <td className="py-2 px-3 text-slate-600 font-sans">{u.nama_pembimbing}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
            <h4 className="text-sm font-bold text-slate-900 mb-3 font-mono flex items-center justify-between">
              <span>Isi Fisik Tabel `logbooks` (Menyimpan Kegiatan Seluruh Pengguna)</span>
              <span className="text-xs font-normal text-slate-500">Total {rawDb.logbooks.length} records</span>
            </h4>
            <p className="text-xs text-slate-500 mb-3">
              Perhatikan bahwa tabel ini memuat data dari semua peserta secara bersamaan. Hanya query dengan klausul <code className="font-mono bg-slate-100 px-1 py-0.5 rounded text-rose-700">WHERE user_id = {currentUser?.id}</code> yang membuat dashboard peserta hanya menampilkan data miliknya sendiri.
            </p>
            <div className="overflow-x-auto max-h-96">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 font-mono text-slate-600">
                    <th className="py-2 px-3">id</th>
                    <th className="py-2 px-3 bg-blue-50/80">user_id</th>
                    <th className="py-2 px-3">tanggal</th>
                    <th className="py-2 px-3">nama_kegiatan</th>
                    <th className="py-2 px-3">durasi</th>
                    <th className="py-2 px-3">kategori</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                  {rawDb.logbooks.map((l) => {
                    const isCurrent = currentUser && l.user_id === currentUser.id;
                    return (
                      <tr key={l.id} className={isCurrent ? 'bg-emerald-50/40' : ''}>
                        <td className="py-2 px-3 font-bold">{l.id}</td>
                        <td className="py-2 px-3 font-bold text-blue-900 bg-blue-50/40">
                          {l.user_id} {isCurrent && '(Saya)'}
                        </td>
                        <td className="py-2 px-3 text-slate-600">{l.tanggal}</td>
                        <td className="py-2 px-3 font-sans text-slate-900 font-medium truncate max-w-xs">
                          {l.nama_kegiatan}
                        </td>
                        <td className="py-2 px-3 text-slate-600">{l.durasi_jam} Jam</td>
                        <td className="py-2 px-3 font-sans text-slate-500">{l.kategori}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
