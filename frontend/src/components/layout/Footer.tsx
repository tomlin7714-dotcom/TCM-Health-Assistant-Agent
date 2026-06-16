/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useApp } from '../../context/AppContext';
import { Sprout } from 'lucide-react';

export const Footer: React.FC = () => {
  const { navigateTo } = useApp();

  return (
    <footer className="bg-[#fbf9f8] border-t border-black/5 mt-auto py-12" id="global_footer">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Core Layout */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Col 1: Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#7ba23f]/10 flex items-center justify-center text-[#466805]">
                <Sprout className="w-4.5 h-4.5" />
              </div>
              <span className="font-extrabold text-[#466805] tracking-tight text-base font-sans">
                Balance
              </span>
            </div>
            <p className="text-xs text-[#747968] leading-relaxed max-w-sm">
              融合千年中医学古老调养智慧，与现代前沿 AI 智能识别算法。
              专为每一位注重生活品质的现代都市人提供一站式、个性化、无侵入的心身平衡调摄服务。
            </p>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="flex flex-col gap-2">
            <h4 className="text-xs font-bold text-[#1b1c1c] uppercase tracking-wider">
              系统功能
            </h4>
            <div className="flex flex-col gap-1.5 mt-2">
              <button onClick={() => navigateTo('home-main', 'home')} className="text-xs text-[#747968] hover:text-[#466805] text-left cursor-pointer">
                智能健康咨询
              </button>
              <button onClick={() => navigateTo('home-main', 'herbs')} className="text-xs text-[#747968] hover:text-[#466805] text-left cursor-pointer">
                本草神农药材库
              </button>
              <button onClick={() => navigateTo('home-main', 'recipes')} className="text-xs text-[#747968] hover:text-[#466805] text-left cursor-pointer">
                四时五味膳养食谱
              </button>
              <button onClick={() => navigateTo('home-main', 'workouts')} className="text-xs text-[#747968] hover:text-[#466805] text-left cursor-pointer">
                易筋导引静坐锻炼
              </button>
            </div>
          </div>

          {/* Col 3: Support & Information */}
          <div className="flex flex-col gap-2">
            <h4 className="text-xs font-bold text-[#1b1c1c] uppercase tracking-wider">
              用户支持
            </h4>
            <div className="flex flex-col gap-1.5 mt-2">
              <button onClick={() => navigateTo('feedback')} className="text-xs text-[#747968] hover:text-[#466805] text-left cursor-pointer">
                意见与反馈建议
              </button>
              <button onClick={() => navigateTo('about')} className="text-xs text-[#747968] hover:text-[#466805] text-left cursor-pointer">
                关于中医学助手
              </button>
              <button onClick={() => navigateTo('settings')} className="text-xs text-[#747968] hover:text-[#466805] text-left cursor-pointer">
                隐私安全设置
              </button>
              <button onClick={() => navigateTo('constitution-test')} className="text-xs text-[#747968] hover:text-[#466805] text-left cursor-pointer">
                系统体质测评
              </button>
            </div>
          </div>

        </div>

        {/* Separator */}
        <hr className="border-black/5 mb-6" />

        {/* Footer bottom */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#747968] font-mono">
          <div>
            © 2026 中医学养生助手 版权所有 · Balance Team.
          </div>
          <div className="flex items-center gap-3">
            <span className="px-2 py-0.5 rounded-full bg-[#efeded] text-[#44493a] text-[10px] font-semibold uppercase tracking-widest">
              Version 2.4.0 (GOLD)
            </span>
            <span>匠心调理 · 守护安康</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
