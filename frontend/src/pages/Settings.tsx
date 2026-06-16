/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ArrowLeft, Shield, Lock, Bell, Trash2, HelpCircle, ChevronRight, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const Settings: React.FC = () => {
  const { goBack, showToast } = useApp();
  
  // Settings switches
  const [pushEnabled, setPushEnabled] = useState(true);
  const [privateEnabled, setPrivateEnabled] = useState(false);
  const [doubleLock, setDoubleLock] = useState(true);

  // Cache clearance emulated animation state
  const [cacheSize, setCacheSize] = useState<number>(124);
  const [isClearing, setIsClearing] = useState(false);

  const handleClearCache = () => {
    if (cacheSize === 0) {
      showToast('缓存已被排空，无需重复清理。', 'info');
      return;
    }

    setIsClearing(true);
    showToast('正在清扫中医诊断模型及图片缓存...', 'info');

    // Emulate tick down sequence
    let current = 124;
    const interval = setInterval(() => {
      current = Math.max(0, current - Math.floor(Math.random() * 15) - 5);
      setCacheSize(current);
      if (current === 0) {
        clearInterval(interval);
        setIsClearing(false);
        showToast('缓存文件清除完毕！', 'success');
      }
    }, 150);
  };

  return (
    <div id="settings_view" className="max-w-2xl mx-auto px-6 py-8 w-full space-y-6">
      
      {/* Page Header */}
      <div className="flex items-center gap-2 border-b border-black/5 pb-4">
        <button 
          onClick={goBack}
          className="w-8 h-8 rounded-full bg-white border border-black/5 hover:bg-neutral-100 flex items-center justify-center text-neutral-400 hover:text-neutral-600 transition-all mr-2 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-xl font-black text-[#1b1c1c]">偏好设置</h1>
          <p className="text-xs text-[#747968] font-semibold mt-0.5">配置您的中医诊断隐私、消息触达规范及缓存垃圾清扫。</p>
        </div>
      </div>

      {/* Block 1: Privacy and Locking */}
      <div className="bg-white border border-black/5 rounded-3xl p-6 shadow-xs space-y-4">
        <h3 className="text-sm font-extrabold text-[#44493a] tracking-wider uppercase flex items-center gap-1.5 border-b border-black/[0.03] pb-3">
          <Shield className="w-4 h-4 text-[#7ba23f]" />
          <span>医疗隐私安全调参</span>
        </h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold text-[#1b1c1c]">诊断报告端加密</h4>
              <p className="text-[10px] text-[#747968] font-semibold mt-0.5">对您所产生的舌面照片、脉象自述及AI方子进行本地级双盾加固。</p>
            </div>
            <button
              onClick={() => {
                setDoubleLock(!doubleLock);
                showToast(doubleLock ? '安全存储盾已关闭' : '安全存储盾部署开启', 'success');
              }}
              className={`w-11 h-6 rounded-full p-0.5 transition-colors cursor-pointer ${doubleLock ? 'bg-[#7ba23f]' : 'bg-neutral-200'}`}
            >
              <div className={`bg-white w-5 h-5 rounded-full shadow-xs transition-transform transform ${doubleLock ? 'translate-x-5' : 'translate-x-0'}`} />
            </button>
          </div>

          <div className="flex items-center justify-between border-t border-black/[0.03] pt-4">
            <div>
              <h4 className="text-xs font-bold text-[#1b1c1c]">匿名诊断学习共享</h4>
              <p className="text-[10px] text-[#747968] font-semibold mt-0.5">脱敏您的历史问诊案例，用于中医学AI深度演化与病理论文共享。</p>
            </div>
            <button
              onClick={() => {
                setPrivateEnabled(!privateEnabled);
                showToast(privateEnabled ? '已退回匿名共享' : '多谢您积极参共享', 'success');
              }}
              className={`w-11 h-6 rounded-full p-0.5 transition-colors cursor-pointer ${privateEnabled ? 'bg-[#7ba23f]' : 'bg-neutral-200'}`}
            >
              <div className={`bg-white w-5 h-5 rounded-full shadow-xs transition-transform transform ${privateEnabled ? 'translate-x-5' : 'translate-x-0'}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Block 2: Push preferences and Cache */}
      <div className="bg-white border border-black/5 rounded-3xl p-6 shadow-xs space-y-4">
        <h3 className="text-sm font-extrabold text-[#44493a] tracking-wider uppercase flex items-center gap-1.5 border-b border-black/[0.03] pb-3">
          <Bell className="w-4 h-4 text-orange-600" />
          <span>系统核心通知偏好</span>
        </h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold text-[#1b1c1c]">每日药食、脉来唤醒提醒</h4>
              <p className="text-[10px] text-[#747968] font-semibold mt-0.5">根据时令节气规章，在您预设的时间进行晨操与代茶饮的消息播报。</p>
            </div>
            <button
              onClick={() => {
                setPushEnabled(!pushEnabled);
                showToast(pushEnabled ? '已关闭全局调养推送' : '调养推送通畅已开通', 'success');
              }}
              className={`w-11 h-6 rounded-full p-0.5 transition-colors cursor-pointer ${pushEnabled ? 'bg-[#7ba23f]' : 'bg-neutral-200'}`}
            >
              <div className={`bg-white w-5 h-5 rounded-full shadow-xs transition-transform transform ${pushEnabled ? 'translate-x-5' : 'translate-x-0'}`} />
            </button>
          </div>

          <div className="flex items-center justify-between border-t border-black/[0.03] pt-4">
            <div>
              <h4 className="text-xs font-bold text-[#1b1c1c]">清理AI诊断及图片缓存</h4>
              <p className="text-[10px] text-[#747968] font-semibold mt-0.5">清除历史诊聊数据缓存，释放装机系统运行空间。当前缓存大小为：</p>
            </div>
            
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-[#466805] font-mono select-none">
                {cacheSize} MB
              </span>
              <button
                onClick={handleClearCache}
                disabled={isClearing}
                className="p-2.5 rounded-xl border border-black/5 hover:border-red-200 text-neutral-400 hover:text-red-500 hover:bg-rose-50/50 disabled:bg-neutral-100 disabled:cursor-not-allowed transition-all cursor-pointer"
                title="Clear Cache"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Block 3: Help and FAQ support */}
      <div className="bg-white border border-black/5 rounded-3xl p-4 shadow-xs">
        <button
          onClick={() => alert('常见问题页面正在上线中，有疑问请点击“我的 -> 反馈与建议意见”反馈给开发人员')}
          className="w-full p-3.5 rounded-2xl flex items-center justify-between text-left hover:bg-neutral-50/50 transition-all cursor-pointer group"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
              <HelpCircle className="w-4.5 h-4.5" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#1b1c1c] group-hover:text-[#466805]">中医养生常见疑问 (FAQ)</p>
              <p className="text-[9px] text-[#747968] font-semibold mt-0.5">自主测试、药膳熬制及经络点压的正确注意事项。</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-neutral-400" />
        </button>
      </div>

    </div>
  );
};
