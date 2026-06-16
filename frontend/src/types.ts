/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// 咨询记录
export interface ConsultationRecord {
  id: string;
  title: string;
  date: string;
  type: 'pulse' | 'review' | 'tongue' | 'seasonal';
  symptoms: string;
  analysis?: string;
  suggestion: string;
  imageUrl?: string;
}

// 草药
export interface HerbItem {
  id: string;
  name: string;           // 中文名
  pinyin: string;         // 拼音
  property: string;       // 药性（微温、平、微寒、热等）
  flavor: string;         // 五味归经
  origin: string;         // 经典出处
  description: string;    // 简介
  isFeatured?: boolean;
  effect: string;         // 功效概述
  treatment: string[];    // 主治应用
  research: string;       // 现代研究
  taboos: string[];       // 使用禁忌
  image: string;          // 图片URL
}

// 食食材料
export interface Ingredient {
  name: string;
  quantity: string;
  icon: string;
}

// 食谱
export interface RecipeItem {
  id: string;
  name: string;
  benefits: string[];     // 功效标签
  time: string;           // 制作时间
  difficulty: string;     // 难度
  intro: string;          // 简介
  ingredients: Ingredient[];
  steps: string[];        // 制作步骤
  image: string;
}

// 导引锻炼
export interface WorkoutItem {
  id: string;
  name: string;
  subtitle: string;       // 副标题/来源
  teacher: string;        // 老师
  level: string;          // 难度等级
  students: number;       // 练习人数
  calories: number;       // 消耗卡路里
  actionsCount: number;   // 动作数量
  intro: string;          // 简介
  image: string;
  actions: { order: number; title: string; keys: string; role: string }[];
}

// 提醒
export interface ReminderItem {
  id: string;
  name: string;
  time: string;
  frequency: string;
  type: 'qigong' | 'tea' | 'sleep' | 'acupoint';
  active: boolean;
}

// 全局状态和反馈
export interface FeedbackItem {
  id: string;
  type: string;
  content: string;
  email: string;
  date: string;
}

export type ConstitutionType = 
  | '平和质' 
  | '阳虚质' 
  | '气虚质' 
  | '阴虚质' 
  | '痰湿质' 
  | '湿热质' 
  | '血瘀质' 
  | '气郁质' 
  | '特禀质';
