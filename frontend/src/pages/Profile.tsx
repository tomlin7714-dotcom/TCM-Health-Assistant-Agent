/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useApp } from '../context/AppContext';
import { Award, User, Bell, ClipboardList, MessageSquare, Clock, Shield, Info, LogOut, ChevronRight, Compass } from 'lucide-react';
import { motion } from 'motion/react';

export const Profile: React.FC = () => {
  const { user, favorites, history, navigateTo, logout } = useApp();

  // Calculate sum of favorites
  const totalFavorites = favorites.herbs.length + favorites.recipes.length + favorites.workouts.length;

  const menuItems = [
    { 
      key: 'reminders', 
      label: '健康重要提醒', 
      sub: '规划每日时令养气提醒', 
      icon: Bell, 
      color: 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100/30' 
    },
    { 
      key: 'constitution-test', 
      label: '中医体质自测', 
      sub: `当前评测：${user.constitution}`, 
      icon: ClipboardList, 
      color: 'bg-indigo-50 text-indigo-700 hover:bg-indigo-150/30' 
    },
    { 
      key: 'history', 
      label: '古医咨询历史', 
      sub: `已留存 ${history.length} 条调养药案`, 
      icon: Clock, 
      color: 'bg-purple-50 text-purple-700 hover:bg-purple-150/30' 
    },
    { 
      key: 'feedback', 
      label: '反馈与建议意见' , 
      sub: '协助我们雕琢更好体验', 
      icon: MessageSquare, 
      color: 'bg-orange-50 text-orange-700 hover:bg-orange-150/30' 
    },
    { 
      key: 'settings', 
      label: '系统与隐私设置', 
      sub: '密码安全通知及偏好修改', 
      icon: Shield, 
      color: 'bg-sky-50 text-sky-700 hover:bg-sky-150/30' 
    },
    { 
      key: 'about', 
      label: '关于 Balance 助手', 
      sub: '产品使命说明与版本介绍', 
      icon: Info, 
      color: 'bg-slate-100 text-slate-700 hover:bg-slate-150/30' 
    }
  ];

  return (
    <div id="profile_view" className="max-w-2xl mx-auto px-6 py-8 w-full space-y-6">
      
      {/* Visual grand card */}
      <div className="bg-gradient-to-br from-[#466805] to-[#7ba23f] text-white p-6 rounded-3xl shadow-md relative overflow-hidden flex flex-col md:flex-row items-center gap-6">
        
        {/* Profile picture */}
        <div className="relative shrink-0">
          <img 
            src={user.avatar} 
            alt={user.name} 
            className="w-20 h-20 rounded-full object-cover border-4 border-white/20 shadow-xl"
            referrerPolicy="no-referrer"
          />
          <div className="absolute right-0 bottom-0 w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center border-2 border-white shadow-md">
            <Award className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* User textual specs */}
        <div className="text-center md:text-left space-y-1.5 flex-1 min-w-0">
          <div className="flex flex-col md:flex-row md:items-baseline gap-1.5">
            <h2 className="text-xl font-black">{user.name}</h2>
            <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#c5f183] text-[#466805] text-[10px] font-black uppercase tracking-wider self-center md:self-auto">
              {user.level}
            </span>
          </div>
          <p className="text-xs text-neutral-200 font-medium">
            尊享名医本草膳食调摄权益及 24小时 AI 智能辨证咨询。
          </p>
        </div>
      </div>

      {/* Row of stats grids */}
      <div className="grid grid-cols-3 gap-3">
        
        {/* Stats A: History */}
        <div 
          onClick={() => navigateTo('history', 'profile')}
          className="bg-white border border-black/5 p-4 rounded-2xl text-center shadow-xs cursor-pointer hover:border-[#7ba23f]/20 transition-all"
        >
          <span className="text-xl font-black text-[#1b1c1c] font-mono block">
            {history.length}
          </span>
          <span className="text-[10px] text-[#747968] font-bold mt-1 block">咨询记录</span>
        </div>

        {/* Stats B: Favorites */}
        <div 
          onClick={() => navigateTo('favorites', 'profile')}
          className="bg-white border border-black/5 p-4 rounded-2xl text-center shadow-xs cursor-pointer hover:border-[#7ba23f]/20 transition-all"
        >
          <span className="text-xl font-black text-[#1b1c1c] font-mono block">
            {totalFavorites}
          </span>
          <span className="text-[10px] text-[#747968] font-bold mt-1 block">我的收藏</span>
        </div>

        {/* Stats C: Longevity */}
        <div className="bg-white border border-black/5 p-4 rounded-2xl text-center shadow-xs">
          <span className="text-xl font-black text-[#466805] font-mono block">
            236天
          </span>
          <span className="text-[10px] text-[#747968] font-bold mt-1 block">调护天数</span>
        </div>

      </div>

      {/* Vertical Navigation cells */}
      <div className="bg-white border border-black/5 rounded-3xl p-4 shadow-sm flex flex-col gap-1.5" id="profile_menu">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.key}
              onClick={() => navigateTo(item.key as any, 'profile')}
              className="w-full p-3.5 rounded-2xl flex items-center justify-between text-left hover:bg-neutral-50/50 transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-3.5">
                {/* Icon wrapper */}
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${item.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                
                <div>
                  <p className="text-xs font-bold text-[#1b1c1c] group-hover:text-[#466805] transition-all">
                    {item.label}
                  </p>
                  <p className="text-[10px] text-[#747968] font-semibold mt-0.5">
                    {item.sub}
                  </p>
                </div>
              </div>

              <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:text-neutral-600 transition-all" />
            </button>
          );
        })}
      </div>

      {/* Red Log out buttons */}
      <div className="pt-2">
        <button
          onClick={logout}
          className="w-full h-11 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          id="profile_logout_button"
        >
          <LogOut className="w-4 h-4" />
          <span>退出安全登录账号</span>
        </button>
      </div>

    </div>
  );
};
