/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ArrowLeft, Heart, Flame, Leaf, Compass, Clock, Award, Play, ChevronLeft, ChevronRight, CheckCircle, RotateCcw, X, Utensils } from 'lucide-react';
import { MOCK_RECIPES } from '../data';
import { motion, AnimatePresence } from 'motion/react';

export const RecipeDetail: React.FC = () => {
  const { selectedRecipeId, goBack, toggleFavorite, isFavorite, showToast } = useApp();
  const [cookingMode, setCookingMode] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const recipe = MOCK_RECIPES.find(item => item.id === selectedRecipeId) || MOCK_RECIPES[0];
  const favorited = isFavorite('recipes', recipe.id);

  const startCooking = () => {
    setCookingMode(true);
    setCurrentStep(0);
    showToast('已进入沉浸式烹饪教学引导', 'success');
  };

  const handleNextStep = () => {
    if (currentStep < recipe.steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      setCookingMode(false);
      showToast('恭喜！食养药膳制作完成，温热服下调摄元气吧！', 'success');
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  // Maps ingredient icon string to Lucide React component
  const getIngredientIcon = (iconName: string) => {
    switch (iconName) {
      case 'Sprout': return <Flame className="w-5 h-5 text-orange-600 bg-orange-100/30 p-1 rounded" />;
      case 'Leaf': return <Leaf className="w-5 h-5 text-emerald-600 bg-emerald-100/30 p-1 rounded" />;
      case 'Flame': return <Flame className="w-5 h-5 text-amber-600 bg-amber-100/30 p-1 rounded" />;
      default: return <Compass className="w-5 h-5 text-sky-600 bg-sky-100/30 p-1 rounded" />;
    }
  };

  return (
    <div id="recipe_detail_view" className="max-w-7xl mx-auto px-6 py-8 w-full">
      
      {/* Standard back/favorite toggler */}
      <div className="flex items-center justify-between mb-6" id="recipe_breadcrumbs">
        <button 
          onClick={goBack}
          className="flex items-center gap-1.5 text-xs font-bold text-[#747968] hover:text-[#466805] transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>返回食谱列表</span>
        </button>

        <button
          onClick={() => toggleFavorite('recipes', recipe.id)}
          className="flex items-center gap-1.5 text-xs font-bold text-[#747968] hover:text-[#466805] px-3 py-1.5 rounded-full border border-black/5 bg-white shadow-xs cursor-pointer"
        >
          <Heart className={`w-4 h-4 ${favorited ? 'text-red-500 fill-red-500' : 'text-neutral-400'}`} />
          <span>{favorited ? '已收藏' : '加入收藏'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left column: Photo Card with core details */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-3xl border border-black/5 bg-white p-3 shadow-xs">
            <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden bg-neutral-100">
              <img 
                src={recipe.image} 
                alt={recipe.name} 
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent flex items-end p-6">
                <div>
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {recipe.benefits.map((b, i) => (
                      <span key={i} className="px-2.5 py-0.5 rounded-full bg-[#c5f183]/90 text-[#466805] text-[9px] font-black">
                        {b}
                      </span>
                    ))}
                  </div>
                  <h2 className="text-2xl font-black text-white">{recipe.name}</h2>
                </div>
              </div>
            </div>
          </div>

          {/* Cooking duration & difficulty badges */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white border border-black/5 p-4 rounded-2xl flex items-center gap-3 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-[#7ba23f]/10 text-[#466805] flex items-center justify-center font-bold">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-[#747968] font-bold block">制作时间</span>
                <p className="text-sm font-black text-[#1b1c1c]">{recipe.time}</p>
              </div>
            </div>

            <div className="bg-white border border-black/5 p-4 rounded-2xl flex items-center gap-3 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-850 flex items-center justify-center font-bold">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-[#747968] font-bold block">调理等级</span>
                <p className="text-sm font-black text-[#1b1c1c]">{recipe.difficulty}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right column: Ingredients & Steps */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Brief and introduction */}
          <div className="bg-white border border-black/5 rounded-3xl p-6 shadow-xs space-y-3">
            <h3 className="text-base font-black text-[#1b1c1c]">食养辨证功用及简介</h3>
            <p className="text-xs text-[#44493a] leading-relaxed font-semibold">
              {recipe.intro}
            </p>
          </div>

          {/* Ingredient inventory */}
          <div className="bg-white border border-black/5 rounded-3xl p-6 shadow-xs space-y-4">
            <h3 className="text-base font-black text-[#1b1c1c]">药用与膳食材料准备</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {recipe.ingredients.map((ing, i) => (
                <div key={i} className="flex items-center gap-2.5 p-3 rounded-xl border border-black/[0.03] bg-neutral-50/50">
                  {getIngredientIcon(ing.icon)}
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-[#1b1c1c] truncate">{ing.name}</p>
                    <p className="text-[10px] text-[#747968] font-semibold mt-0.5">{ing.quantity}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Workflow Steps */}
          <div className="bg-white border border-black/5 rounded-3xl p-6 shadow-xs space-y-6">
            <h3 className="text-base font-black text-[#1b1c1c]">秘法烹饪炖煮流程</h3>
            
            <div className="space-y-6 relative border-l border-[#7ba23f]/10 pl-6 ml-3">
              {recipe.steps.map((step, idx) => (
                <div key={idx} className="relative space-y-1">
                  
                  {/* Number bubble left */}
                  <div className="absolute -left-[37px] top-0 w-6 h-6 rounded-full bg-white border-2 border-[#7ba23f] flex items-center justify-center font-mono font-bold text-xs text-[#466805]">
                    {String(idx + 1).padStart(2, '0')}
                  </div>

                  <p className="text-xs text-[#44493a] font-semibold leading-relaxed">
                    {step}
                  </p>
                </div>
              ))}
            </div>

            {/* Launch teaching */}
            <div className="pt-2">
              <button
                onClick={startCooking}
                className="w-full h-11 rounded-xl bg-[#7ba23f] hover:bg-[#466805] text-white text-xs font-extrabold flex items-center justify-center gap-1.5 shadow-xs transition-all cursor-pointer"
                id="recipe_start_cooking"
              >
                <Play className="w-4 h-4 fill-white text-white" />
                <span>进入智能烹饪随身教学</span>
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* Cooking Mode Floating Screen Overlay */}
      <AnimatePresence>
        {cookingMode && (
          <div className="fixed inset-0 z-50 bg-[#fbf9f8] flex flex-col justify-between" id="cooking_mode_modal">
            
            {/* Top Close bar */}
            <header className="p-4 border-b border-black/5 bg-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#7ba23f]/10 text-[#466805] flex items-center justify-center">
                  <Flame className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-[#1b1c1c]">Chef Balance · 烹饪指导中</h3>
                  <p className="text-[10px] text-[#747968] font-bold">正在手把手制作：【{recipe.name}】</p>
                </div>
              </div>

              <button 
                onClick={() => setCookingMode(false)}
                className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center text-neutral-400 hover:text-neutral-600 transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </header>

            {/* Middle Main Viewport */}
            <div className="flex-1 max-w-2xl mx-auto w-full px-6 py-12 flex flex-col items-center justify-center space-y-8">
              
              <div className="text-center space-y-2">
                <span className="text-[10px] font-black uppercase tracking-wider bg-[#7ba23f]/10 text-[#466805] px-3 py-1 rounded-full">
                  STEP {currentStep + 1} / {recipe.steps.length}
                </span>
                
                {/* Visual state illustration representation */}
                <div className="w-32 h-31 rounded-full bg-[#7ba23f]/10 flex items-center justify-center text-[#466805] mx-auto animate-pulse">
                  <Utensils className="w-12 h-12" />
                </div>
              </div>

              {/* Step instructions */}
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white border border-black/5 rounded-3xl p-8 shadow-md text-center max-w-md w-full"
              >
                <p className="text-sm font-extrabold text-[#1b1c1c] leading-relaxed">
                  {recipe.steps[currentStep]}
                </p>
              </motion.div>

              {/* Progress bar */}
              <div className="w-full max-w-md bg-neutral-200 h-1.5 rounded-full overflow-hidden">
                <div 
                  className="bg-[#7ba23f] h-full transition-all duration-300" 
                  style={{ width: `${((currentStep + 1) / recipe.steps.length) * 100}%` }}
                />
              </div>

            </div>

            {/* Bottom Actions control bar */}
            <div className="p-6 bg-white border-t border-black/5 flex items-center justify-between">
              
              <button
                type="button"
                onClick={handlePrevStep}
                disabled={currentStep === 0}
                className="px-5 py-2.5 rounded-xl border border-black/5 text-[#747968] active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed text-xs font-bold flex items-center gap-1 transition-all cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>上一步</span>
              </button>

              <button
                type="button"
                onClick={handleNextStep}
                className="px-6 py-3 rounded-xl bg-[#7ba23f] hover:bg-[#466805] text-white active:scale-95 text-xs font-black flex items-center gap-1.5 shadow-md shadow-[#7ba23f]/10 transition-all cursor-pointer"
              >
                <span>
                  {currentStep === recipe.steps.length - 1 ? '完成大作并退出' : '下一步，进行烹煮'}
                </span>
                <ChevronRight className="w-4 h-4" />
              </button>

            </div>

          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
