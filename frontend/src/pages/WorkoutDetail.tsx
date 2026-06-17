/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { ArrowLeft, Heart, Play, Users, Flame, Zap, Shield, Sparkles, ChevronDown, ChevronUp, Wind, X, Compass } from 'lucide-react';
import { MOCK_WORKOUTS } from '../data';
import { motion, AnimatePresence } from 'motion/react';

export const WorkoutDetail: React.FC = () => {
  const { selectedWorkoutId, goBack, toggleFavorite, isFavorite, showToast } = useApp();
  const [expandedAction, setExpandedAction] = useState<number | null>(0); // 默认展开第一个
  
  // Meditative Breathing Guide State
  const [breathingOpen, setBreathingOpen] = useState(false);
  const [breathStage, setBreathStage] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [breathCounter, setBreathCounter] = useState(4); // 4-second stages
  const [breathCycles, setBreathCycles] = useState(0);

  const workout = MOCK_WORKOUTS.find(item => item.id === selectedWorkoutId) || MOCK_WORKOUTS[0];
  const favorited = isFavorite('workouts', workout.id);

  // Accordion Toggle
  const toggleAccordion = (order: number) => {
    setExpandedAction(expandedAction === order ? null : order);
  };

  // Breathing Loop Engine
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (breathingOpen) {
      timer = setInterval(() => {
        setBreathCounter(prev => {
          if (prev > 1) {
            return prev - 1;
          } else {
            // Stage rotation transition
            if (breathStage === 'inhale') {
              setBreathStage('hold');
              return 4; // 4s hold
            } else if (breathStage === 'hold') {
              setBreathStage('exhale');
              return 4; // 4s exhale
            } else {
              setBreathStage('inhale');
              setBreathCycles(c => c + 1);
              return 4; // 4s inhale
            }
          }
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [breathingOpen, breathStage]);

  const startBreathingGuide = () => {
    setBreathingOpen(true);
    setBreathStage('inhale');
    setBreathCounter(4);
    setBreathCycles(0);
    showToast('已开启中医元气呼吸吐养练习', 'success');
  };

  const getBreathStageLabel = () => {
    switch(breathStage) {
      case 'inhale': return '慢慢吸气 (吸入大自然清阳)';
      case 'hold': return '平心气，闭息聚元 (气行脏腑)';
      default: return '徐徐呼气 (吐出中焦浊邪气)';
    }
  };

  const getBreathActionGuidance = () => {
    switch(breathStage) {
      case 'inhale': return '小腹微收，引导自然清气自鼻腔缓缓流入胸腔...';
      case 'hold': return '放松全身，意守腹部丹田，气力在任督二脉融汇中...';
      default: return '全身毛孔放松，将郁结心火与胸腹浊气一并吐故纳新...';
    }
  };

  return (
    <div id="workout_detail_view" className="max-w-7xl mx-auto px-6 py-8 w-full">
      
      {/* Back & collection */}
      <div className="flex items-center justify-between mb-6" id="workout_breadcrumbs">
        <button 
          onClick={goBack}
          className="flex items-center gap-1.5 text-xs font-bold text-[#747968] hover:text-[#466805] transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>返回导引列表</span>
        </button>

        <button
          onClick={() => toggleFavorite('workouts', workout.id)}
          className="flex items-center gap-1.5 text-xs font-bold text-[#747968] hover:text-[#466805] px-3 py-1.5 rounded-full border border-black/5 bg-white shadow-xs cursor-pointer"
        >
          <Heart className={`w-4 h-4 ${favorited ? 'text-red-500 fill-red-500' : 'text-neutral-400'}`} />
          <span>{favorited ? '已收藏' : '加入收藏'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Video player — real video or cover image */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-neutral-950 border border-black/10 rounded-3xl p-2 shadow-lg relative overflow-hidden">
            <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-neutral-900 flex items-center justify-center">

              {workout.videoUrl ? (
                /* 真实视频嵌入（B站iframe） */
                <iframe
                  src={workout.videoUrl}
                  className="absolute inset-0 w-full h-full"
                  allowFullScreen
                  allow="autoplay; encrypted-media"
                  title={workout.name}
                />
              ) : (
                /* 无视频时显示封面+调息按钮 */
                <React.Fragment>
                  <img
                    src={workout.image}
                    alt={workout.name}
                    referrerPolicy="no-referrer"
                    className="absolute inset-0 w-full h-full object-cover opacity-80"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/25 transition-all" />
                  <button
                    onClick={startBreathingGuide}
                    className="relative z-10 w-16 h-16 rounded-full bg-white text-[#466805] hover:bg-[#c5f183] flex items-center justify-center shadow-lg active:scale-95 hover:scale-105 transition-all duration-300 cursor-pointer"
                    title="调息练习"
                  >
                    <Play className="w-6 h-6 fill-current ml-1" />
                  </button>
                  <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center z-10">
                    <span className="px-2.5 py-1 rounded bg-black/60 text-white text-[10px] font-mono select-none">
                      国医视频导授
                    </span>
                    <span className="px-2.5 py-1 rounded bg-[#c5f183] text-[#466805] text-[10px] font-black uppercase">
                      {workout.name}
                    </span>
                  </div>
                </React.Fragment>
              )}
            </div>
          </div>

          {/* Three key specs metadata list */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white border border-black/5 p-4 rounded-2xl text-center shadow-xs">
              <Users className="w-4 h-4 mx-auto text-[#747968]" />
              <p className="text-sm font-black text-[#1b1c1c] mt-2">{(workout.students).toLocaleString()}</p>
              <span className="text-[9px] text-[#747968] font-bold block">练习同修人</span>
            </div>
            
            <div className="bg-white border border-black/5 p-4 rounded-2xl text-center shadow-xs">
              <Flame className="w-4 h-4 mx-auto text-orange-500 animate-pulse" />
              <p className="text-sm font-black text-[#1b1c1c] mt-2">{workout.calories} 千卡</p>
              <span className="text-[9px] text-[#747968] font-bold block">平均消耗</span>
            </div>

            <div className="bg-white border border-black/5 p-4 rounded-2xl text-center shadow-xs">
              <Zap className="w-4 h-4 mx-auto text-purple-500" />
              <p className="text-sm font-black text-[#1b1c1c] mt-2">{workout.actionsCount} 动作</p>
              <span className="text-[9px] text-[#747968] font-bold block">包含功法</span>
            </div>
          </div>

          <div className="bg-white border border-black/5 rounded-3xl p-6 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-[#1b1c1c] flex items-center gap-1.5 text-[#466805]">
              <Shield className="w-4.5 h-4.5" />
              <span>导引大功法秘鉴</span>
            </h3>
            <p className="text-xs text-[#44493a] leading-relaxed font-semibold">
              {workout.intro}
            </p>
          </div>
        </div>

        {/* Right: Expandable Accordion decomposition steps */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* Main Accordion block */}
          <div className="bg-white border border-black/5 rounded-3xl p-6 shadow-xs space-y-4">
            <h3 className="text-base font-black text-[#1b1c1c]">步步式功法分解要诀</h3>
            
            <div className="space-y-3" id="workout_accordion">
              {workout.actions.map((act) => {
                const isExpanded = expandedAction === act.order;
                return (
                  <div 
                    key={act.order}
                    className={`border rounded-2xl transition-all ${
                      isExpanded 
                        ? 'border-[#7ba23f]/50 bg-[#7ba23f]/5 shadow-xs' 
                        : 'border-black/5 bg-white hover:bg-neutral-50/50'
                    }`}
                  >
                    
                    {/* Expand header */}
                    <div 
                      onClick={() => toggleAccordion(act.order)}
                      className="p-4 flex items-center justify-between cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-7 h-7 rounded-lg text-xs font-mono font-bold flex items-center justify-center ${
                          isExpanded 
                            ? 'bg-[#7ba23f] text-white animate-bounce' 
                            : 'bg-neutral-100 text-[#747968]'
                        }`}>
                          {act.order}
                        </div>
                        <span className="text-xs font-bold text-[#1b1c1c]">{act.title}</span>
                      </div>
                      
                      {isExpanded ? <ChevronUp className="w-4 h-4 text-neutral-400" /> : <ChevronDown className="w-4 h-4 text-neutral-400" />}
                    </div>

                    {/* Expandable items description panels */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden border-t border-black/[0.04]"
                        >
                          <div className="p-4 space-y-3 bg-white/50 rounded-b-2xl">
                            <div className="space-y-1">
                              <span className="text-[9px] font-black text-[#466805] uppercase tracking-wider block">
                                🔑 动作与吞吐呼吸要领：
                              </span>
                              <p className="text-xs text-[#44493a] font-medium leading-relaxed pl-1.5 border-l-2 border-[#7ba23f]">
                                {act.keys}
                              </p>
                            </div>

                            <div className="space-y-1">
                              <span className="text-[9px] font-black text-amber-800 uppercase tracking-wider block">
                                🛡️ 脏腑气血及经络机理：
                              </span>
                              <p className="text-xs text-amber-900 font-medium leading-relaxed bg-amber-500/5 p-2.5 rounded-lg border border-amber-100">
                                {act.role}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                  </div>
                );
              })}
            </div>

            {/* Launch Breath Meditator */}
            <div className="pt-2">
              <button
                onClick={startBreathingGuide}
                className="w-full h-11 rounded-xl bg-[#7ba23f] hover:bg-[#466805] text-white text-xs font-extrabold flex items-center justify-center gap-1.5 shadow-xs transition-all cursor-pointer"
              >
                <Wind className="w-4 h-4" />
                <span>进入交互式中医太极调息舱</span>
              </button>
            </div>

          </div>

        </div>

      </div>

      {/* Immersive Breathing Meditation Cabin Overlay Mode */}
      <AnimatePresence>
        {breathingOpen && (
          <div className="fixed inset-0 z-50 bg-[#1b1c1c]/95 backdrop-blur-3xl flex flex-col justify-between p-6 overflow-hidden" id="breathing_trainer_screen">
            
            {/* Header closely containing parameters */}
            <header className="flex items-center justify-between text-neutral-300 max-w-xl mx-auto w-full border-b border-white/5 pb-4">
              <div className="flex items-center gap-2">
                <Wind className="w-5 h-5 text-[#c5f183] animate-bounce" />
                <div>
                  <h3 className="text-sm font-black text-white">太极心相吐纳练习舱</h3>
                  <p className="text-[10px] text-neutral-400 font-bold">气顺十二经脉而健</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-[10px] bg-white/10 px-2.5 py-1 rounded-full font-mono font-bold">
                  已练习 {breathCycles} 循环
                </span>
                <button
                  type="button"
                  onClick={() => setBreathingOpen(false)}
                  className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 flex items-center justify-center text-neutral-400 hover:text-white transition-all cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </header>

            {/* Center: Pulsating Lung circle animation */}
            <div className="flex-1 max-w-xl mx-auto w-full flex flex-col items-center justify-center space-y-12">
              
              <div className="text-center space-y-2">
                <h4 className="text-lg font-black text-white tracking-widest uppercase">
                  {getBreathStageLabel()}
                </h4>
                <p className="text-xs text-[#c5f183] font-semibold font-mono animate-pulse">
                  当前阶段剩余：{breathCounter} 秒
                </p>
              </div>

              {/* Dynamic Scaling Circle container */}
              <div className="relative w-72 h-72 flex items-center justify-center">
                
                {/* Visual ripple ring backgrounds */}
                <div className={`absolute inset-0 rounded-full border-2 border-[#7ba23f]/10 transition-all duration-[3500ms] ${
                  breathStage === 'inhale' ? 'scale-110' : breathStage === 'hold' ? 'scale-120 border-teal-500/10' : 'scale-90'
                }`} />

                <div className={`absolute inset-[15%] rounded-full border border-[#c5f183]/10 transition-all duration-[3000ms] ${
                  breathStage === 'inhale' ? 'scale-105' : breathStage === 'hold' ? 'scale-110 border-teal-500/10' : 'scale-95'
                }`} />

                {/* Main Pulsating Core Circle */}
                <motion.div
                  animate={{
                    scale: breathStage === 'inhale' ? 1.4 : breathStage === 'hold' ? 1.45 : 0.95,
                  }}
                  transition={{
                    duration: 4,
                    ease: "easeInOut"
                  }}
                  className={`w-40 h-40 rounded-full bg-gradient-to-br flex flex-col items-center justify-center shadow-2xl ${
                    breathStage === 'inhale' 
                      ? 'from-[#7ba23f] to-[#466805] shadow-[#7ba23f]/15' 
                      : breathStage === 'hold'
                        ? 'from-teal-600 to-emerald-900 shadow-teal-500/15'
                        : 'from-amber-600 to-rose-950 shadow-rose-500/15'
                  }`}
                >
                  <Wind className="w-8 h-8 text-white filter drop-shadow-sm mb-1" />
                  <span className="text-2xl font-black text-white font-mono">{breathCounter}</span>
                </motion.div>

              </div>

              {/* Descriptive instruction logs */}
              <div className="text-center max-w-xs space-y-1">
                <p className="text-xs text-neutral-300 font-medium leading-relaxed">
                  {getBreathActionGuidance()}
                </p>
                <div className="pt-4 flex items-center justify-center gap-1 text-[10px] text-neutral-500 font-semibold uppercase leading-none">
                  <Compass className="w-3.5 h-3.5" />
                  <span>元气大周天循环运行中...</span>
                </div>
              </div>

            </div>

            {/* Bottom Actions close block */}
            <footer className="py-4 border-t border-white/5 text-center max-w-xl mx-auto w-full">
              <button 
                onClick={() => {
                  setBreathingOpen(false);
                  showToast('调息练习已安全结束，心率均匀，大有裨益。', 'success');
                }}
                className="px-8 py-3 rounded-xl border border-white/10 hover:bg-white/5 text-xs font-bold text-neutral-400 hover:text-white transition-all cursor-pointer"
              >
                结束吐养，安全收功归田
              </button>
            </footer>

          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
