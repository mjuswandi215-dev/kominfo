import React, { useState } from 'react';
import { User } from '../types/logbook';
import {
  Bell,
  Settings,
  ArrowRightLeft,
  ShieldCheck,
  LogOut
} from 'lucide-react';

interface HeaderProps {
  currentUser: User | null;
  availableUsers: User[];
  onSwitchUser: (userId: number) => void;
  onOpenLoginModal: () => void;
  onOpenEditProfile?: () => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  availableUsers,
  onSwitchUser,
  onOpenLoginModal,
  onOpenEditProfile,
  onLogout,
}) => {
  const [showSwitchDropdown, setShowSwitchDropdown] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#0b2239] border-b border-slate-800 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 h-16">
          {/* Left: Kominfo Circular Emblem & Title matching requested logo & text */}
          <div className="flex items-center gap-3 font-quicksand">
            <div className="w-11 h-11 rounded-full bg-white p-1 border-2 border-orange-400 flex items-center justify-center shrink-0 shadow-sm overflow-hidden">
              <img
                src="/assets/aistudio/logo-kominfo_869d4e21.png"
                alt="Logo Kominfo"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm sm:text-base lg:text-lg font-bold tracking-tight text-white whitespace-nowrap font-quicksand">
                  Logbook Praktik kerja lapangan
                </h1>
              </div>
              <p className="text-[11px] sm:text-xs text-blue-100 font-semibold tracking-normal hidden sm:block font-quicksand">
                Dinas Komunikasi, Informatika dan Persandian (Diskominfo) Kabupaten Lombok Timur
              </p>
              <p className="text-[10px] text-blue-100 font-semibold tracking-normal sm:hidden font-quicksand">
                Diskominfo Kab. Lombok Timur
              </p>
            </div>
          </div>

          {/* Right: User Profile, Notifications & Quick Switcher */}
          <div className="flex items-center gap-3 shrink-0">
            {currentUser ? (
              <div className="relative flex items-center gap-3">
                {/* Switcher & Profile info */}
                <button
                  onClick={() => setShowSwitchDropdown(!showSwitchDropdown)}
                  className="flex items-center gap-2.5 p-1 sm:px-2.5 sm:py-1 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 transition-colors text-left"
                  title="Ganti Peserta (Uji Isolasi Multi-User)"
                >
                  <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden border border-orange-400/80 shrink-0">
                    <img
                      src={currentUser.avatar_url || '/src/assets/images/avatar_pkl_male_1793886103683.jpg'}
                      alt={currentUser.username}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="hidden sm:block">
                    <div className="text-xs font-bold text-white leading-tight flex items-center gap-1.5">
                      <span>{currentUser.nama_lengkap || currentUser.username}</span>
                      {currentUser.role === 'admin' && (
                        <span className="text-[9px] bg-blue-500 text-white font-bold px-1.5 py-0.2 rounded font-mono">
                          Admin
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-blue-200 leading-tight">
                      {currentUser.role === 'admin'
                        ? 'Pengelola Magang Diskominfo'
                        : `Peserta Magang · ${currentUser.instansi_pendidikan.split('—')[0]}`}
                    </div>
                  </div>
                  <ArrowRightLeft className="w-3.5 h-3.5 text-slate-300 ml-1 hidden sm:block" />
                </button>

                {/* Notifications Bell */}
                <button
                  className="p-2 text-slate-300 hover:text-white rounded-lg hover:bg-white/10 transition-colors relative"
                  title="Pemberitahuan Sistem"
                >
                  <Bell className="w-4 h-4" />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#e8732a]" />
                </button>

                {/* Settings Cog */}
                <button
                  onClick={() => {
                    if (onOpenEditProfile) {
                      onOpenEditProfile();
                    } else {
                      setShowSwitchDropdown(!showSwitchDropdown);
                    }
                  }}
                  className="p-2 text-slate-300 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
                  title="Ubah Profil, DPL & PL"
                >
                  <Settings className="w-4 h-4" />
                </button>

                {/* Switch User Dropdown */}
                {showSwitchDropdown && (
                  <div className="absolute right-0 top-12 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 text-slate-900 font-quicksand">
                    <div className="px-3 py-2 border-b border-slate-100 mb-1">
                      <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        <span>Pilih Akun (Admin / Anak Magang)</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Buktikan isolasi data database (WHERE user_id):
                      </p>
                    </div>

                    <div className="space-y-1">
                      {availableUsers.map((u) => {
                        const isCurrent = u.id === currentUser.id;
                        return (
                          <button
                            key={u.id}
                            onClick={() => {
                              onSwitchUser(u.id);
                              setShowSwitchDropdown(false);
                            }}
                            className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center gap-2.5 transition-colors ${
                              isCurrent
                                ? 'bg-orange-50 text-[#e8732a] font-bold'
                                : 'hover:bg-slate-50 text-slate-700'
                            }`}
                          >
                            <div className="w-6 h-6 rounded-full bg-slate-200 overflow-hidden shrink-0">
                              <img
                                src={u.avatar_url || '/src/assets/images/avatar_pkl_male_1793886103683.jpg'}
                                alt={u.username}
                                className="w-full h-full object-cover"
                                referrerPolicy="no-referrer"
                              />
                            </div>
                            <div className="flex-1 truncate">
                              <div className="truncate flex items-center gap-1 font-semibold">
                                <span>{u.username}</span>
                                {u.role === 'admin' && (
                                  <span className="text-[9px] bg-blue-700 text-white font-mono px-1 rounded">
                                    Admin
                                  </span>
                                )}
                              </div>
                              <div className="text-[10px] text-slate-400 truncate">{u.instansi_pendidikan}</div>
                            </div>
                            {isCurrent && (
                              <span className="text-[10px] bg-[#e8732a] text-white px-1.5 py-0.5 rounded font-mono">
                                Aktif
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {onOpenEditProfile && (
                      <div className="px-1 pt-1.5 border-t border-slate-100 mt-1">
                        <button
                          type="button"
                          onClick={() => {
                            setShowSwitchDropdown(false);
                            onOpenEditProfile();
                          }}
                          className="w-full py-1.5 px-2.5 bg-orange-50 hover:bg-orange-100 text-[#e8732a] rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                        >
                          <span>✏️ Ubah Profil & Foto Peserta</span>
                        </button>
                      </div>
                    )}

                    <div className="border-t border-slate-100 mt-2 pt-2 flex items-center justify-between px-2">
                      <button
                        onClick={() => {
                          setShowSwitchDropdown(false);
                          onOpenLoginModal();
                        }}
                        className="text-xs text-[#0f2d4a] hover:underline font-semibold"
                      >
                        + Tambah Peserta
                      </button>
                      <button
                        onClick={() => {
                          setShowSwitchDropdown(false);
                          onLogout();
                        }}
                        className="text-xs text-rose-600 hover:text-rose-700 flex items-center gap-1 font-semibold"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Keluar</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={onOpenLoginModal}
                className="px-4 py-2 bg-[#e8732a] hover:bg-[#d4621b] text-white rounded-lg text-xs font-semibold shadow-xs"
              >
                Masuk / Registrasi
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
