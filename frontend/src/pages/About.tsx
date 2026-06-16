/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useApp } from '../context/AppContext';
import { ArrowLeft, Sprout, Mail, Share2, MessageCircle, Heart, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';

export const About: React.FC = () => {
  const { goBack } = useApp();

  return (
    <div id="about_view" className="max-w-xl mx-auto px-6 py-8 w-full space-y-8">
      
      {/* Navigation Header */}
      <div className="flex items-center gap-2 border-b border-black/5 pb-4">
        <button 
          onClick={goBack}
          className="w-8 h-8 rounded-full bg-white border border-black/5 hover:bg-neutral-100 flex items-center justify-center text-neutral-400 hover:text-neutral-600 transition-all mr-2 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-xl font-black text-[#1b1c1c]">关于 Balance 助手</h1>
          <p className="text-xs text-[#747968] font-semibold mt-0.5">探知医疗科技与经典中医调和之美的品牌起源与学术愿景。</p>
        </div>
      </div>

      {/* Brand logo card with rotate animation */}
      <div className="bg-white border border-black/5 rounded-3xl p-8 shadow-xs flex flex-col items-center text-center space-y-4">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
          className="w-16 h-16 rounded-2xl bg-[#7ba23f]/15 flex items-center justify-center text-[#466805]"
        >
          <Sprout className="w-8 h-8 filter drop-shadow-[0_0_10px_rgba(70,104,5,0.3)]" />
        </motion.div>

        <div className="space-y-1">
          <h2 className="text-xl font-black text-[#1b1c1c] tracking-tight">Balance 智慧中医养生助手</h2>
          <p className="text-xs text-[#747968] font-mono font-bold">Version 2.4.0 (Build 82)</p>
        </div>
        
        <p className="text-xs text-[#44493a] font-semibold leading-relaxed max-w-sm">
          “汲古医之精髓，育心身之协调。”古老的东方养生法则不是一纸冰冷的药方，而是一种随时随地倾听身体，顺应四时生息融汇平衡的生活美学。
        </p>
      </div>

      {/* Philosophy Card block */}
      <div className="bg-white border border-black/5 rounded-3xl p-6 shadow-xs space-y-4">
        <h3 className="text-xs font-black text-[#466805] uppercase tracking-wider">
          💡 我们致力于此：
        </h3>
        <p className="text-xs text-[#44493a] leading-relaxed font-semibold">
          在中医学经典巨作“治未病”理念指导下，融合深度学习大模型，将复杂宏大的阴阳脏腑辩证重塑为大众能够读懂、能够上手、能够长期坚持的趣味养生习惯，包括每日一杯时令姜茶、一刻钟的舒压太极导养、以及定期的体质普查。
        </p>

        <div className="flex gap-2 text-rose-500 font-mono text-[10px] items-center pt-2 justify-center">
          <Heart className="w-3.5 h-3.5 fill-rose-500" />
          <span>Balance Team 匠心诚意呈献</span>
        </div>
      </div>

      {/* External Links rows */}
      <div className="bg-white border border-[#efeded] rounded-3xl p-2 flex flex-col" id="about_links">
        <a 
          href="#terms" 
          onClick={(e) => { e.preventDefault(); alert('本条款属于测试版本。'); }}
          className="p-3.5 hover:bg-neutral-50/50 rounded-2xl flex items-center justify-between text-left text-xs font-bold text-[#44493a] hover:text-[#466805] transition-all cursor-pointer"
        >
          <span>服务使用条款条款协议</span>
          <ChevronRight className="w-4 h-4 text-neutral-400" />
        </a>

        <a 
          href="#privacy" 
          onClick={(e) => { e.preventDefault(); alert('您的中医隐私受法律一级别双重加密保护。'); }}
          className="p-3.5 hover:bg-neutral-50/50 border-t border-black/[0.03] rounded-2xl flex items-center justify-between text-left text-xs font-bold text-[#44493a] hover:text-[#466805] transition-all cursor-pointer"
        >
          <span>国医隐私机密保全法案</span>
          <ChevronRight className="w-4 h-4 text-neutral-400" />
        </a>
      </div>

      {/* Social contacts */}
      <div className="flex items-center justify-center gap-4 text-neutral-400" id="about_social">
        <button 
          onClick={() => alert('请联系官方服务邮箱：support@balance-tcm.org')}
          className="w-10 h-10 rounded-full bg-white border border-black/5 flex items-center justify-center hover:text-emerald-600 hover:border-emerald-200 shadow-xs transition-all cursor-pointer"
          title="Email"
        >
          <Mail className="w-4.5 h-4.5" />
        </button>

        <button 
          onClick={() => alert('已将 Balance 智慧中医助手 链接一键复制，快去分享给家人朋友吧！')}
          className="w-10 h-10 rounded-full bg-white border border-black/5 flex items-center justify-center hover:text-indigo-600 hover:border-indigo-200 shadow-xs transition-all cursor-pointer"
          title="Share"
        >
          <Share2 className="w-4.5 h-4.5" />
        </button>

        <button 
          onClick={() => alert('请关注微信官方公众号：Balance智慧中医')}
          className="w-10 h-10 rounded-full bg-white border border-black/5 flex items-center justify-center hover:text-[#466805] hover:border-[#7ba23f]/30 shadow-xs transition-all cursor-pointer"
          title="WeChat Chat"
        >
          <MessageCircle className="w-4.5 h-4.5" />
        </button>
      </div>

      {/* Bottom copyright representation */}
      <div className="text-center font-mono text-[10px] text-neutral-500">
        © 2026 Balance Team · 保留中华医疗古法著作所有解释权
      </div>

    </div>
  );
};
