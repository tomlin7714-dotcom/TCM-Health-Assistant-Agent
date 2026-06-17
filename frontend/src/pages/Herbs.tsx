/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Leaf, Search, ArrowRight, Star, Heart } from 'lucide-react';
import { MOCK_HERBS } from '../data';
import { motion } from 'motion/react';

export const Herbs: React.FC = () => {
  const { navigateTo, toggleFavorite, isFavorite, showToast } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProperty, setSelectedProperty] = useState<string>('全部');

  // 药性分组：寒→温→热，每类有专属颜色
  const properties = [
    { key: '全部', label: '全部本草' },
    { key: '寒', label: '寒性', color: 'bg-blue-500/10 text-blue-700 border-blue-100' },
    { key: '微寒', label: '微寒', color: 'bg-sky-500/10 text-sky-700 border-sky-100' },
    { key: '平', label: '平性', color: 'bg-teal-500/10 text-teal-700 border-teal-100' },
    { key: '微温', label: '微温', color: 'bg-amber-500/10 text-amber-700 border-amber-100' },
    { key: '温', label: '温性', color: 'bg-orange-500/10 text-orange-700 border-orange-100' },
    { key: '热', label: '热性', color: 'bg-rose-500/10 text-rose-700 border-rose-100' },
    { key: '大热', label: '大热', color: 'bg-red-500/10 text-red-700 border-red-100' },
  ];

  const filteredHerbs = useMemo(() => {
    return MOCK_HERBS.filter((herb) => {
      const matchQuery =
        herb.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        herb.pinyin.toLowerCase().includes(searchQuery.toLowerCase()) ||
        herb.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchProperty =
        selectedProperty === '全部' || herb.property === selectedProperty;

      return matchQuery && matchProperty;
    });
  }, [searchQuery, selectedProperty]);

  const handleHerbClick = (id: string) => {
    navigateTo('herb-detail', 'herbs', { herb: id });
  };

  const getPropBadgeColor = (prop: string) => {
    const found = properties.find(p => p.key === prop);
    return found?.color || 'bg-neutral-100 text-neutral-600 border-neutral-150';
  };

  return (
    <div id="herbs_view" className="max-w-7xl mx-auto px-6 py-8 w-full space-y-8 flex flex-col">
      
      {/* Search Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#1b1c1c] flex items-center gap-2">
            <Leaf className="w-6 h-6 text-[#466805]" />
            <span>本草精髓 · 神农大药库</span>
          </h1>
          <p className="text-xs text-[#747968] font-semibold mt-1">
            探寻大自然的天然配礼，遵循古籍辨证本草，重归阴阳调顺。
          </p>
        </div>

        {/* Unified Search Input container */}
        <div className="relative w-full md:max-w-xs" id="herb_search_container">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            placeholder="搜索草药名称、拼音或应用功效..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-black/5 hover:border-[#7ba23f]/30 focus:border-[#7ba23f] rounded-xl py-2.5 pl-10 pr-4 text-xs font-semibold outline-none transition-all shadow-xs"
          />
        </div>
      </div>

      {/* Categories slider */}
      <div className="flex flex-wrap items-center gap-2" id="herb_filters">
        <span className="text-xs font-bold text-[#747968] mr-2">药性分类：</span>
        {properties.map((prop) => {
          const isSelected = selectedProperty === prop.key;
          return (
            <button
              key={prop.key}
              onClick={() => setSelectedProperty(prop.key)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer border ${
                isSelected
                  ? 'bg-[#7ba23f] text-white shadow-xs border-[#7ba23f]'
                  : 'bg-white border-black/5 text-[#44493a] hover:bg-neutral-50 hover:text-[#466805]'
              }`}
            >
              {prop.label}
            </button>
          );
        })}
      </div>

      {/* Herbs Grid container */}
      {filteredHerbs.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6" id="herbs_grid">
          {filteredHerbs.map((herb, i) => {
            const favorited = isFavorite('herbs', herb.id);
            return (
              <motion.div
                key={herb.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                id={`herb_card_${herb.id}`}
                className="bg-white border border-black/5 hover:border-[#7ba23f]/40 hover:shadow-md rounded-2xl group overflow-hidden flex flex-col justify-between transition-all duration-300"
              >
                <div>
                  {/* Photo area */}
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-100">
                    <img
                      src={herb.image}
                      alt={herb.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
                    />

                    {/* Property badges on top of picture */}
                    <div className="absolute top-3 left-3">
                      <span className={`px-2.5 py-0.5 rounded-full border text-[10px] font-black ${getPropBadgeColor(herb.property)}`}>
                        {herb.property}性
                      </span>
                    </div>

                    {/* Favorite heart icon top-right */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite('herbs', herb.id);
                      }}
                      className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center border border-black/5 shadow-xs text-neutral-400 hover:text-red-500 transition-all cursor-pointer"
                    >
                      <Heart className={`w-4 h-4 ${favorited ? 'text-red-500 fill-red-500' : ''}`} />
                    </button>
                  </div>

                  {/* Body textual part */}
                  <div className="p-5 space-y-2">
                    <div className="flex items-baseline gap-1.5">
                      <h3 className="font-black text-[#1b1c1c] text-base group-hover:text-[#466805] transition-all">
                        {herb.name}
                      </h3>
                      <span className="text-[10px] text-[#747968] font-bold font-mono uppercase">
                        {herb.pinyin}
                      </span>
                    </div>

                    <p className="text-xs text-[#747968] font-semibold flex items-center gap-1">
                      <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-amber-50 text-amber-800">
                        五味归经
                      </span>
                      <span className="truncate text-[10px]">{herb.flavor}</span>
                    </p>

                    <p className="text-xs text-[#44493a] line-clamp-3 leading-relaxed pt-1.5 border-t border-black/5">
                      {herb.description}
                    </p>
                  </div>
                </div>

                {/* Footer button */}
                <div className="px-5 pb-5 pt-1">
                  <button
                    onClick={() => handleHerbClick(herb.id)}
                    className="w-full h-9 rounded-xl border border-black/5 hover:border-[#7ba23f]/20 hover:bg-[#7ba23f]/5 text-xs font-bold text-[#44493a] hover:text-[#466805] flex items-center justify-center gap-1 transition-all cursor-pointer"
                  >
                    <span>本草大药考</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </motion.div>
            );
          })}
        </div>
      ) : (
        /* Empty feedback illustrator */
        <div className="text-center py-20 bg-white border border-black/5 rounded-2xl flex flex-col items-center justify-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400">
            <Search className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#1b1c1c]">未寻到相关的中草药本草</h3>
            <p className="text-xs text-[#747968] mt-1">您可以试着搜索：“人参”、“黄芪”、“干姜”或调整药性过滤器。</p>
          </div>
        </div>
      )}

    </div>
  );
};
