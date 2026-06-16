/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Award, Search, Users, Flame, PlayCircle, Heart, ArrowRight } from 'lucide-react';
import { MOCK_WORKOUTS } from '../data';
import { motion } from 'motion/react';

export const Workouts: React.FC = () => {
  const { navigateTo, toggleFavorite, isFavorite } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<string>('全部');

  const filterLevels = ['全部', '入门', '中级'];

  const filteredWorkouts = useMemo(() => {
    return MOCK_WORKOUTS.filter((workout) => {
      const matchQuery = 
        workout.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        workout.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        workout.intro.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchLevel = 
        selectedLevel === '全部' || workout.level === selectedLevel;

      return matchQuery && matchLevel;
    });
  }, [searchQuery, selectedLevel]);

  const handleWorkoutClick = (id: string) => {
    navigateTo('workout-detail', 'workouts', { workout: id });
  };

  return (
    <div id="workouts_view" className="max-w-7xl mx-auto px-6 py-8 w-full space-y-8 flex flex-col">
      
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#1b1c1c] flex items-center gap-2">
            <Award className="w-6 h-6 text-[#466805]" />
            <span>导引动功 · 易筋调息养生堂</span>
          </h1>
          <p className="text-xs text-[#747968] font-semibold mt-1">
            中华传统长寿导引操。舒展颈肩，理顺督脉，畅通十二经络。
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full md:max-w-xs" id="workouts_search_container">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            placeholder="搜索功法名称、主讲老师、疗愈脏腑..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-black/5 hover:border-[#7ba23f]/30 focus:border-[#7ba23f] rounded-xl py-2.5 pl-10 pr-4 text-xs font-semibold outline-none transition-all shadow-xs"
          />
        </div>
      </div>

      {/* Level selector filters */}
      <div className="flex flex-wrap items-center gap-2" id="workout_filters">
        <span className="text-xs font-bold text-[#747968] mr-2">功法难度：</span>
        {filterLevels.map((lvl) => {
          const isSelected = selectedLevel === lvl;
          return (
            <button
              key={lvl}
              id={`workout_filter_${lvl}`}
              onClick={() => setSelectedLevel(lvl)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                isSelected 
                  ? 'bg-[#7ba23f] text-white shadow-xs' 
                  : 'bg-white border border-black/5 text-[#44493a] hover:bg-neutral-50 hover:text-[#466805]'
              }`}
            >
              {lvl === '全部' ? '全部功法' : `${lvl}级`}
            </button>
          );
        })}
      </div>

      {/* Grid of Workouts */}
      {filteredWorkouts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeInUp" id="workouts_grid">
          {filteredWorkouts.map((workout, index) => {
            const favorited = isFavorite('workouts', workout.id);
            return (
              <motion.div
                key={workout.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => handleWorkoutClick(workout.id)}
                id={`workout_card_${workout.id}`}
                className="bg-white border border-black/5 rounded-2xl overflow-hidden group cursor-pointer hover:border-[#7ba23f]/40 hover:shadow-md transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Photo Banner with indicators */}
                  <div className="relative aspect-[4/3] w-full bg-neutral-100 overflow-hidden">
                    <img 
                      src={workout.image} 
                      alt={workout.name} 
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
                    />

                    {/* Level marker overlays */}
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-950/70 backdrop-blur-xs text-[#c5f183] text-[9px] font-black uppercase tracking-wider">
                        {workout.level}级别
                      </span>
                    </div>

                    {/* Favorite heart */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite('workouts', workout.id);
                      }}
                      className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center border border-black/5 shadow-xs text-neutral-450 hover:text-red-500 transition-all cursor-pointer"
                    >
                      <Heart className={`w-4 h-4 ${favorited ? 'text-red-500 fill-red-500' : ''}`} />
                    </button>
                  </div>

                  {/* Descriptions block */}
                  <div className="p-5 space-y-2">
                    <h3 className="font-black text-[#1b1c1c] text-base group-hover:text-[#466805] transition-all">
                      {workout.name}
                    </h3>
                    
                    <p className="text-[10px] text-[#747968] font-bold">
                      主授：{workout.teacher}
                    </p>

                    <p className="text-xs text-[#747968] line-clamp-2 leading-relaxed pt-1 border-t border-black/[0.03]">
                      {workout.intro}
                    </p>
                  </div>
                </div>

                {/* Footer Metrics details */}
                <div className="px-5 pb-5 pt-3 flex items-center justify-between text-neutral-500 text-[10px] font-mono leading-none border-t border-black/5 bg-neutral-50/20">
                  <div className="flex gap-4">
                    <div className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-neutral-400" />
                      <span className="font-bold">{workout.students.toLocaleString()} 练</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5 text-orange-500" />
                      <span className="font-bold">{workout.calories} 千卡</span>
                    </div>
                  </div>

                  <span className="text-xs font-black text-[#7ba23f] group-hover:text-[#466805] flex items-center gap-0.5 transition-all">
                    <span>开始疏通</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>

              </motion.div>
            );
          })}
        </div>
      ) : (
        /* Empty results state */
        <div className="text-center py-20 bg-white border border-[#efeded] rounded-2xl flex flex-col items-center justify-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#1b1c1c]">未寻到相关的气功导引术</h3>
            <p className="text-xs text-[#747968] mt-1">您可以试着搜索：“八段锦”、“经络”、“晨起”或调整功法难度级别过滤器。</p>
          </div>
        </div>
      )}

    </div>
  );
};
