/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ArrowLeft, Bell, Sun, Coffee, Eye, Moon, Plus, X, ListCollapse, ToggleLeft, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const Reminders: React.FC = () => {
  const { reminders, toggleReminder, addReminder, goBack, showToast } = useApp();
  
  // Custom Create Overlay state
  const [modalOpen, setModalOpen] = useState(false);
  const [remName, setRemName] = useState('');
  const [remTime, setRemTime] = useState('08:00');
  const [remFreq, setRemFreq] = useState('每天');
  const [remType, setRemType] = useState<'qigong' | 'tea' | 'sleep' | 'acupoint'>('qigong');

  const getReminderCategoryIcon = (type: 'qigong' | 'tea' | 'sleep' | 'acupoint') => {
    switch(type) {
      case 'qigong': return <Sun className="w-5 h-5 text-emerald-700" />;
      case 'tea': return <Coffee className="w-5 h-5 text-amber-700" />;
      case 'acupoint': return <Eye className="w-5 h-5 text-rose-700" />;
      default: return <Moon className="w-5 h-5 text-indigo-700" />;
    }
  };

  const getReminderCategoryColor = (type: 'qigong' | 'tea' | 'sleep' | 'acupoint') => {
    switch(type) {
      case 'qigong': return 'bg-emerald-50 border-emerald-100';
      case 'tea': return 'bg-amber-50 border-amber-100';
      case 'acupoint': return 'bg-rose-50 border-rose-100';
      default: return 'bg-indigo-50 border-indigo-100';
    }
  };

  const handleCreateReminder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!remName.trim()) {
      showToast('请输入提醒主题名称。', 'error');
      return;
    }

    addReminder({
      name: remName,
      time: remTime,
      frequency: remFreq,
      type: remType
    });

    // Close and reset
    setModalOpen(false);
    setRemName('');
    setRemTime('08:00');
    setRemFreq('每天');
  };

  return (
    <div id="reminders_view" className="max-w-2xl mx-auto px-6 py-8 w-full space-y-6 relative">
      
      {/* Navigation Header */}
      <div className="flex items-center justify-between border-b border-black/5 pb-4">
        <div className="flex items-center gap-2">
          <button 
            type="button"
            onClick={goBack}
            className="w-8 h-8 rounded-full bg-white border border-black/5 hover:bg-neutral-100 flex items-center justify-center text-neutral-400 hover:text-neutral-600 transition-all mr-2 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-xl font-black text-[#1b1c1c] flex items-center gap-1.5">
              <Bell className="w-5 h-5 text-[#466805]" />
              <span>健康重要提醒管理</span>
            </h1>
            <p className="text-xs text-[#747968] font-semibold mt-0.5">规划行温养晨操、煎药炖服、息香就寝的最佳健康时刻。</p>
          </div>
        </div>

        {/* Top bar create trigger */}
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-1.5 bg-[#7ba23f] hover:bg-[#466805] text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>添加新提醒</span>
        </button>
      </div>

      {/* Daily schedule advisory card */}
      <div className="bg-white border border-black/5 p-4 rounded-3xl shadow-xs flex items-start gap-3.5">
        <Sun className="w-8 h-8 p-1.5 rounded-xl bg-amber-50 text-amber-600 shrink-0 mt-0.5 animate-pulse" />
        <div className="text-xs">
          <p className="font-bold text-[#1b1c1c]">今日芒种调养关照：中焦运化</p>
          <p className="text-neutral-500 font-medium leading-relaxed mt-1">
            “日理脾胃气，巳时食姜枣。戌时养心气，子时安夜眠。”
            保持定时的导引晨练与温热汤煮，能帮助脏腑筑牢元气之本。建议保持晨间八段锦提醒长开。
          </p>
        </div>
      </div>

      {/* Reminders List stack */}
      <div className="space-y-3" id="reminders_list">
        {reminders.map((rem) => {
          return (
            <div
              key={rem.id}
              className="bg-white border border-black/5 rounded-2xl p-4 shadow-xs hover:border-[#7ba23f]/25 hover:shadow-md transition-all flex items-center justify-between"
            >
              <div className="flex items-center gap-3.5">
                {/* Visual icon container */}
                <div className={`w-11 h-11 rounded-xl border flex items-center justify-center shrink-0 ${getReminderCategoryColor(rem.type)}`}>
                  {getReminderCategoryIcon(rem.type)}
                </div>

                <div>
                  <h4 className="text-xs font-black text-[#1b1c1c]">{rem.name}</h4>
                  <div className="flex items-center gap-2 mt-0.5 text-[10px] text-[#747968] font-bold">
                    <span className="font-mono text-[#1b1c1c]">{rem.time}</span>
                    <span>·</span>
                    <span>频率：{rem.frequency}</span>
                  </div>
                </div>
              </div>

              {/* iOS style toggle switch */}
              <button
                type="button"
                onClick={() => toggleReminder(rem.id)}
                className={`w-11 h-6 rounded-full p-0.5 transition-colors cursor-pointer ${
                  rem.active ? 'bg-[#7ba23f]' : 'bg-neutral-200'
                }`}
              >
                <div className={`bg-white w-5 h-5 rounded-full shadow-xs transition-transform transform ${
                  rem.active ? 'translate-x-5' : 'translate-x-0'
                }`} />
              </button>

            </div>
          );
        })}
      </div>

      {/* Create Modal Dialog Overlay with framer-motion */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4" id="reminder_create_modal">
            {/* Backdrop click closer */}
            <div className="absolute inset-0 cursor-pointer" onClick={() => setModalOpen(false)} />

            {/* Modal Body Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative bg-white border border-black/5 rounded-3xl p-6 shadow-2xl max-w-sm w-full space-y-6 z-10"
            >
              
              {/* Header */}
              <div className="flex items-center justify-between border-b border-black/[0.04] pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#7ba23f]/10 text-[#466805] flex items-center justify-center">
                    <Bell className="w-4 h-4 text-[#466805]" />
                  </div>
                  <h3 className="text-sm font-black text-[#1b1c1c]">增订新健康提醒</h3>
                </div>

                <button 
                  onClick={() => setModalOpen(false)}
                  className="w-7 h-7 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center text-neutral-400 hover:text-neutral-600 transition-all cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Form Input areas */}
              <form onSubmit={handleCreateReminder} className="space-y-4">
                
                {/* 1. Theme name */}
                <div>
                  <label className="block text-[10px] font-black text-[#44493a] uppercase tracking-wider mb-1.5">
                    提醒主题名称：
                  </label>
                  <input
                    type="text"
                    placeholder="示例：饮用枸杞菊花、揉足三里"
                    value={remName}
                    onChange={(e) => setRemName(e.target.value)}
                    className="w-full bg-[#efeded]/70 border border-transparent focus:border-[#7ba23f]/30 focus:bg-white rounded-xl py-2.5 px-4 text-xs font-semibold outline-none"
                    id="reminder_name_input"
                  />
                </div>

                {/* 2. Category selection grids */}
                <div>
                  <label className="block text-[10px] font-black text-[#44493a] uppercase tracking-wider mb-1.5">
                    提醒业务种类：
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { key: 'qigong', label: '晨晚操功' },
                      { key: 'tea', label: '时令茶饮' },
                      { key: 'acupoint', label: '穴位点压' },
                      { key: 'sleep', label: '息香睡眠' }
                    ].map((c) => {
                      const isSelected = remType === c.key;
                      return (
                        <button
                          key={c.key}
                          type="button"
                          onClick={() => setRemType(c.key as any)}
                          className={`py-2 p-1 border rounded-lg text-[9px] font-extrabold text-center transition-all cursor-pointer ${
                            isSelected 
                              ? 'border-[#7ba23f] bg-[#7ba23f]/5 text-[#466805]' 
                              : 'border-black/5 bg-white text-neutral-400'
                          }`}
                        >
                          {c.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 3. Time selector */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-[#44493a] uppercase tracking-wider mb-1.5">
                      提醒时刻：
                    </label>
                    <input
                      type="time"
                      value={remTime}
                      onChange={(e) => setRemTime(e.target.value)}
                      className="w-full bg-[#efeded]/70 border border-transparent focus:border-[#7ba23f]/30 focus:bg-white rounded-xl py-2.5 px-4 text-xs font-bold font-mono outline-none"
                    />
                  </div>

                  {/* 4. Frequency */}
                  <div>
                    <label className="block text-[10px] font-black text-[#44493a] uppercase tracking-wider mb-1.5">
                      循环频率：
                    </label>
                    <select
                      value={remFreq}
                      onChange={(e) => setRemFreq(e.target.value)}
                      className="w-full bg-[#efeded]/70 border border-transparent focus:border-[#7ba23f]/30 focus:bg-white rounded-xl py-2.5 px-3 text-xs font-bold outline-none"
                    >
                      <option value="每天">每天</option>
                      <option value="周一/三/五">周一/三/五</option>
                      <option value="周六/日">双休日</option>
                      <option value="每周一">每个星期一</option>
                    </select>
                  </div>
                </div>

                {/* 5. Submit Save buttons */}
                <div className="pt-4 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="flex-1 h-10 border border-black/5 hover:bg-neutral-50 rounded-xl text-neutral-500 font-bold text-xs"
                  >
                    取消
                  </button>

                  <button
                    type="submit"
                    className="flex-1 h-10 bg-[#7ba23f] hover:bg-[#466805] text-white font-extrabold text-xs rounded-xl flex items-center justify-center gap-1 shadow-xs cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>保存草案</span>
                  </button>
                </div>

              </form>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
