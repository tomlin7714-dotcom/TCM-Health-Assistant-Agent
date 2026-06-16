/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Utensils, Search, Clock, Award, Hammer, Heart, ArrowRight } from 'lucide-react';
import { MOCK_RECIPES } from '../data';
import { motion } from 'motion/react';

export const Recipes: React.FC = () => {
  const { navigateTo, toggleFavorite, isFavorite, showToast } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBenefit, setSelectedBenefit] = useState<string>('全部');

  const benefitCategories = ['全部', '温中散寒', '明目益肝', '健脾养胃'];

  const filteredRecipes = useMemo(() => {
    return MOCK_RECIPES.filter((recipe) => {
      const matchQuery = 
        recipe.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recipe.intro.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchCategory = 
        selectedBenefit === '全部' || recipe.benefits.includes(selectedBenefit);

      return matchQuery && matchCategory;
    });
  }, [searchQuery, selectedBenefit]);

  const handleRecipeClick = (id: string) => {
    navigateTo('recipe-detail', 'recipes', { recipe: id });
  };

  return (
    <div id="recipes_view" className="max-w-7xl mx-auto px-6 py-8 w-full space-y-8 flex flex-col">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#1b1c1c] flex items-center gap-2">
            <Utensils className="w-6 h-6 text-[#466805]" />
            <span>药食同源 · 四时膳食养草方</span>
          </h1>
          <p className="text-xs text-[#747968] font-semibold mt-1">
            古籍名家食古相济方。顺天时而备五谷，佐药草成美味，内调脏腑，润养心神。
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full md:max-w-xs" id="recipes_search_container">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            placeholder="搜药膳名称、功法、调养成分..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-black/5 hover:border-[#7ba23f]/30 focus:border-[#7ba23f] rounded-xl py-2.5 pl-10 pr-4 text-xs font-semibold outline-none transition-all shadow-xs"
          />
        </div>
      </div>

      {/* Category filters */}
      <div className="flex flex-wrap items-center gap-2" id="recipe_filters">
        <span className="text-xs font-bold text-[#747968] mr-2">调护功效：</span>
        {benefitCategories.map((cat) => {
          const isSelected = selectedBenefit === cat;
          return (
            <button
              key={cat}
              id={`recipe_filter_${cat}`}
              onClick={() => setSelectedBenefit(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                isSelected 
                  ? 'bg-[#7ba23f] text-white shadow-xs' 
                  : 'bg-white border border-black/5 text-[#44493a] hover:bg-neutral-50 hover:text-[#466805]'
              }`}
            >
              {cat === '全部' ? '全部药膳' : cat}
            </button>
          );
        })}
      </div>

      {/* Recipes Cards Layout */}
      {filteredRecipes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="recipes_grid">
          {filteredRecipes.map((recipe, idx) => {
            const favorited = isFavorite('recipes', recipe.id);
            return (
              <motion.div
                key={recipe.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                id={`recipe_card_${recipe.id}`}
                className="bg-white border border-black/5 hover:border-[#7ba23f]/40 hover:shadow-md rounded-2xl overflow-hidden group transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Banner Photo Area */}
                  <div className="relative aspect-[16/10] bg-neutral-100 overflow-hidden">
                    <img 
                      src={recipe.image} 
                      alt={recipe.name} 
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
                    />

                    {/* Floating top tags */}
                    <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                      {recipe.benefits.slice(0, 2).map((b, i) => (
                        <span key={i} className="px-2.5 py-0.5 rounded-full bg-[#c5f183]/90 text-[#466805] text-[9px] font-black uppercase tracking-wider backdrop-blur-xs">
                          {b}
                        </span>
                      ))}
                    </div>

                    {/* Favorite hearth toggle */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite('recipes', recipe.id);
                      }}
                      className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center border border-black/5 shadow-xs text-neutral-400 hover:text-red-500 transition-all cursor-pointer"
                    >
                      <Heart className={`w-4 h-4 ${favorited ? 'text-red-500 fill-red-500' : ''}`} />
                    </button>
                  </div>

                  {/* Body description */}
                  <div className="p-5 space-y-2">
                    <h3 className="font-black text-[#1b1c1c] text-base group-hover:text-[#466805] transition-all">
                      {recipe.name}
                    </h3>

                    <p className="text-xs text-[#747968] line-clamp-2 leading-relaxed">
                      {recipe.intro}
                    </p>
                  </div>
                </div>

                {/* Footer specs details card */}
                <div className="px-5 pb-5 pt-3 border-t border-black/5 flex items-center justify-between text-neutral-500 text-[10px] font-mono leading-none">
                  <div className="flex gap-4">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#747968]" />
                      <span className="font-bold">{recipe.time}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Award className="w-3.5 h-3.5 text-[#747968]" />
                      <span className="font-bold">难度 {recipe.difficulty}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleRecipeClick(recipe.id)}
                    className="text-xs font-extrabold text-[#7ba23f] hover:text-[#466805] flex items-center gap-0.5 cursor-pointer"
                  >
                    <span>食谱秘诀</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>

              </motion.div>
            );
          })}
        </div>
      ) : (
        /* Empty feedback illustrator */
        <div className="text-center py-20 bg-white border border-[#efeded] rounded-2xl flex flex-col items-center justify-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400">
            <Utensils className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#1b1c1c]">未寻到相关的四时膳方</h3>
            <p className="text-xs text-[#747968] mt-1">您可以试着搜索：“红枣”、“姜”、“健脾”或调整调护功效筛选器。</p>
          </div>
        </div>
      )}

    </div>
  );
};
