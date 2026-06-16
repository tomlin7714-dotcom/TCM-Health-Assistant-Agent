/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ArrowLeft, Heart, Sparkles, MessageSquare, ShieldAlert, BookOpen, Microscope, BookMarked, Send, X } from 'lucide-react';
import { MOCK_HERBS } from '../data';
import { motion, AnimatePresence } from 'motion/react';

export const HerbDetail: React.FC = () => {
  const { selectedHerbId, goBack, toggleFavorite, isFavorite, showToast } = useApp();
  const [activeTab, setActiveTab] = useState<'effect' | 'research' | 'taboo'>('effect');
  
  // Slide Over AI Consultation state
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState<{ sender: 'ai' | 'user'; text: string }[]>([]);

  // Find herb
  const herb = MOCK_HERBS.find(item => item.id === selectedHerbId) || MOCK_HERBS[0];
  const favorited = isFavorite('herbs', herb.id);

  // Initialize consultation chat session
  const openConsultation = () => {
    setIsChatOpen(true);
    if (chatHistory.length === 0) {
      setChatHistory([
        { 
          sender: 'ai', 
          text: `尊崇的健康管理师，您好！我是 Balance AI 国医本草智能。关于这味古老的本草【${herb.name}】，它具有“${herb.effect}”的卓越功效。如果您对它在配伍、服用温度、对证剂量或调宿方面有任何疑问，在这里向我提出咨询。` 
        }
      ]);
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMessage = chatInput;
    setChatHistory(prev => [...prev, { sender: 'user', text: userMessage }]);
    setChatInput('');

    // Simulated responsive AI Q&A about this specific herb
    setTimeout(() => {
      let aiResponse = `关于【${herb.name}】的配伍应用，根据中医经典理论：\n\n1. 配伍相宜：如需强健肝肾、增进视力，常用【${herb.name}】搭配菊花或枸杞子同煎；\n2. 调理要点：平时建议水煎服，每次控制在合理剂量，不宜与生冷油炸食品同食；\n3. 调理注意：务必注意其所列举的禁忌事宜。`;
      
      if (userMessage.includes('怎么吃') || userMessage.includes('剂量') || userMessage.includes('服用')) {
        aiResponse = `日常服用【${herb.name}】的方法：\n\n- 茶饮闷泡：若属常规配伍（如枸杞），可用沸水冲洗并盖杯闷泡10-15分钟代茶饮；\n- 砂锅煎服：若搭配人参等根茎类本草，建议使用砂锅冷水浸泡半小时后，小火慢熬30-40分钟温热服下。\n\n⚠️ 注：具体对证剂量建议遵从主治中医医师医嘱。`;
      } else if (userMessage.includes('禁忌') || userMessage.includes('坏处') || userMessage.includes('副作用')) {
        aiResponse = `对于【${herb.name}】的临床禁忌说明如下：\n\n- ${herb.taboos.join('\n- ')}\n\n在调理期间，若身体出现任何上火、胃胀、腹泻不适，请立刻暂停服用并在此向我报告或就医。`;
      }

      setChatHistory(prev => [...prev, { sender: 'ai', text: aiResponse }]);
    }, 1000);
  };

  return (
    <div id="herb_detail_view" className="max-w-7xl mx-auto px-6 py-8 w-full">
      
      {/* Breadcrumb & Navigation */}
      <div className="flex items-center justify-between mb-6" id="herb_detail_breadcrumbs">
        <button 
          onClick={goBack}
          className="flex items-center gap-1.5 text-xs font-bold text-[#747968] hover:text-[#466805] transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>返回药材库</span>
        </button>

        <button
          onClick={() => toggleFavorite('herbs', herb.id)}
          className="flex items-center gap-1.5 text-xs font-bold text-[#747968] hover:text-[#466805] px-3 py-1.5 rounded-full border border-black/5 bg-white shadow-xs cursor-pointer"
        >
          <Heart className={`w-4 h-4 ${favorited ? 'text-red-500 fill-red-500' : 'text-neutral-400'}`} />
          <span>{favorited ? '已收藏' : '加入收藏'}</span>
        </button>
      </div>

      {/* Main Core View Header Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Photo with summary */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-3xl border border-black/5 bg-white p-3 shadow-xs">
            <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-neutral-100 shadow-inner">
              <img 
                src={herb.image} 
                className="w-full h-full object-cover" 
                alt={herb.name}
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-6">
                <div className="text-white">
                  <span className="text-[10px] uppercase font-black tracking-widest text-[#c5f183]">
                    ORIGINAL TCM SPECIMEN
                  </span>
                  <h2 className="text-2xl font-black">{herb.name}</h2>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Metrics columns */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white border border-black/5 p-4 rounded-2xl text-center shadow-xs">
              <span className="text-[10px] text-[#747968] font-bold block">药性</span>
              <p className="text-sm font-black text-[#466805] mt-1">{herb.property}性</p>
            </div>
            <div className="bg-white border border-black/5 p-4 rounded-2xl text-center shadow-xs">
              <span className="text-[10px] text-[#747968] font-bold block">名著出处</span>
              <p className="text-[11px] font-black text-amber-800 truncate mt-1">
                {herb.origin}
              </p>
            </div>
            <div className="bg-white border border-black/5 p-4 rounded-2xl text-center shadow-xs">
              <span className="text-[10px] text-[#747968] font-bold block">主要归经</span>
              <p className="text-[11px] font-black text-teal-800 truncate mt-1" title={herb.flavor}>
                {herb.flavor.split('，')[1] || '脾、肺、肾'}
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: Detailed Descriptions and interactive Tabs */}
        <div className="lg:col-span-7 space-y-6">
          
          <div className="bg-white border border-black/5 rounded-3xl p-6 shadow-xs space-y-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black text-[#1b1c1c]">{herb.name}</span>
                <span className="px-2.5 py-0.5 rounded bg-amber-50 text-amber-800 text-[10px] font-black font-mono">
                  {herb.pinyin}
                </span>
              </div>
              <p className="text-xs text-[#747968] font-semibold">
                药理特性：{herb.flavor}
              </p>
            </div>

            <p className="text-xs text-[#44493a] leading-relaxed font-semibold bg-[#efeded]/30 p-4 rounded-xl border border-black/[0.02]">
              {herb.description}
            </p>
          </div>

          {/* Details Content Switcher Tabs */}
          <div className="bg-white border border-black/5 rounded-3xl p-6 shadow-xs space-y-6">
            
            {/* Tabs Buttons bar */}
            <div className="flex border-b border-black/5 pb-1">
              <button
                onClick={() => setActiveTab('effect')}
                className={`flex-1 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  activeTab === 'effect' 
                    ? 'border-[#7ba23f] text-[#466805]' 
                    : 'border-transparent text-[#747968] hover:text-[#1b1c1c]'
                }`}
              >
                <BookMarked className="w-4 h-4" />
                <span>核心治疗与主治</span>
              </button>

              <button
                onClick={() => setActiveTab('research')}
                className={`flex-1 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  activeTab === 'research' 
                    ? 'border-[#7ba23f] text-[#466805]' 
                    : 'border-transparent text-[#747968] hover:text-[#1b1c1c]'
                }`}
              >
                <Microscope className="w-4 h-4" />
                <span>现代药理科学研究</span>
              </button>

              <button
                onClick={() => setActiveTab('taboo')}
                className={`flex-1 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  activeTab === 'taboo' 
                    ? 'border-[#7ba23f] text-[#466805]' 
                    : 'border-transparent text-[#747968] hover:text-[#1b1c1c]'
                }`}
              >
                <ShieldAlert className="w-4 h-4" />
                <span>服用配伍严冬禁忌</span>
              </button>
            </div>

            {/* Tab content displays */}
            <div id="herb_detail_tab_content">
              {activeTab === 'effect' && (
                <div className="space-y-4 animate-fadeInUp">
                  <h4 className="text-xs font-extrabold text-[#44493a] tracking-wider uppercase">
                    典型主治调理应用
                  </h4>
                  <ul className="space-y-2.5">
                    {herb.treatment.map((treat, idx) => (
                      <li key={idx} className="text-xs text-[#44493a] flex items-start gap-2.5">
                        <div className="w-5 h-5 rounded-md bg-[#7ba23f]/10 text-[#466805] text-[10px] font-black flex items-center justify-center mt-0.5 shrink-0 font-mono">
                          {idx + 1}
                        </div>
                        <span className="font-medium leading-relaxed">{treat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {activeTab === 'research' && (
                <div className="space-y-4 animate-fadeInUp">
                  <h4 className="text-xs font-extrabold text-[#44493a] tracking-wider uppercase">
                    临床现代药理学探究
                  </h4>
                  <p className="text-xs text-[#44493a] leading-relaxed font-semibold bg-[#7ba23f]/5 border border-[#7ba23f]/10 p-4 rounded-xl">
                    {herb.research}
                  </p>
                </div>
              )}

              {activeTab === 'taboo' && (
                <div className="space-y-4 animate-fadeInUp">
                  <h4 className="text-xs font-extrabold text-[#44493a] tracking-wider uppercase text-red-700">
                    辩证配伍安全警告
                  </h4>
                  <div className="bg-rose-500/5 border border-rose-100 p-4 rounded-xl space-y-3">
                    <div className="flex gap-2 text-rose-800">
                      <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
                      <span className="text-xs font-bold">配伍忌讳禁忌规范说明：</span>
                    </div>
                    <ul className="list-disc pl-5 text-xs text-[#44493a] font-medium space-y-1.5 leading-relaxed">
                      {herb.taboos.map((taboo, idx) => (
                        <li key={idx}>{taboo}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>

            {/* Slide over trigger CTA */}
            <div className="pt-4 border-t border-black/5">
              <button
                onClick={openConsultation}
                className="w-full h-11 rounded-xl bg-[#7ba23f] hover:bg-[#466805] text-white text-xs font-extrabold flex items-center justify-center gap-1.5 shadow-xs transition-all cursor-pointer"
                id="herb_consultation_button"
              >
                <MessageSquare className="w-4 h-4" />
                <span>咨询 AI 助理此本草运用要点</span>
              </button>
            </div>

          </div>

        </div>

      </div>

      {/* Slide-over Right Chat dialog panel */}
      <AnimatePresence>
        {isChatOpen && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex justify-end" id="herb_detail_chat_modal">
            {/* Backdrop click closer */}
            <div className="absolute inset-0 cursor-pointer" onClick={() => setIsChatOpen(false)} />

            {/* Chat viewport block */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-w-md h-full bg-[#fbf9f8] shadow-2xl flex flex-col z-10"
            >
              
              {/* Header */}
              <div className="p-4 border-b border-black/5 bg-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#7ba23f]/15 text-[#466805] flex items-center justify-center">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#1b1c1c]">AI 国医本草课堂</h3>
                    <p className="text-[10px] text-[#747968] font-bold">
                      正在解答关于【{herb.name}】的配齐用
                    </p>
                  </div>
                </div>

                <button 
                  onClick={() => setIsChatOpen(false)}
                  className="w-8 h-8 rounded-xl hover:bg-neutral-100 flex items-center justify-center text-neutral-400 hover:text-neutral-600 transition-all cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Scrolling messages list */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4" id="herb_detail_chat_messages">
                {chatHistory.map((msg, idx) => {
                  const isUser = msg.sender === 'user';
                  return (
                    <div 
                      key={idx} 
                      className={`flex gap-2.5 max-w-[85%] ${isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
                    >
                      {/* Avatar */}
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black shrink-0 ${
                        isUser 
                          ? 'bg-[#7ba23f] text-white' 
                          : 'bg-[#466805] text-[#c5f183]'
                      }`}>
                        {isUser ? '我' : '医'}
                      </div>

                      {/* Text Bubble */}
                      <div className={`p-3.5 rounded-2xl text-xs font-medium leading-relaxed ${
                        isUser 
                          ? 'bg-[#7ba23f] text-white rounded-tr-none shadow-xs' 
                          : 'bg-white border border-black/5 text-[#44493a] rounded-tl-none shadow-xs whitespace-pre-line'
                      }`}>
                        {msg.text}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Fast quick suggestions */}
              <div className="p-3 bg-white border-t border-black/5 flex gap-1.5 overflow-x-auto select-none">
                <button
                  type="button"
                  onClick={() => {
                    setChatInput(`请问【${herb.name}】的日常服用剂量和服用方法是什么？`);
                  }}
                  className="whitespace-nowrap px-3 py-1.5 rounded-full border border-black/5 bg-[#efeded] text-[10px] font-bold text-[#747968] hover:text-[#466805] hover:bg-[#7ba23f]/10 transition-all cursor-pointer"
                >
                  日常如何服用？
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setChatInput(`请问孕妇和高血压人群能吃【${herb.name}】么？有哪些禁忌？`);
                  }}
                  className="whitespace-nowrap px-3 py-1.5 rounded-full border border-black/5 bg-[#efeded] text-[10px] font-bold text-[#747968] hover:text-[#466805] hover:bg-[#7ba23f]/10 transition-all cursor-pointer"
                >
                  孕妇有禁忌吗？
                </button>
              </div>

              {/* Message inputs */}
              <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-black/5 flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="继续向 AI 医师咨询这味药..."
                  className="flex-1 bg-[#efeded] border border-transparent focus:border-[#7ba23f]/40 focus:bg-white rounded-xl px-4 text-xs font-semibold outline-none transition-all"
                  id="herb_detail_chat_input"
                />
                <button
                  type="submit"
                  className="w-10 h-10 rounded-xl bg-[#7ba23f] hover:bg-[#466805] text-white flex items-center justify-center transition-all cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
