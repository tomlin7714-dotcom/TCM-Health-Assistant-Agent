/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Sprout, MessageSquare, Phone, ArrowRight, Compass } from 'lucide-react';
import { motion } from 'motion/react';

export const Login: React.FC = () => {
  const { login, guestLogin } = useApp();
  const [phone, setPhone] = useState('');
  const [smsCode, setSmsCode] = useState('');
  const [loginMethod, setLoginMethod] = useState<'scan' | 'phone'>('scan');

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || phone.length < 11) {
      alert('请输入正确的11位手机号码');
      return;
    }
    login(phone);
  };

  return (
    <div id="login_container" className="min-h-screen w-full flex bg-[#fbf9f8]">
      
      {/* Left Column: Cozy Forest TCM atmosphere */}
      <div className="hidden md:flex md:w-[45%] bg-gradient-to-b from-[#466805]/95 to-[#1b1c1c]/95 relative items-center justify-center p-12 text-white overflow-hidden">
        {/* Subtle decorative background blur */}
        <div className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full bg-[#7ba23f]/10 filter blur-3xl" />
        
        <div className="relative z-10 flex flex-col items-center text-center space-y-6 max-w-sm">
          <motion.div 
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-[#c5f183] border border-white/20 shadow-xl"
          >
            <Sprout className="w-8 h-8 filter drop-shadow-[0_0_15px_rgba(197,241,131,0.6)]" />
          </motion.div>

          <h1 className="text-4xl font-black tracking-tight select-none font-sans">
            Balance
          </h1>

          <p className="text-sm text-neutral-300 font-medium leading-relaxed">
            “法于阴阳，和于术数，食饮有节，起居有常。”
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

      {/* Right Column: Interactive card */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-12 relative">
        
        {/* Top bar right (Guest access shortcut) */}
        <div className="absolute top-6 right-6">
          <button 
            type="button"
            onClick={guestLogin}
            className="flex items-center gap-1.5 text-xs font-bold text-[#747968] hover:text-[#466805] px-3.5 py-2 rounded-xl bg-white border border-black/5 hover:border-[#7ba23f]/30 hover:shadow-xs transition-all cursor-pointer"
          >
            <Compass className="w-3.5 h-3.5" />
            <span>游客快捷通道</span>
          </button>
        </div>

        {/* Core input workspace card */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm"
          id="login_card"
        >
          {/* Logo representation for mobile viewers */}
          <div className="md:hidden flex flex-col items-center text-center space-y-2 mb-8">
            <div className="w-12 h-12 rounded-xl bg-[#7ba23f]/15 flex items-center justify-center text-[#466805]">
              <Sprout className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-black text-[#466805]">Balance</h1>
            <p className="text-xs text-[#747968]">智慧中医健康助手</p>
          </div>

          <div className="text-center md:text-left mb-8">
            <h2 className="text-2xl font-black text-[#1b1c1c] tracking-tight">
              欢迎开启健康调理
            </h2>
            <p className="text-xs text-[#747968] font-semibold mt-1">
              您的特享私人国医体质测试与药食管理顾问。
            </p>
          </div>

          {/* Toggle buttons between Wechat Scan vs Phone login */}
          <div className="grid grid-cols-2 p-1 bg-[#efeded] rounded-xl mb-6">
            <button
              onClick={() => setLoginMethod('scan')}
              id="toggle_login_scan"
              className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                loginMethod === 'scan' 
                  ? 'bg-white text-[#466805] shadow-xs' 
                  : 'text-[#747968] hover:text-[#1b1c1c]'
              }`}
            >
              微信扫码登录
            </button>
            <button
              onClick={() => setLoginMethod('phone')}
              id="toggle_login_phone"
              className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                loginMethod === 'phone' 
                  ? 'bg-white text-[#466805] shadow-xs' 
                  : 'text-[#747968] hover:text-[#1b1c1c]'
              }`}
            >
              手机验证码登录
            </button>
          </div>

          {loginMethod === 'scan' ? (
            /* Method A: Emulated Wechat QR scan login */
            <div className="flex flex-col items-center bg-white border border-black/5 rounded-2xl p-6 shadow-xs relative overflow-hidden group">
              <div className="w-48 h-48 bg-neutral-50 rounded-xl border border-black/5 flex items-center justify-center relative p-2">
                
                {/* Simulated QR Code representation */}
                <div className="w-full h-full bg-slate-900 rounded-lg flex flex-col items-center justify-center p-3 text-center space-y-2 opacity-95">
                  <div className="w-24 h-24 bg-white p-1 rounded-sm grid grid-cols-3 grid-rows-3 gap-0.5">
                    {/* Emulating a QR pixel block */}
                    <div className="bg-black rounded-xs"></div>
                    <div className="bg-black rounded-xs"></div>
                    <div className="bg-white"></div>
                    <div className="bg-white"></div>
                    <div className="bg-black rounded-xs"></div>
                    <div className="bg-black rounded-xs"></div>
                    <div className="bg-black rounded-xs"></div>
                    <div className="bg-white"></div>
                    <div className="bg-black rounded-xs"></div>
                  </div>
                  <span className="text-[10px] text-zinc-400 font-semibold font-mono">
                    Scan Secure QR
                  </span>
                </div>

                {/* Cover hovering success button */}
                <div className="absolute inset-0 bg-[#466805]/95 rounded-xl opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-center p-4 transition-all duration-300">
                  <MessageSquare className="w-8 h-8 text-[#c5f183] mb-2 animate-bounce" />
                  <p className="text-xs font-bold text-white">微信扫码快捷体验</p>
                  <p className="text-[10px] text-neutral-300 mt-1">鼠标点击即可确认登录</p>
                  <button
                    onClick={() => login('林清然(微信)')}
                    className="mt-3 text-xs bg-[#c5f183] text-[#466805] font-extrabold px-4 py-1.5 rounded-lg active:scale-95 transition-all cursor-pointer"
                  >
                    确认一键登录
                  </button>
                </div>

              </div>

              <p className="text-xs text-[#747968] font-bold mt-4 text-center">
                请打开微信 【扫一扫】 扫描上方二维码
              </p>
              <p className="text-[10px] text-neutral-400 mt-1">
                首次登录将自动为您注册 Balance 账号
              </p>
            </div>
          ) : (
            /* Method B: SMS OTP login input */
            <form onSubmit={handlePhoneSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#44493a] mb-1.5">手机号码</label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-3 w-4 h-4 text-neutral-400" />
                  <input
                    type="tel"
                    placeholder="13800000000"
                    maxLength={11}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                    id="login_phone_input"
                    className="w-full bg-[#efeded] border border-transparent focus:border-[#7ba23f]/40 focus:bg-white rounded-xl py-2.5 pl-10 pr-4 text-sm font-semibold outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#44493a] mb-1.5">短信验证码</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="请输入6位验证码"
                    value={smsCode}
                    onChange={(e) => setSmsCode(e.target.value.replace(/\D/g, ''))}
                    className="flex-1 bg-[#efeded] border border-transparent focus:border-[#7ba23f]/40 focus:bg-white rounded-xl px-4 text-sm font-semibold outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => alert('验证码已发送，测试码为：123456')}
                    className="text-xs bg-[#7ba23f]/10 text-[#466805] hover:bg-[#7ba23f]/20 font-bold px-4 rounded-xl transition-all h-10 cursor-pointer"
                  >
                    获取验证码
                  </button>
                </div>
              </div>

              <button
                type="submit"
                id="login_phone_submit"
                className="w-full h-11 rounded-xl bg-[#7ba23f] hover:bg-[#466805] text-white text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all shadow-md shadow-[#7ba23f]/10 cursor-pointer"
              >
                <span>进入您的调理助手</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* Guest toggle footer */}
          <div className="mt-8 pt-6 border-t border-black/5 text-center">
            <button
              onClick={guestLogin}
              className="text-xs text-[#747968] font-bold hover:text-[#466805] space-x-1 cursor-pointer"
            >
              <span>无需账号？</span>
              <span className="text-[#7ba23f] underline">以游客身份直接体验 &rarr;</span>
            </button>
          </div>

        </motion.div>
      </div>

    </div>
  );
};
