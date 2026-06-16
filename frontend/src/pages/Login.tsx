/**
 * Login / Register page — username + password, with guest fallback.
 */
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Sprout, User, Lock, ArrowRight, Compass, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

export const Login: React.FC = () => {
  const { login, guestLogin, register: registerUser } = useApp();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!username.trim() || !password.trim()) {
      setError('请填写用户名和密码');
      return;
    }
    setLoading(true);
    try {
      if (mode === 'register') {
        await registerUser(username.trim(), password);
      } else {
        await login(username.trim(), password);
      }
    } catch (err: any) {
      setError(err?.response?.data?.detail || err?.message || '操作失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="login_container" className="min-h-screen w-full flex bg-[#fbf9f8]">

      {/* Left: atmosphere */}
      <div className="hidden md:flex md:w-[45%] bg-gradient-to-b from-[#466805]/95 to-[#1b1c1c]/95 relative items-center justify-center p-12 text-white overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full bg-[#7ba23f]/10 filter blur-3xl" />
        <div className="relative z-10 flex flex-col items-center text-center space-y-6 max-w-sm">
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-[#c5f183] border border-white/20 shadow-xl"
          >
            <Sprout className="w-8 h-8 filter drop-shadow-[0_0_15px_rgba(197,241,131,0.6)]" />
          </motion.div>
          <h1 className="text-4xl font-black tracking-tight select-none">Balance</h1>
          <p className="text-sm text-neutral-300 font-medium leading-relaxed">
            "法于阴阳，和于术数，食饮有节，起居有常。"
          </p>
          <div className="h-0.5 w-12 bg-[#c5f183]/50 rounded-full" />
          <p className="text-xs text-neutral-400 font-semibold uppercase tracking-wider max-w-[280px]">
            汲取千年中医调理智慧，复元身心自然抗力与生命生机。
          </p>
        </div>
        <div className="absolute bottom-8 text-neutral-500 font-mono text-[10px]">
          Balance Core Assistant Team · Cloud Dev Suite
        </div>
      </div>

      {/* Right: login / register form */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-12 relative">

        {/* Guest access */}
        <div className="absolute top-6 right-6">
          <button
            type="button"
            onClick={() => guestLogin()}
            className="flex items-center gap-1.5 text-xs font-bold text-[#747968] hover:text-[#466805] px-3.5 py-2 rounded-xl bg-white border border-black/5 hover:border-[#7ba23f]/30 hover:shadow-xs transition-all cursor-pointer"
          >
            <Compass className="w-3.5 h-3.5" />
            <span>游客快捷体验</span>
          </button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm"
        >
          {/* Mobile logo */}
          <div className="md:hidden flex flex-col items-center text-center space-y-2 mb-8">
            <div className="w-12 h-12 rounded-xl bg-[#7ba23f]/15 flex items-center justify-center text-[#466805]">
              <Sprout className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-black text-[#466805]">Balance</h1>
            <p className="text-xs text-[#747968]">智慧中医健康助手</p>
          </div>

          <div className="text-center md:text-left mb-8">
            <h2 className="text-2xl font-black text-[#1b1c1c] tracking-tight">
              {mode === 'login' ? '欢迎回来' : '创建账号'}
            </h2>
            <p className="text-xs text-[#747968] font-semibold mt-1">
              {mode === 'login' ? '登录您的私人国医健康顾问。' : '注册后享受专属体质管理与药食调理。'}
            </p>
          </div>

          {/* Mode toggle */}
          <div className="grid grid-cols-2 p-1 bg-[#efeded] rounded-xl mb-6">
            <button
              onClick={() => { setMode('login'); setError(''); }}
              className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                mode === 'login'
                  ? 'bg-white text-[#466805] shadow-xs'
                  : 'text-[#747968] hover:text-[#1b1c1c]'
              }`}
            >
              登录
            </button>
            <button
              onClick={() => { setMode('register'); setError(''); }}
              className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                mode === 'register'
                  ? 'bg-white text-[#466805] shadow-xs'
                  : 'text-[#747968] hover:text-[#1b1c1c]'
              }`}
            >
              注册
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#44493a] mb-1.5">用户名</label>
              <div className="relative">
                <User className="absolute left-3.5 top-3 w-4 h-4 text-neutral-400" />
                <input
                  type="text"
                  placeholder="输入用户名（中英文均可）"
                  maxLength={20}
                  value={username}
                  onChange={(e) => { setUsername(e.target.value); setError(''); }}
                  className="w-full bg-[#efeded] border border-transparent focus:border-[#7ba23f]/40 focus:bg-white rounded-xl py-2.5 pl-10 pr-4 text-sm font-semibold outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#44493a] mb-1.5">密码</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 w-4 h-4 text-neutral-400" />
                <input
                  type="password"
                  placeholder="至少 6 位密码"
                  maxLength={64}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(''); }}
                  className="w-full bg-[#efeded] border border-transparent focus:border-[#7ba23f]/40 focus:bg-white rounded-xl py-2.5 pl-10 pr-4 text-sm font-semibold outline-none transition-all"
                />
              </div>
            </div>

            {error && (
              <p className="text-xs font-bold text-red-500 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-xl bg-[#7ba23f] hover:bg-[#466805] disabled:bg-neutral-300 text-white text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all shadow-md shadow-[#7ba23f]/10 cursor-pointer"
            >
              {loading ? (
                <><Sparkles className="w-4 h-4 animate-spin" />处理中...</>
              ) : (
                <><span>{mode === 'register' ? '创建账号并登录' : '登录'}</span><ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          {/* Guest fallback */}
          <div className="mt-8 pt-6 border-t border-black/5 text-center">
            <button
              onClick={() => guestLogin()}
              className="text-xs text-[#747968] font-bold hover:text-[#466805] space-x-1 cursor-pointer"
            >
              <span>暂不注册？</span>
              <span className="text-[#7ba23f] underline">以游客身份直接体验 &rarr;</span>
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
