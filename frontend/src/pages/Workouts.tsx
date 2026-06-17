/**
 * Workouts — 导引功法列表，悬停自动播放B站视频预览
 */
import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Award, Search, Users, Flame, Heart, ArrowRight } from 'lucide-react';
import { MOCK_WORKOUTS } from '../data';
import { motion } from 'motion/react';

const WorkoutCard: React.FC<{ workout: typeof MOCK_WORKOUTS[0]; onDetail: (id: string) => void }> = ({ workout, onDetail }) => {
  const { toggleFavorite, isFavorite } = useApp();
  const [hovered, setHovered] = useState(false);
  const favorited = isFavorite('workouts', workout.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={() => onDetail(workout.id)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="bg-white border border-black/5 rounded-2xl overflow-hidden group cursor-pointer hover:border-[#7ba23f]/40 hover:shadow-md transition-all duration-300 flex flex-col justify-between"
    >
      {/* Video / Image area */}
      <div className="relative aspect-video w-full bg-black overflow-hidden">
        {hovered && workout.videoUrl ? (
          <iframe
            src={workout.videoUrl + '&autoplay=1'}
            className="absolute inset-0 w-full h-full border-0"
            allowFullScreen
            allow="autoplay; encrypted-media"
            title={workout.name}
          />
        ) : (
          <img
            src={workout.image}
            alt={workout.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
          />
        )}

        {/* Level badge */}
        <div className="absolute top-3 left-3">
          <span className="px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-xs text-[#c5f183] text-[9px] font-black uppercase tracking-wider">
            {workout.level}级
          </span>
        </div>

        {/* Favorite */}
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); toggleFavorite('workouts', workout.id); }}
          className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center border border-black/5 shadow-xs text-neutral-400 hover:text-red-500 transition-all cursor-pointer"
        >
          <Heart className={`w-4 h-4 ${favorited ? 'text-red-500 fill-red-500' : ''}`} />
        </button>

        {/* Hover indicator */}
        {!hovered && workout.videoUrl && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
              <svg className="w-5 h-5 text-[#466805] ml-0.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </div>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4 space-y-1.5" onClick={() => onDetail(workout.id)}>
        <h3 className="font-black text-sm text-[#1b1c1c] group-hover:text-[#466805] transition-all">
          {workout.name}
        </h3>
        <p className="text-[10px] text-[#747968]">{workout.teacher}</p>
        <p className="text-[11px] text-[#747968] line-clamp-2 leading-relaxed pt-1 border-t border-black/[0.03]">
          {workout.intro}
        </p>
      </div>

      {/* Footer */}
      <div className="px-4 pb-4 pt-2 flex items-center justify-between text-neutral-500 text-[10px] border-t border-black/5 bg-neutral-50/20">
        <div className="flex gap-3">
          <span className="flex items-center gap-1"><Users className="w-3 h-3" />{workout.students.toLocaleString()}练</span>
          <span className="flex items-center gap-1"><Flame className="w-3 h-3 text-orange-500" />{workout.calories}千卡</span>
        </div>
        <span className="text-xs font-black text-[#7ba23f] group-hover:text-[#466805] flex items-center gap-0.5 transition-all">
          开始疏通<ArrowRight className="w-3 h-3" />
        </span>
      </div>
    </motion.div>
  );
};

export const Workouts: React.FC = () => {
  const { navigateTo } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<string>('全部');

  const filterLevels = ['全部', '入门', '中级'];

  const filteredWorkouts = useMemo(() => {
    return MOCK_WORKOUTS.filter((w) => {
      const matchQuery =
        w.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        w.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        w.intro.toLowerCase().includes(searchQuery.toLowerCase());
      const matchLevel = selectedLevel === '全部' || w.level === selectedLevel;
      return matchQuery && matchLevel;
    });
  }, [searchQuery, selectedLevel]);

  return (
    <div id="workouts_view" className="max-w-7xl mx-auto px-6 py-8 w-full space-y-6 flex flex-col">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#1b1c1c] flex items-center gap-2">
            <Award className="w-6 h-6 text-[#466805]" />导引动功 · 易筋调息养生堂
          </h1>
          <p className="text-xs text-[#747968] mt-1">中华传统长寿导引操。鼠标悬停即可预览功法视频。</p>
        </div>
        <div className="relative w-full md:max-w-xs">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-neutral-400" />
          <input type="text" placeholder="搜索功法..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-black/5 focus:border-[#7ba23f] rounded-xl py-2.5 pl-10 pr-4 text-xs font-semibold outline-none transition-all shadow-xs" />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-bold text-[#747968] mr-2">功法难度：</span>
        {filterLevels.map((lvl) => (
          <button key={lvl} onClick={() => setSelectedLevel(lvl)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              selectedLevel === lvl ? 'bg-[#7ba23f] text-white shadow-xs' : 'bg-white border border-black/5 text-[#44493a] hover:bg-neutral-50'
            }`}>
            {lvl === '全部' ? '全部功法' : `${lvl}级`}
          </button>
        ))}
      </div>

      {filteredWorkouts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredWorkouts.map((w) => (
            <WorkoutCard key={w.id} workout={w} onDetail={(id) => navigateTo('workout-detail', 'workouts', { workout: id })} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white border rounded-2xl">
          <Award className="w-8 h-8 mx-auto text-neutral-300 mb-3" />
          <p className="text-sm font-bold text-[#1b1c1c]">未寻到相关功法</p>
          <p className="text-xs text-[#747968] mt-1">试试搜索"八段锦""经络""晨起"</p>
        </div>
      )}
    </div>
  );
};
