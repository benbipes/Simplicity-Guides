import React, { useState } from 'react';
import { Lock, X, ShieldCheck, AlertCircle } from 'lucide-react';

import { AdminUser } from '../types';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: AdminUser) => void;
  adminUsers?: AdminUser[];
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  adminUsers = [],
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedUser = username.trim().toLowerCase();
    const matchedUser = adminUsers.find(
      (u) => u.email.toLowerCase() === trimmedUser && u.password === password
    );

    if (matchedUser) {
      onLoginSuccess(matchedUser);
      setUsername('');
      setPassword('');
      onClose();
    } else if (trimmedUser === 'ben.bipes@simplicitygroup.com' && password === 'dept078LEES') {
      const defaultBen: AdminUser = {
        id: 'admin-ben-bipes',
        name: 'Ben Bipes',
        email: 'ben.bipes@simplicitygroup.com',
        password: 'dept078LEES',
        role: 'Super Admin',
        isSuperAdmin: true,
        createdAt: '2026-01-01T00:00:00.000Z',
      };
      onLoginSuccess(defaultBen);
      setUsername('');
      setPassword('');
      onClose();
    } else {
      setError('Invalid username or password. Please verify your admin credentials.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="bg-[#004372] px-6 py-5 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
              <Lock className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white leading-tight">Admin Authentication</h2>
              <p className="text-xs text-sky-200">Simplicity Group Guide Studio</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <p className="text-xs text-slate-600 leading-relaxed">
            Enter administrator credentials to unlock master PDF file management and demo advisor preloading tools.
          </p>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-start space-x-2 text-xs text-red-700">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Admin Email / Username
            </label>
            <input
              type="text"
              required
              autoFocus
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="ben.bipes@simplicitygroup.com"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#0076BD] focus:border-transparent transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Admin Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#0076BD] focus:border-transparent transition-all"
            />
          </div>

          <div className="pt-2 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 text-xs font-bold text-white bg-[#0076BD] hover:bg-[#005a91] rounded-xl shadow-md transition-all active:scale-95"
            >
              <ShieldCheck className="w-4 h-4 mr-1.5" />
              Sign In as Admin
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
