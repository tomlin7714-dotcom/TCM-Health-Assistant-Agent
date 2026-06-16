/**
 * Profile — 个人中心，支持修改头像和昵称
 */
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Award, User, Bell, ClipboardList, MessageSquare, Clock, Shield, Info, LogOut, ChevronRight, Camera, Check, X, Pencil, Upload } from 'lucide-react';
import { updateMe, uploadAvatar } from '../api/services';

export const Profile: React.FC = () => {
  const { user, updateUser, favorites, history, navigateTo, logout, showToast } = useApp();

  const [editingName, setEditingName] = useState(false);
  const [editName, setEditName] = useState(user.name);
  const [editingAvatar, setEditingAvatar] = useState(false);
  const [editAvatar, setEditAvatar] = useState(user.avatar);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const totalFavorites = favorites.herbs.length + favorites.recipes.length + favorites.workouts.length;

  const handleSaveName = async () => {
    const trimmed = editName.trim();
    if (!trimmed || trimmed === user.name) {
      setEditingName(false);
      return;
    }
    setSaving(true);
    try {
      await updateMe({ name: trimmed });
      updateUser({ name: trimmed });
      showToast('昵称已更新', 'success');
    } catch {
      showToast('保存失败，请重试', 'error');
    } finally {
      setSaving(false);
      setEditingName(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      showToast('图片不能超过 2MB', 'error');
      return;
    }
    setUploading(true);
    try {
      const res = await uploadAvatar(file);
      const fullUrl = res.avatar_url.startsWith('http') ? res.avatar_url : window.location.origin + res.avatar_url;
      updateUser({ avatar: fullUrl });
      setEditAvatar(fullUrl);
      showToast('头像上传成功！', 'success');
    } catch {
      showToast('上传失败，请重试', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleSaveAvatar = async () => {
    const trimmed = editAvatar.trim();
    if (!trimmed) {
      showToast('请输入头像图片链接', 'error');
      return;
    }
    setSaving(true);
    try {
      await updateMe({ avatar: trimmed });
      updateUser({ avatar: trimmed });
      showToast('头像已更新', 'success');
    } catch {
      showToast('保存失败，请重试', 'error');
    } finally {
      setSaving(false);
      setEditingAvatar(false);
    }
  };

  const menuItems = [
    { key: 'reminders', label: '健康重要提醒', sub: '规划每日时令养气提醒', icon: Bell, color: 'bg-emerald-50 text-emerald-700' },
    { key: 'constitution-test', label: '中医体质自测', sub: `当前评测：${user.constitution}`, icon: ClipboardList, color: 'bg-indigo-50 text-indigo-700' },
    { key: 'history', label: '古医咨询历史', sub: `已留存 ${history.length} 条调养药案`, icon: Clock, color: 'bg-purple-50 text-purple-700' },
    { key: 'feedback', label: '反馈与建议意见', sub: '协助我们雕琢更好体验', icon: MessageSquare, color: 'bg-orange-50 text-orange-700' },
    { key: 'settings', label: '系统与隐私设置', sub: '密码安全通知及偏好修改', icon: Shield, color: 'bg-sky-50 text-sky-700' },
    { key: 'about', label: '关于 Balance 助手', sub: '产品使命说明与版本介绍', icon: Info, color: 'bg-slate-100 text-slate-700' },
  ];

  return (
    <div id="profile_view" className="max-w-2xl mx-auto px-6 py-8 w-full space-y-6">

      {/* Profile card */}
      <div className="bg-gradient-to-br from-[#466805] to-[#7ba23f] text-white p-6 rounded-3xl shadow-md relative overflow-hidden flex flex-col md:flex-row items-center gap-6">

        {/* Avatar — click to edit */}
        <div className="relative shrink-0 group cursor-pointer" onClick={() => { setEditAvatar(user.avatar); setEditingAvatar(true); }}>
          <img
            src={user.avatar}
            alt={user.name}
            className="w-20 h-20 rounded-full object-cover border-4 border-white/20 shadow-xl"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 rounded-full bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
            <Camera className="w-5 h-5 text-white" />
          </div>
          <div className="absolute right-0 bottom-0 w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center border-2 border-white shadow-md">
            <Award className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Name — click to edit */}
        <div className="text-center md:text-left space-y-1.5 flex-1 min-w-0">
          {editingName ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                maxLength={20}
                className="bg-white/20 border border-white/30 rounded-lg px-3 py-1.5 text-sm font-bold text-white placeholder-white/50 outline-none w-full max-w-[180px]"
                autoFocus
                onKeyDown={(e) => { if (e.key === 'Enter') handleSaveName(); if (e.key === 'Escape') setEditingName(false); }}
              />
              <button onClick={handleSaveName} disabled={saving} className="text-white hover:text-[#c5f183] transition-all"><Check className="w-4 h-4" /></button>
              <button onClick={() => setEditingName(false)} className="text-white/60 hover:text-white transition-all"><X className="w-4 h-4" /></button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 cursor-pointer group/name" onClick={() => { setEditName(user.name); setEditingName(true); }}>
              <h2 className="text-xl font-black">{user.name}</h2>
              <Pencil className="w-3.5 h-3.5 text-white/40 group-hover/name:text-white/80 transition-all" />
            </div>
          )}
          <div className="flex flex-col md:flex-row md:items-baseline gap-1.5">
            <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#c5f183] text-[#466805] text-[10px] font-black uppercase tracking-wider self-center md:self-auto">
              {user.level}
            </span>
          </div>
          <p className="text-xs text-neutral-200 font-medium">
            尊享名医本草膳食调摄权益及 24小时 AI 智能辨证咨询。
          </p>
        </div>
      </div>

      {/* Avatar edit modal */}
      {editingAvatar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setEditingAvatar(false)}>
          <div className="bg-white rounded-2xl p-6 shadow-xl max-w-sm w-full mx-4 space-y-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-sm font-black text-[#1b1c1c]">修改头像</h3>
            <div className="flex justify-center">
              <img src={editAvatar || user.avatar} alt="preview" className="w-24 h-24 rounded-full object-cover border-4 border-[#efeded]"
                onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'; }}
              />
            </div>

            {/* File upload button */}
            <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" className="hidden" />
            <button onClick={() => fileInputRef.current?.click()} disabled={uploading}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#7ba23f]/10 hover:bg-[#7ba23f]/20 text-[#466805] text-xs font-bold transition-all cursor-pointer">
              <Upload className="w-3.5 h-3.5" />
              {uploading ? '上传中...' : '从本地上传图片'}
            </button>

            <div className="flex items-center gap-2">
              <div className="flex-1 h-px bg-[#efeded]" />
              <span className="text-[10px] text-[#747968] font-medium">或粘贴链接</span>
              <div className="flex-1 h-px bg-[#efeded]" />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#44493a] mb-1.5">头像图片链接</label>
              <input
                type="text"
                value={editAvatar}
                onChange={(e) => setEditAvatar(e.target.value)}
                placeholder="粘贴图片URL地址，如 https://example.com/avatar.jpg"
                className="w-full bg-[#efeded] border border-transparent focus:border-[#7ba23f]/40 focus:bg-white rounded-xl px-4 py-2.5 text-sm outline-none transition-all"
                autoFocus
                onKeyDown={(e) => { if (e.key === 'Enter') handleSaveAvatar(); }}
              />
              <p className="text-[10px] text-[#747968] mt-1.5">支持 JPG/PNG/WEBP 格式图片链接</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setEditingAvatar(false)}
                className="flex-1 py-2.5 rounded-xl border border-black/5 text-xs font-bold text-[#747968] hover:bg-neutral-50 transition-all cursor-pointer">
                取消
              </button>
              <button onClick={handleSaveAvatar} disabled={saving}
                className="flex-1 py-2.5 rounded-xl bg-[#466805] hover:bg-[#466805]/90 disabled:bg-neutral-300 text-white text-xs font-bold transition-all cursor-pointer">
                {saving ? '保存中...' : '保存头像'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div onClick={() => navigateTo('history', 'profile')}
          className="bg-white border border-black/5 p-4 rounded-2xl text-center shadow-xs cursor-pointer hover:border-[#7ba23f]/20 transition-all">
          <span className="text-xl font-black text-[#1b1c1c] font-mono block">{history.length}</span>
          <span className="text-[10px] text-[#747968] font-bold mt-1 block">咨询记录</span>
        </div>
        <div onClick={() => navigateTo('favorites', 'profile')}
          className="bg-white border border-black/5 p-4 rounded-2xl text-center shadow-xs cursor-pointer hover:border-[#7ba23f]/20 transition-all">
          <span className="text-xl font-black text-[#1b1c1c] font-mono block">{totalFavorites}</span>
          <span className="text-[10px] text-[#747968] font-bold mt-1 block">我的收藏</span>
        </div>
        <div className="bg-white border border-black/5 p-4 rounded-2xl text-center shadow-xs">
          <span className="text-xl font-black text-[#466805] font-mono block">{history.length * 7 || '—'}天</span>
          <span className="text-[10px] text-[#747968] font-bold mt-1 block">调护天数</span>
        </div>
      </div>

      {/* Menu */}
      <div className="bg-white border border-black/5 rounded-3xl p-4 shadow-sm flex flex-col gap-1.5">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button key={item.key} onClick={() => navigateTo(item.key as any, 'profile')}
              className="w-full p-3.5 rounded-2xl flex items-center justify-between text-left hover:bg-neutral-50/50 transition-all cursor-pointer group">
              <div className="flex items-center gap-3.5">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${item.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#1b1c1c] group-hover:text-[#466805] transition-all">{item.label}</p>
                  <p className="text-[10px] text-[#747968] font-semibold mt-0.5">{item.sub}</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:text-neutral-600 transition-all" />
            </button>
          );
        })}
      </div>

      {/* Logout */}
      <div className="pt-2">
        <button onClick={logout}
          className="w-full h-11 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all cursor-pointer">
          <LogOut className="w-4 h-4" />
          <span>退出安全登录账号</span>
        </button>
      </div>

    </div>
  );
};
