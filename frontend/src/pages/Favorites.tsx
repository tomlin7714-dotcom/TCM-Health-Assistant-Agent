/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ArrowLeft, Heart, Leaf, Utensils, Award, MessageSquare, Trash2 } from 'lucide-react';
import { MOCK_HERBS, MOCK_RECIPES, MOCK_WORKOUTS } from '../data';
import { motion } from 'motion/react';

export const Favorites: React.FC = () => {
  const { favorites, toggleFavorite, navigateTo, goBack } = useApp();
  const [activeSubTab, setActiveSubTab] = useState<'herbs' | 'recipes' | 'workouts'>('herbs');

  const handleHerbClick = (id: string) => {
    navigateTo('herb-detail', 'herbs', { herb: id });
  };

  const handleRecipeClick = (id: string) => {
    navigateTo('recipe-detail', 'recipes', { recipe: id });
  };

  const handleWorkoutClick = (id: string) => {
    navigateTo('workout-detail', 'workouts', { workout: id });
  };

  // Filter items matching favorited lists
  const favoriteHerbs = MOCK_HERBS.filter(item => favorites.herbs.includes(item.id));
  const favoriteRecipes = MOCK_RECIPES.filter(item => favorites.recipes.includes(item.id));
  const favoriteWorkouts = MOCK_WORKOUTS.filter(item => favorites.workouts.includes(item.id));

  return (
    <div id="favorites_view" className="max-w-7xl mx-auto px-6 py-8 w-full space-y-6">
      
      {/* Back to Profile / Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-black/5 pb-4">
        <div className="flex items-center gap-2">
          <button 
            onClick={goBack}
            className="w-8 h-8 rounded-full bg-white border border-black/5 hover:bg-neutral-100 flex items-center justify-center text-neutral-400 hover:text-neutral-600 transition-all mr-2 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-xl font-black text-[#1b1c1c]">我的收藏夹</h1>
            <p className="text-xs text-[#747968] font-semibold mt-0.5">温习并保存您所倾心的草药本草、食疗药膳和吐气操法。</p>
          </div>
        </div>
      </div>

      {/* Switching tabs sub-headers */}
      <div className="flex border-b border-black/5" id="favorites_tabs">
        <button
          onClick={() => setActiveSubTab('herbs')}
          className={`flex-1 py-3 text-xs font-bold border-b-2 text-center transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            activeSubTab === 'herbs' 
              ? 'border-[#7ba23f] text-[#466805]' 
              : 'border-transparent text-[#747968] hover:text-[#1b1c1c]'
          }`}
        >
          <Leaf className="w-4 h-4" />
          <span>本草珍藏 ({favoriteHerbs.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('recipes')}
          className={`flex-1 py-3 text-xs font-bold border-b-2 text-center transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            activeSubTab === 'recipes' 
              ? 'border-[#7ba23f] text-[#466805]' 
              : 'border-transparent text-[#747968] hover:text-[#1b1c1c]'
          }`}
        >
          <Utensils className="w-4 h-4" />
          <span>食膳秘方 ({favoriteRecipes.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('workouts')}
          className={`flex-1 py-3 text-xs font-bold border-b-2 text-center transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            activeSubTab === 'workouts' 
              ? 'border-[#7ba23f] text-[#466805]' 
              : 'border-transparent text-[#747968] hover:text-[#1b1c1c]'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>导养功操 ({favoriteWorkouts.length})</span>
        </button>
      </div>

      {/* Grid container listing filtered elements */}
      <div id="favorites_list_content">
        {activeSubTab === 'herbs' && (
          favoriteHerbs.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-fadeInUp">
              {favoriteHerbs.map(item => (
                <div 
                  key={item.id}
                  onClick={() => handleHerbClick(item.id)}
                  className="bg-white border border-black/5 rounded-2xl overflow-hidden shadow-xs hover:shadow-md hover:border-[#7ba23f]/20 group transition-all cursor-pointer flex flex-col justify-between"
                >
                  <div className="relative aspect-[4/3] bg-neutral-100">
                    <img src={item.image} className="w-full h-full object-cover" alt="Herb" referrerPolicy="no-referrer" />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite('herbs', item.id);
                      }}
                      className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 text-red-500 hover:bg-white flex items-center justify-center shadow-xs cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="p-4 space-y-1">
                    <h4 className="text-xs font-black text-[#1b1c1c] group-hover:text-[#466850]">{item.name}</h4>
                    <p className="text-[10px] text-[#747968] font-bold font-mono">{item.pinyin}</p>
                    <p className="text-[10px] text-[#747968] line-clamp-2 mt-2 leading-relaxed">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-24 bg-white border border-black/5 rounded-2xl flex flex-col items-center justify-center space-y-4">
              <Leaf className="w-10 h-10 text-neutral-300 animate-pulse" />
              <div>
                <p className="text-xs font-bold text-[#1b1c1c]">未加入任何本草药材收藏</p>
                <button onClick={() => navigateTo('home-main', 'herbs')} className="text-[10px] text-[#7ba23f] font-bold hover:underline mt-1.5 cursor-pointer">
                  前往本草库去挑选一些 &rarr;
                </button>
              </div>
            </div>
          )
        )}

        {activeSubTab === 'recipes' && (
          favoriteRecipes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fadeInUp">
              {favoriteRecipes.map(item => (
                <div 
                  key={item.id}
                  onClick={() => handleRecipeClick(item.id)}
                  className="bg-white border border-black/5 rounded-2xl overflow-hidden shadow-xs hover:shadow-md hover:border-[#7ba23f]/20 group transition-all cursor-pointer flex flex-col justify-between"
                >
                  <div className="relative aspect-[16/10] bg-neutral-100">
                    <img src={item.image} className="w-full h-full object-cover" alt="Recipe" referrerPolicy="no-referrer" />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite('recipes', item.id);
                      }}
                      className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 text-red-500 hover:bg-white flex items-center justify-center shadow-xs cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="p-4 space-y-1">
                    <h4 className="text-xs font-black text-[#1b1c1c] group-hover:text-[#466850]">{item.name}</h4>
                    <p className="text-[10px] text-[#747968] line-clamp-2 leading-relaxed">{item.intro}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-24 bg-white border border-black/5 rounded-2xl flex flex-col items-center justify-center space-y-4">
              <Utensils className="w-10 h-10 text-neutral-300 animate-pulse" />
              <div>
                <p className="text-xs font-bold text-[#1b1c1c]">未加入任何膳食秘方收藏</p>
                <button onClick={() => navigateTo('home-main', 'recipes')} className="text-[10px] text-[#7ba23f] font-bold hover:underline mt-1.5 cursor-pointer">
                  前往膳舍方去挑选一些 &rarr;
                </button>
              </div>
            </div>
          )
        )}

        {activeSubTab === 'workouts' && (
          favoriteWorkouts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fadeInUp">
              {favoriteWorkouts.map(item => (
                <div 
                  key={item.id}
                  onClick={() => handleWorkoutClick(item.id)}
                  className="bg-white border border-black/5 rounded-2xl overflow-hidden shadow-xs hover:shadow-md hover:border-[#7ba23f]/20 group transition-all cursor-pointer flex flex-col justify-between"
                >
                  <div className="relative aspect-[4/3] bg-neutral-100">
                    <img src={item.image} className="w-full h-full object-cover" alt="Workout" referrerPolicy="no-referrer" />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite('workouts', item.id);
                      }}
                      className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 text-red-500 hover:bg-white flex items-center justify-center shadow-xs cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="p-4 space-y-1">
                    <h4 className="text-xs font-black text-[#1b1c1c] group-hover:text-[#466850]">{item.name}</h4>
                    <p className="text-[10px] text-[#747968] line-clamp-2 leading-relaxed">{item.intro}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-24 bg-white border border-black/5 rounded-2xl flex flex-col items-center justify-center space-y-4">
              <Award className="w-10 h-10 text-neutral-300 animate-pulse" />
              <div>
                <p className="text-xs font-bold text-[#1b1c1c]">未加入任何太极导息操收藏</p>
                <button onClick={() => navigateTo('home-main', 'workouts')} className="text-[10px] text-[#7ba23f] font-bold hover:underline mt-1.5 cursor-pointer">
                  前往导引房去选学一套 &rarr;
                </button>
              </div>
            </div>
          )
        )}
      </div>

    </div>
  );
};
