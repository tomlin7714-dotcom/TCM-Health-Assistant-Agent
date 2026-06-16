/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { ArrowLeft, Clock, Search, HelpCircle, Activity, Sparkles, Star, Calendar } from 'lucide-react';
import { motion } from 'motion/react';

export const History: React.FC = () => {
  const { history, goBack, navigateTo } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('全部');

  const filterTypes = ['全部', '脉象分析', '健康复查', '舌诊扫描', '时令调理'];

  const getRecordTypeLabel = (type: 'pulse' | 'review' | 'tongue' | 'seasonal') => {
    switch(type) {
      case 'pulse': return '脉象分析';
      case 'review': return '健康复查';
      case 'tongue': return '舌诊扫描';
      default: return '时令调理';
    }
  };

  const getRecordTypeColor = (type: 'pulse' | 'review' | 'tongue' | 'seasonal') => {
    switch(type) {
      case 'pulse': return 'bg-emerald-50 text-emerald-800 border-emerald-250';
      case 'review': return 'bg-blue-50 text-blue-800 border-blue-250';
      case 'tongue': return 'bg-purple-50 text-purple-800 border-purple-250';
      default: return 'bg-amber-50 text-amber-800 border-amber-250';
    }
  };

  const filteredHistory = useMemo(() => {
    return history.filter(item => {
      const typeLabel = getRecordTypeLabel(item.type);
      const sMatch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                     item.symptoms.toLowerCase().includes(searchQuery.toLowerCase());
      const tMatch = selectedType === '全部' || typeLabel === selectedType;
      return sMatch && tMatch;
    });
  }, [history, searchQuery, selectedType]);

  return (
    <div id="history_view" className="max-w-3xl mx-auto px-6 py-8 w-full space-y-6">
      
      {/* Navigation Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-black/5 pb-4">
        <div className="flex items-center gap-2">
          <button 
            onClick={goBack}
            className="w-8 h-8 rounded-full bg-white border border-black/5 hover:bg-neutral-100 flex items-center justify-center text-neutral-400 hover:text-neutral-600 transition-all mr-2 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-xl font-black text-[#1b1c1c] flex items-center gap-1.5">
              <span>国医诊断咨询历史</span>
            </h1>
            <p className="text-xs text-[#747968] font-semibold mt-0.5">温故而知新。回顾您曾进行的中医AI诊断与膳食、经络调护方案。</p>
          </div>
        </div>
      </div>

      {/* Searching and Categorizing */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            placeholder="搜索曾问诊过的症状或诊断主题..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-black/5 rounded-xl py-2.5 pl-10 pr-4 text-xs font-semibold outline-none focus:border-[#7ba23f] transition-all shadow-xs"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {filterTypes.map((t) => {
            const isSelected = selectedType === t;
            return (
              <button
                key={t}
                onClick={() => setSelectedType(t)}
                className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                  isSelected 
                    ? 'bg-[#7ba23f] text-white shadow-xs' 
                    : 'bg-white border border-black/5 text-[#747968] hover:bg-neutral-50 hover:text-[#466805]'
                }`}
              >
                {t}
              </button>
            );
          })}
        </div>
      </div>

      {/* Reports stack */}
      {filteredHistory.length > 0 ? (
        <div className="space-y-4" id="history_list">
          {filteredHistory.map((item, idx) => {
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-white border border-black/5 rounded-2xl p-6 shadow-xs hover:shadow-md transition-all duration-300 space-y-4"
              >
                {/* Meta details */}
                <div className="flex items-center justify-between border-b border-black/[0.03] pb-3">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-black border uppercase tracking-wider ${getRecordTypeColor(item.type)}`}>
                      {getRecordTypeLabel(item.type)}
                    </span>
                    <h3 className="font-bold text-[#1b1c1c] text-sm truncate max-w-[180px] sm:max-w-[280px]">
                      {item.title}
                    </h3>
                  </div>
                  <span className="text-[10px] text-[#747968] font-mono font-bold">
                    {item.date}
                  </span>
                </div>

                <div className="space-y-3.5">
                  {/* Patients input */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-black text-[#747968] block uppercase">
                      诉说之自感症状：
                    </span>
                    <p className="text-xs text-[#44493a] leading-relaxed pl-3 border-l-2 border-neutral-300 font-medium">
                      {item.symptoms}
                    </p>
                  </div>

                  {/* AI response details */}
                  {item.analysis && (
                    <div className="space-y-1 bg-[#efeded]/30 p-3.5 rounded-xl border border-black/[0.01]">
                      <span className="text-[10px] font-black text-[#466805] flex items-center gap-1 uppercase leading-none">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>国医AI古著辨证病机分析：</span>
                      </span>
                      <p className="text-xs text-[#44493a] leading-relaxed font-medium mt-1 pl-1">
                        {item.analysis}
                      </p>
                    </div>
                  )}

                  {/* Recommendations */}
                  <div className="space-y-1 bg-amber-500/[0.04] p-3.5 rounded-xl border border-amber-100">
                    <span className="text-[10px] font-black text-amber-800 block uppercase">
                      📜 每日药食、功法调养建议：
                    </span>
                    <p className="text-xs text-amber-900 leading-relaxed font-semibold mt-1">
                      {item.suggestion}
                    </p>
                  </div>
                </div>

              </motion.div>
            );
          })}
        </div>
      ) : (
        /* Empty feedback */
        <div className="text-center py-20 bg-white border border-[#efeded] rounded-2xl flex flex-col items-center justify-center space-y-4">
          <Clock className="w-10 h-10 text-neutral-300 animate-pulse" />
          <div>
            <p className="text-xs font-bold text-[#1b1c1c]">未检索到任何匹配的辩证药案</p>
            <p className="text-[10px] text-[#747968] mt-1">您可以试着清空搜索框或调整药案分类过滤器。</p>
            <button
              onClick={() => navigateTo('home-main', 'home')}
              className="mt-3.5 text-xs bg-[#7ba23f] text-white px-5 py-2 rounded-xl h-9 hover:bg-[#466805] font-extrabold transition-all cursor-pointer"
            >
              即刻去进行首次AI看诊
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
