/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp, AppTab, AppPage } from '../../context/AppContext';
import { Sprout, Home, Leaf, Utensils, Award, User, LogOut, Settings, Clock, Heart, ClipboardList } from 'lucide-react';

export const TopNav: React.FC = () => {
  const { user, activeTab, navigateTo, logout } = useApp();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const navItems = [
    { key: 'home' as AppTab, label: '首页', icon: Home, page: 'home-main' as AppPage },
    { key: 'herbs' as AppTab, label: '药材', icon: Leaf, page: 'home-main' as AppPage }, // handled by changing tab
    { key: 'recipes' as AppTab, label: '食谱', icon: Utensils, page: 'home-main' as AppPage },
    { key: 'workouts' as AppTab, label: '养生', icon: Award, page: 'home-main' as AppPage },
    { key: 'profile' as AppTab, label: '我的', icon: User, page: 'home-main' as AppPage }
  ];

  const handleNavClick = (tab: AppTab) => {
    if (tab === 'home') {
      navigateTo('home-main', 'home');
    } else if (tab === 'herbs') {
      navigateTo('home-main', 'herbs');
    } else if (tab === 'recipes') {
      navigateTo('home-main', 'recipes');
    } else if (tab === 'workouts') {
      navigateTo('home-main', 'workouts');
    } else if (tab === 'profile') {
      navigateTo('home-main', 'profile');
    }
  };

  const handleDropdownItem = (page: AppPage, tab?: AppTab) => {
    navigateTo(page, tab);
    setDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 h-[72px] backdrop-blur-3xl bg-[#fbf9f8]/80 border-b border-black/5 shadow-xs transition-all duration-300">
      <div className="max-w-7xl mx-auto h-full px-6 flex items-center justify-between">
        
        {/* Logo */}
        <div 
          onClick={() => navigateTo('home-main', 'home')} 
          className="flex items-center gap-2 cursor-pointer group"
          id="nav_logo"
        >
          <div className="w-10 h-10 rounded-xl bg-[#7ba23f]/10 flex items-center justify-center text-[#466805] group-hover:bg-[#7ba23f]/20 transition-all">
            <Sprout className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-[#466805] tracking-tight text-lg leading-tight font-sans">
              Balance
            </span>
            <span className="text-[10px] tracking-wider text-[#747968] font-bold">
              智慧中医健康助手
            </span>
          </div>
        </div>

        {/* Middle Navigation */}
        <nav className="flex items-center gap-1 md:gap-4 h-full" id="nav_links">
          {navItems.map((item) => {
            const isActive = activeTab === item.key;
            const Icon = item.icon;
            
            return (
              <button
                key={item.key}
                id={`nav_link_${item.key}`}
                onClick={() => handleNavClick(item.key)}
                className={`flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
                  isActive 
                    ? 'text-[#466805] bg-[#7ba23f]/10' 
                    : 'text-[#44493a] hover:text-[#466805] hover:bg-[#efeded]/50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#466805]' : 'text-[#747968]'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* User profile dropdown trigger */}
        <div className="relative" id="nav_user_container">
          <div 
            onMouseEnter={() => setDropdownOpen(true)}
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 h-10 px-2 rounded-full border border-black/5 bg-white cursor-pointer hover:bg-neutral-50 hover:shadow-xs transition-all"
            id="nav_user_profile"
          >
            <img 
              src={user.avatar} 
              alt={user.name} 
              className="w-8 h-8 rounded-full object-cover border border-black/10" 
              referrerPolicy="no-referrer"
            />
            <span className="hidden sm:inline text-xs font-bold text-[#1b1c1c] max-w-[80px] truncate">
              {user.name}
            </span>
          </div>

          {/* User Menu Dropdown */}
          {dropdownOpen && (
            <div 
              onMouseLeave={() => setDropdownOpen(false)}
              className="absolute right-0 top-12 w-52 bg-white/95 backdrop-blur-md border border-black/5 rounded-2xl shadow-xl p-2 flex flex-col gap-0.5 animate-fadeInUp animate-duration-200 z-50"
              id="nav_user_dropdown"
            >
              <div className="px-3 py-2 border-b border-black/5 mb-1.5">
                <p className="text-xs font-bold text-[#1b1c1c] truncate">{user.name}</p>
                <p className="text-[10px] text-[#747968] font-mono mt-0.5">{user.level}</p>
              </div>

              <button
                onClick={() => handleDropdownItem('home-main', 'profile')}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-[#44493a] hover:text-[#466805] hover:bg-[#7ba23f]/10 text-left cursor-pointer"
              >
                <User className="w-3.5 h-3.5" />
                <span>个人中心</span>
              </button>

              <button
                onClick={() => handleDropdownItem('favorites', 'profile')}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-[#44493a] hover:text-[#466805] hover:bg-[#7ba23f]/10 text-left cursor-pointer"
              >
                <Heart className="w-3.5 h-3.5" />
                <span>我的收藏</span>
              </button>

              <button
                onClick={() => handleDropdownItem('history', 'profile')}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-[#44493a] hover:text-[#466805] hover:bg-[#7ba23f]/10 text-left cursor-pointer"
              >
                <Clock className="w-3.5 h-3.5" />
                <span>咨询历史</span>
              </button>

              <button
                onClick={() => handleDropdownItem('settings', 'profile')}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-[#44493a] hover:text-[#466805] hover:bg-[#7ba23f]/10 text-left cursor-pointer"
              >
                <Settings className="w-3.5 h-3.5" />
                <span>偏好设置</span>
              </button>

              <button
                onClick={() => handleDropdownItem('constitution-test', 'profile')}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-[#44493a] hover:text-[#466805] hover:bg-[#7ba23f]/10 text-left cursor-pointer"
              >
                <ClipboardList className="w-3.5 h-3.5" />
                <span>体质自测</span>
              </button>

              <hr className="border-black/5 my-1" />

              <button
                onClick={() => {
                  setDropdownOpen(false);
                  logout();
                }}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-[#dc2626] hover:bg-rose-50 text-left cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>退出登录</span>
              </button>
            </div>
          )}
        </div>

      </div>
    </header>
  );
};
