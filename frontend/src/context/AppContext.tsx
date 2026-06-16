/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { ConsultationRecord, ReminderItem, FeedbackItem, ConstitutionType } from '../types';
import { MOCK_HISTORY, DEFAULT_REMINDERS } from '../data';
import { loginGuest as apiLoginGuest, loginPhone as apiLoginPhone, loginWithPassword as apiLoginWithPassword, register as apiRegister, getMe as apiGetMe, getHistory as apiGetHistory } from '../api/services';

// 页面类型定义
export type AppTab = 'home' | 'herbs' | 'recipes' | 'workouts' | 'profile';

export type AppPage = 
  | 'login'
  | 'home-main'
  | 'herb-detail'
  | 'recipe-detail'
  | 'workout-detail'
  | 'favorites'
  | 'history'
  | 'settings'
  | 'about'
  | 'feedback'
  | 'constitution-test'
  | 'reminders'
  | 'tongue-scan';

interface UserProfile {
  name: string;
  avatar: string;
  level: string;
  constitution: ConstitutionType | '未测试';
}

interface AppContextType {
  isLoggedIn: boolean;
  authChecked: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string) => Promise<void>;
  logout: () => void;
  guestLogin: () => Promise<void>;
  user: UserProfile;
  updateUser: (updates: Partial<UserProfile>) => void;
  
  // 导航
  activeTab: AppTab;
  activePage: AppPage;
  prevPage: AppPage | null;
  selectedHerbId: string | null;
  selectedRecipeId: string | null;
  selectedWorkoutId: string | null;
  
  navigateTo: (page: AppPage, tab?: AppTab, selectedId?: { herb?: string, recipe?: string, workout?: string }) => void;
  goBack: () => void;
  
  // 收藏
  favorites: {
    herbs: string[];
    recipes: string[];
    workouts: string[];
  };
  toggleFavorite: (type: 'herbs' | 'recipes' | 'workouts', id: string) => void;
  isFavorite: (type: 'herbs' | 'recipes' | 'workouts', id: string) => boolean;
  
  // 咨询历史
  history: ConsultationRecord[];
  addConsultation: (record: Omit<ConsultationRecord, 'id' | 'date'>, backendId?: string) => void;
  pendingConsultation: ConsultationRecord | null;
  resumeConsultation: (record: ConsultationRecord) => void;
  clearPendingConsultation: () => void;
  
  // 提醒
  reminders: ReminderItem[];
  toggleReminder: (id: string) => void;
  addReminder: (reminder: Omit<ReminderItem, 'id' | 'active'>) => void;
  
  // 反馈
  feedbackList: FeedbackItem[];
  submitFeedback: (type: string, content: string, email: string) => void;
  
  // Toast机制
  toast: { message: string; type: 'success' | 'error' | 'info' } | null;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  hideToast: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 认证状态
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [authChecked, setAuthChecked] = useState<boolean>(false);
  const [user, setUser] = useState<UserProfile>({
    name: '',
    avatar: '',
    level: '',
    constitution: '未测试'
  });

  // 导航状态
  const [activeTab, setActiveTab] = useState<AppTab>('home');
  const [activePage, setActivePage] = useState<AppPage>('home-main');
  const [historyStack, setHistoryStack] = useState<AppPage[]>(['home-main']);
  
  const [selectedHerbId, setSelectedHerbId] = useState<string | null>(null);
  const [selectedRecipeId, setSelectedRecipeId] = useState<string | null>(null);
  const [selectedWorkoutId, setSelectedWorkoutId] = useState<string | null>(null);

  // 业务数据
  const [favorites, setFavorites] = useState<{ herbs: string[]; recipes: string[]; workouts: string[] }>({
    herbs: ['h1', 'h2'],
    recipes: ['r1'],
    workouts: ['w1']
  });
  const [history, setHistory] = useState<ConsultationRecord[]>([]);
  const [pendingConsultation, setPendingConsultation] = useState<ConsultationRecord | null>(null);
  const [reminders, setReminders] = useState<ReminderItem[]>(DEFAULT_REMINDERS);
  const [feedbackList, setFeedbackList] = useState<FeedbackItem[]>([]);

  // Toast
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  // 页面切换的核心控制函数
  const navigateTo = (
    page: AppPage, 
    tab?: AppTab, 
    selectedId?: { herb?: string; recipe?: string; workout?: string }
  ) => {
    // 滚动回顶部
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // 更新历史栈
    setHistoryStack(prev => [...prev, page]);
    
    if (tab) {
      setActiveTab(tab);
    }
    
    if (selectedId) {
      if (selectedId.herb) setSelectedHerbId(selectedId.herb);
      if (selectedId.recipe) setSelectedRecipeId(selectedId.recipe);
      if (selectedId.workout) setSelectedWorkoutId(selectedId.workout);
    }
    
    setActivePage(page);
  };

  const goBack = () => {
    if (historyStack.length > 1) {
      const newStack = [...historyStack];
      newStack.pop(); // 弹出当前页
      const prev = newStack[newStack.length - 1];
      setHistoryStack(newStack);
      setActivePage(prev);
    } else {
      navigateTo('home-main', 'home');
    }
  };

  // ── Auto-login: check existing token on mount ──────────────────────────
  useEffect(() => {
    const tryAutoLogin = async () => {
      const token = localStorage.getItem('tcm_token');
      if (!token) {
        setAuthChecked(true);
        return;
      }
      try {
        const me = await apiGetMe();
        setUser({
          name: me.name,
          avatar: me.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
          level: me.level,
          constitution: (me.constitution as ConstitutionType) || '未测试',
        });
        setIsLoggedIn(true);
        // Load user's own history from backend
        try {
          const records = await apiGetHistory();
          if (records && records.length > 0) setHistory(records as ConsultationRecord[]);
        } catch {}
      } catch {
        localStorage.removeItem('tcm_token');
      }
      setAuthChecked(true);
    };
    tryAutoLogin();
  }, []);

  const loadHistory = async () => {
    try {
      const records = await apiGetHistory();
      if (records && records.length > 0) setHistory(records as ConsultationRecord[]);
    } catch {}
  };

  const applyLogin = (res: { access_token: string; user: { name: string; avatar: string | null; level: string; constitution: string; is_guest: boolean } }) => {
    localStorage.setItem('tcm_token', res.access_token);
    setIsLoggedIn(true);
    setUser({
      name: res.user.name,
      avatar: res.user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      level: res.user.level,
      constitution: (res.user.constitution as ConstitutionType) || '未测试',
    });
    loadHistory();
    navigateTo('home-main', 'home');
  };

  const login = async (username: string, password: string) => {
    const res = await apiLoginWithPassword(username, password);
    applyLogin(res);
    showToast('登录成功，欢迎回来！', 'success');
  };

  const register = async (username: string, password: string) => {
    const res = await apiRegister(username, password);
    applyLogin(res);
    showToast('注册成功，欢迎开启健康之旅！', 'success');
  };

  const logout = () => {
    localStorage.removeItem('tcm_token');
    setIsLoggedIn(false);
    navigateTo('login');
    showToast('已安全退出登录', 'info');
  };

  const guestLogin = async () => {
    try {
      const res = await apiLoginGuest();
      applyLogin(res);
      showToast('以游客身份登录成功', 'success');
    } catch {
      setIsLoggedIn(true);
      setUser({
        name: '神农山客(游客)',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
        level: '体验成员',
        constitution: '未测试'
      });
      navigateTo('home-main', 'home');
      showToast('以游客身份登录（离线模式）', 'success');
    }
  };

  const updateUser = (updates: Partial<UserProfile>) => {
    setUser(prev => ({ ...prev, ...updates }));
  };

  const toggleFavorite = (type: 'herbs' | 'recipes' | 'workouts', id: string) => {
    setFavorites(prev => {
      const current = prev[type];
      const exists = current.includes(id);
      const updated = exists ? current.filter(item => item !== id) : [...current, id];
      
      const typeLabel = type === 'herbs' ? '草药' : type === 'recipes' ? '食谱' : '功法';
      showToast(exists ? `已取消收藏该${typeLabel}` : `已加入我的收藏`, exists ? 'info' : 'success');

      return {
        ...prev,
        [type]: updated
      };
    });
  };

  const isFavorite = (type: 'herbs' | 'recipes' | 'workouts', id: string): boolean => {
    return favorites[type].includes(id);
  };

  const addConsultation = (record: Omit<ConsultationRecord, 'id' | 'date'>, backendId?: string) => {
    const newRecord: ConsultationRecord = {
      ...record,
      id: backendId || `c_${Date.now()}`,
      date: new Date().toISOString().split('T')[0]
    };
    setHistory(prev => [newRecord, ...prev]);
  };

  const resumeConsultation = (record: ConsultationRecord) => {
    setPendingConsultation(record);
    navigateTo('home-main', 'home');
  };

  const clearPendingConsultation = () => {
    setPendingConsultation(null);
  };

  const toggleReminder = (id: string) => {
    setReminders(prev => prev.map(item => {
      if (item.id === id) {
        const nextState = !item.active;
        showToast(nextState ? `提醒已开启` : `提醒已关闭`, 'success');
        return { ...item, active: nextState };
      }
      return item;
    }));
  };

  const addReminder = (reminder: Omit<ReminderItem, 'id' | 'active'>) => {
    const newItem: ReminderItem = {
      ...reminder,
      id: `r_${Date.now()}`,
      active: true
    };
    setReminders(prev => [...prev, newItem]);
    showToast('健康提醒添加成功！', 'success');
  };

  const submitFeedback = (type: string, content: string, email: string) => {
    const newItem: FeedbackItem = {
      id: `f_${Date.now()}`,
      type,
      content,
      email,
      date: new Date().toISOString().split('T')[0]
    };
    setFeedbackList(prev => [newItem, ...prev]);
  };

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
  };

  const hideToast = () => {
    setToast(null);
  };

  // Toast自动隐藏
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  return (
    <AppContext.Provider value={{
      isLoggedIn,
      authChecked,
      login,
      register,
      logout,
      guestLogin,
      user,
      updateUser,
      activeTab,
      activePage,
      prevPage: historyStack.length > 1 ? historyStack[historyStack.length - 2] : null,
      selectedHerbId,
      selectedRecipeId,
      selectedWorkoutId,
      navigateTo,
      goBack,
      favorites,
      toggleFavorite,
      isFavorite,
      history,
      addConsultation,
      pendingConsultation,
      resumeConsultation,
      clearPendingConsultation,
      reminders,
      toggleReminder,
      addReminder,
      feedbackList,
      submitFeedback,
      toast,
      showToast,
      hideToast
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
