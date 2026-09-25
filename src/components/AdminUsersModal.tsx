import React, { useState } from 'react';
import {
  X,
  UserPlus,
  Shield,
  ShieldCheck,
  Trash2,
  Lock,
  KeyRound,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  Users
} from 'lucide-react';
import { AdminUser } from '../types';
import { PRIMARY_ADMIN_EMAIL } from '../data/adminUsers';

interface AdminUsersModalProps {
  isOpen: boolean;
  onClose: () => void;
  adminUsers: AdminUser[];
  onAddAdminUser: (newUser: Omit<AdminUser, 'id' | 'createdAt'>) => void;
  onRemoveAdminUser: (userId: string) => void;
  currentAdminEmail?: string;
}

export const AdminUsersModal: React.FC<AdminUsersModalProps> = ({
  isOpen,
  onClose,
  adminUsers,
  onAddAdminUser,
  onRemoveAdminUser,
  currentAdminEmail,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<'Admin' | 'Super Admin'>('Admin');
  const [formError, setFormError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  // Generate strong random password
  const handleGeneratePassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%&*';
    let generated = '';
    for (let i = 0; i < 12; i++) {
      generated += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(generated);
    setShowPassword(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setSuccessMsg(null);

    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPassword = password.trim();

    if (!trimmedName) {
      setFormError('Please enter the administrator’s full name.');
      return;
    }

    if (!trimmedEmail || !trimmedEmail.includes('@') || !trimmedEmail.includes('.')) {
      setFormError('Please enter a valid business email address.');
      return;
    }

    if (adminUsers.some((u) => u.email.toLowerCase() === trimmedEmail)) {
      setFormError(`An administrator with email "${trimmedEmail}" already exists.`);
      return;
    }

    if (trimmedPassword.length < 6) {
      setFormError('Password must be at least 6 characters long.');
      return;
    }

    onAddAdminUser({
      name: trimmedName,
      email: trimmedEmail,
      password: trimmedPassword,
      role: role,
      isSuperAdmin: role === 'Super Admin',
      addedBy: currentAdminEmail || PRIMARY_ADMIN_EMAIL,
    });

    setName('');
    setEmail('');
    setPassword('');
    setSuccessMsg(`Successfully granted admin privileges to ${trimmedName} (${trimmedEmail})!`);
    setTimeout(() => setSuccessMsg(null), 4000);
  };

  const handleRemove = (user: AdminUser) => {
    if (user.isSuperAdmin || user.email.toLowerCase() === PRIMARY_ADMIN_EMAIL.toLowerCase()) {
      alert('The primary administrator account cannot be deleted.');
      return;
    }

    if (
      confirm(
        `Are you sure you want to revoke administrative access for ${user.name} (${user.email})?`
      )
    ) {
      onRemoveAdminUser(user.id);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="bg-[#004372] px-6 py-5 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
              <Users className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base sm:text-lg font-bold text-white leading-tight">
                  Admin User Management
                </h2>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  {adminUsers.length} Authorized
                </span>
              </div>
              <p className="text-xs text-sky-200 mt-0.5">
                Authorized by <strong className="text-white">{PRIMARY_ADMIN_EMAIL}</strong>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-white/70 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1">
          {/* Informative Security Notice */}
          <div className="bg-sky-50 border border-sky-200 rounded-xl p-3.5 text-xs text-sky-900 flex items-start space-x-3">
            <ShieldCheck className="w-4 h-4 text-[#0076BD] shrink-0 mt-0.5" />
            <div>
              <strong>Administrative Capabilities:</strong> Users added below receive full administrative capabilities across the Co-Branding Studio. They can replace master guide PDFs, replace social graphics, update wealth materials, and log into the admin portal using their assigned credentials.
            </div>
          </div>

          {/* Grid Layout: Add Form (Left) & Active Users (Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* LEFT: Add Administrator Form (5 cols) */}
            <div className="lg:col-span-5 bg-slate-50 rounded-xl border border-slate-200 p-4 sm:p-5 space-y-4">
              <div className="flex items-center space-x-2 pb-2 border-b border-slate-200">
                <UserPlus className="w-4 h-4 text-[#0076BD]" />
                <h3 className="text-sm font-bold text-slate-900">
                  Add User with Admin Capabilities
                </h3>
              </div>

              {formError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-start space-x-2 text-xs text-red-700">
                  <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <span>{formError}</span>
                </div>
              )}

              {successMsg && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start space-x-2 text-xs text-emerald-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{successMsg}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Sarah Jenkins"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#0076BD] focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. sarah.jenkins@simplicitygroup.com"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#0076BD] focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                      Admin Password
                    </label>
                    <button
                      type="button"
                      onClick={handleGeneratePassword}
                      className="text-[10px] font-semibold text-[#0076BD] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <KeyRound className="w-3 h-3" />
                      Generate
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Minimum 6 characters"
                      className="w-full pl-3 pr-9 py-2 rounded-lg border border-slate-300 text-xs sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#0076BD] focus:border-transparent transition-all font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                      title={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Admin Role
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#0076BD] focus:border-transparent transition-all"
                  >
                    <option value="Admin">Administrator (Master Assets & Materials)</option>
                    <option value="Super Admin">Super Administrator (Full Management)</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-[#0076BD] hover:bg-[#005f99] shadow-sm transition-all cursor-pointer mt-2"
                >
                  <UserPlus className="w-4 h-4 mr-1.5" />
                  Grant Admin Privileges
                </button>
              </form>
            </div>

            {/* RIGHT: Active Administrators List (7 cols) */}
            <div className="lg:col-span-7 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-emerald-600" />
                  <h3 className="text-sm font-bold text-slate-900">
                    Active Administrators ({adminUsers.length})
                  </h3>
                </div>
                <span className="text-[11px] text-slate-400">
                  Instant sign-in access enabled
                </span>
              </div>

              <div className="space-y-2.5">
                {adminUsers.map((user) => {
                  const isPrimary =
                    user.isSuperAdmin && user.email.toLowerCase() === PRIMARY_ADMIN_EMAIL.toLowerCase();

                  // Compute initials
                  const initials = user.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .toUpperCase()
                    .slice(0, 2) || 'AD';

                  return (
                    <div
                      key={user.id}
                      className={`p-3.5 rounded-xl border transition-all flex items-center justify-between ${
                        isPrimary
                          ? 'bg-emerald-50/50 border-emerald-200 shadow-xs'
                          : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center space-x-3 min-w-0 pr-3">
                        {/* Avatar */}
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                            isPrimary
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : 'bg-[#004372] text-white'
                          }`}
                        >
                          {initials}
                        </div>

                        {/* Name & Email */}
                        <div className="min-w-0">
                          <div className="flex items-center space-x-2">
                            <span className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                              {user.name}
                            </span>
                            {isPrimary ? (
                              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-0.5">
                                <ShieldCheck className="w-2.5 h-2.5" />
                                Super Admin
                              </span>
                            ) : (
                              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-md bg-sky-100 text-sky-800 border border-sky-200">
                                {user.role}
                              </span>
                            )}
                          </div>

                          <div className="text-[11px] text-slate-500 truncate mt-0.5">
                            {user.email}
                          </div>

                          <div className="text-[10px] text-slate-400 mt-0.5">
                            Added: {new Date(user.createdAt).toLocaleDateString()}
                            {user.addedBy && ` • By: ${user.addedBy}`}
                          </div>
                        </div>
                      </div>

                      {/* Right Action */}
                      <div className="shrink-0 flex items-center space-x-2">
                        {isPrimary ? (
                          <span
                            className="inline-flex items-center text-[10px] font-semibold text-emerald-700 bg-emerald-100/70 px-2 py-1 rounded-md"
                            title="Primary system administrator cannot be removed"
                          >
                            <Lock className="w-3 h-3 mr-1 text-emerald-600" />
                            Protected
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleRemove(user)}
                            className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200 transition-colors cursor-pointer"
                            title={`Revoke admin privileges for ${user.name}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
          <span className="text-slate-500">
            Admins can authenticate immediately in the <strong>Admin Sign In</strong> dialog.
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold rounded-lg bg-[#004372] hover:bg-[#003459] text-white shadow-xs transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
