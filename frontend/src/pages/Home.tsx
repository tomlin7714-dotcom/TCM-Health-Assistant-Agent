/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Brain, Activity, Star, Send, Sparkles, Image, X, MessageCircle, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { MOCK_HERBS, MOCK_RECIPES } from '../data';
import { diagnose, diagnoseStream, loginGuest, sendChatMessage, syncChatLog } from '../api/services';
import type { ChatMessage } from '../api/services';

export const Home: React.FC = () => {
  const { navigateTo, addConsultation, history, showToast, pendingConsultation, clearPendingConsultation, updateConsultationSuggestion } = useApp();
  const [symptomText, setSymptomText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [imageName, setImageName] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [aiResult, setAiResult] = useState<{
    symptoms: string;
    title: string;
    diagnosis: string;
    advice: string;
    herbId: string;
    recipeId: string;
  } | null>(null);

  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [followUpText, setFollowUpText] = useState('');
  const [isFollowUpLoading, setIsFollowUpLoading] = useState(false);
  const [consultationId, setConsultationId] = useState<string | null>(null);
  const [streamStatus, setStreamStatus] = useState<string>('');
  const chatEndRef = useRef<HTMLDivElement>(null);
  const streamCtrlRef = useRef<AbortController | null>(null);

  const quickSymptoms = [
    { label: '手脚冰冷、怕冷畏寒', text: '平时特别怕冷，经常手脚冰凉，冬天钻进被窝很久也捂不暖，稍微吃点冷的东西就觉得肚子隐隐作痛、肚子胀气。' },
    { label: '睡眠不佳、多梦易醒', text: '最近睡眠质量很差，晚上躺下很久睡不着，梦特别多、而且容易惊醒。白天感觉精神憔悴、头晕眼花、注意力不太集中。' },
    { label: '肚子胀气、大便稀溏', text: '吃过晚饭之后肚子经常觉得胀胀的，经常不停打嗝，胃部有点发酸。早起排便不畅，大便稀溏、不太成形，舌苔也有一层白。' },
  ];

  const handleQuickTag = (text: string) => {
    setSymptomText(text);
    showToast('已填入对应症状描述', 'info');
  };

  const handleCleanText = () => {
    setSymptomText('');
    setUploadedImage(null);
    setImageName('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleTriggerUpload = () => fileInputRef.current?.click();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      showToast('图片尺寸过大，请选择 5MB 以内的图片', 'error');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setUploadedImage(reader.result as string);
      setImageName(file.name);
      showToast('症状实拍/舌象图片已成功载入！', 'success');
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setUploadedImage(null);
    setImageName('');
    if (fileInputRef.current) fileInputRef.current.value = '';
    showToast('已取消图片上传', 'info');
  };

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!symptomText.trim()) {
      showToast('请先输入您的身体健康症状描述。', 'error');
      return;
    }
    setIsAnalyzing(true);
    setAiResult(null);
    setStreamStatus('');

    let token = localStorage.getItem('tcm_token');
    if (!token) {
      try {
        const res = await loginGuest();
        token = res.access_token;
        localStorage.setItem('tcm_token', token);
      } catch { token = 'guest'; }
    }

    let accumulated = '';
    const matched = {
      symptoms: symptomText,
      title: '辨证中...',
      diagnosis: '',
      advice: '',
      herbId: 'h1',
      recipeId: 'r1',
    };
    setAiResult({ ...matched });
    setChatHistory([{ role: 'user', content: symptomText }, { role: 'assistant', content: '...' }]);

    streamCtrlRef.current = diagnoseStream(symptomText, uploadedImage ?? undefined, {
      onStatus(msg) { setStreamStatus(msg); },
      onToken(text) {
        accumulated += text;
        matched.diagnosis = accumulated;
        matched.advice = accumulated;
        setAiResult({ ...matched });
        setChatHistory([{ role: 'user', content: symptomText }, { role: 'assistant', content: accumulated }]);
      },
      onDone(data) {
        matched.title = data.title;
        matched.herbId = data.herb_id;
        matched.recipeId = data.recipe_id;
        matched.diagnosis = accumulated;
        matched.advice = accumulated;
        setAiResult({ ...matched });
        setChatHistory([{ role: 'user' as const, content: symptomText }, { role: 'assistant' as const, content: accumulated }]);
        const cid = data.consultation_id;
        if (cid) setConsultationId(cid);
        addConsultation({ title: data.title, type: 'tongue', symptoms: symptomText, analysis: accumulated, suggestion: accumulated }, cid);
        if (cid) {
          const json = JSON.stringify([{ role: 'user', content: symptomText }, { role: 'assistant', content: accumulated }]);
          syncChatLog(cid, json).catch(() => {});
          updateConsultationSuggestion(cid, json);
        }
        setIsAnalyzing(false);
        setStreamStatus('');
        showToast('本草精灵辨证完成！', 'success');
      },
      onError(msg) {
        showToast(msg || '服务暂时不可用', 'error');
        setIsAnalyzing(false);
        setStreamStatus('');
        setAiResult(null);
      },
    }, token || '');
  };

  const handleFollowUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!followUpText.trim() || !aiResult || isFollowUpLoading) return;
    const newMsg: ChatMessage = { role: 'user', content: followUpText };
    const updatedHistory = [...chatHistory, newMsg];
    setChatHistory(updatedHistory);
    setFollowUpText('');
    setIsFollowUpLoading(true);
    try {
      const res = await sendChatMessage({
        symptoms: aiResult.symptoms,
        diagnosis: aiResult.diagnosis,
        advice: aiResult.advice,
        conversation_history: chatHistory,
        new_message: followUpText,
      });
      const fullHistory = [...updatedHistory, { role: 'assistant' as const, content: res.reply }];
      setChatHistory(fullHistory);
      if (consultationId) {
        const json = JSON.stringify(fullHistory);
        syncChatLog(consultationId, json).catch(() => {});
        updateConsultationSuggestion(consultationId, json);
      }
    } catch (err: any) {
      setChatHistory([...updatedHistory, { role: 'assistant', content: '抱歉，暂时无法回复。请稍后重试。' }]);
      showToast(err?.response?.data?.detail ?? '追问发送失败', 'error');
    } finally {
      setIsFollowUpLoading(false);
    }
  };

  const handleNewSession = () => {
    streamCtrlRef.current?.abort();
    setAiResult(null);
    setChatHistory([]);
    setConsultationId(null);
    setSymptomText('');
    setUploadedImage(null);
    setImageName('');
    setStreamStatus('');
    setIsAnalyzing(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, isFollowUpLoading]);

  useEffect(() => {
    if (!pendingConsultation) return;
    const c = pendingConsultation;
    setConsultationId(c.id);
    let restoredChat: ChatMessage[] = [];
    try {
      if (c.suggestion && c.suggestion.startsWith('[')) {
        restoredChat = JSON.parse(c.suggestion);
      }
    } catch {}
    if (restoredChat.length === 0) {
      restoredChat = [
        { role: 'user', content: c.symptoms },
        { role: 'assistant', content: c.analysis || c.suggestion || '' },
      ];
    }
    setAiResult({
      symptoms: c.symptoms,
      title: c.title,
      diagnosis: c.analysis || '',
      advice: c.suggestion || '',
      herbId: 'h1',
      recipeId: 'r1',
    });
    setChatHistory(restoredChat);
    setSymptomText('');
    setUploadedImage(null);
    setImageName('');
    clearPendingConsultation();
    showToast('已恢复完整对话记录，可继续追问', 'info');
  }, [pendingConsultation]);

  const getHerbNameAndImg = (id: string) => {
    const h = MOCK_HERBS.find(item => item.id === id);
    return h ? { name: h.name, img: h.image } : { name: '人参', img: '' };
  };

  const getRecipeNameAndImg = (id: string) => {
    const r = MOCK_RECIPES.find(item => item.id === id);
    return r ? { name: r.name, img: r.image } : { name: '冬日红枣姜糖茶', img: '' };
  };

  return (
    <div id="home_view" className="h-screen flex flex-col max-w-7xl mx-auto px-4 sm:px-6 py-3 w-full overflow-hidden">

      {/* ── Top: Banner + 3 Cards (compact) ── */}
      <div className="shrink-0 space-y-2.5">
        <div className="rounded-2xl bg-gradient-to-r from-[#466805] via-[#466805]/95 to-[#7ba23f] text-white px-5 py-3.5 shadow-sm relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-1/4 opacity-10 pointer-events-none bg-gradient-to-l from-white to-transparent" />
          <div className="relative z-10 flex items-center gap-3">
            <div className="flex-1 min-w-0">
              <h1 className="text-lg sm:text-xl font-black tracking-tight">智能本草辨证 · 守护身心和谐</h1>
              <p className="text-[11px] text-neutral-200/80 font-medium mt-0.5 hidden sm:block">
                结合《黄帝内经》《伤寒杂病论》与 AI 大模型推理，量身定制调摄计划。
              </p>
            </div>
            {aiResult && (
              <button onClick={handleNewSession}
                className="shrink-0 px-3 py-1.5 rounded-lg bg-white/15 hover:bg-white/25 text-white text-xs font-bold transition-all cursor-pointer">
                + 新建问诊
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {[
            { label: '体质科学测评', sub: '九大体质测试', icon: Star, color: 'bg-amber-50 text-amber-700', nav: () => navigateTo('constitution-test', 'profile') },
            { label: '智能舌部扫描', sub: '舌色苔色分析', icon: Brain, color: 'bg-[#7ba23f]/10 text-[#466805]', nav: () => navigateTo('tongue-scan') },
            { label: '极快脉搏分析', sub: '脉象数据分析', icon: Activity, color: 'bg-purple-50 text-purple-700', nav: () => navigateTo('history', 'profile') },
          ].map((card) => (
            <div key={card.label} onClick={card.nav}
              className="bg-white border border-black/5 rounded-xl px-2.5 py-2 hover:border-[#7ba23f]/40 hover:shadow-sm transition-all cursor-pointer flex items-center gap-2 group">
              <div className={`w-7 h-7 rounded-lg ${card.color} flex items-center justify-center shrink-0`}>
                <card.icon className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-bold text-[#1b1c1c] group-hover:text-[#466805] transition-all truncate">{card.label}</p>
                <p className="text-[10px] text-[#747968] truncate hidden sm:block">{card.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Main Content: Chat Area + Sidebar (fills remaining height) ── */}
      <div className="flex-1 flex gap-3 mt-2.5 min-h-0">

        {/* Left: Chat / Form — scrollable, input at bottom */}
        <div className="flex-1 flex flex-col min-w-0 bg-white rounded-2xl border border-black/5 shadow-xs overflow-hidden">
          <div className="flex-1 overflow-y-auto px-4 sm:px-5 py-4 space-y-4">

            {!aiResult ? (
              /* ── Input Form (no diagnosis yet) ── */
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-base font-black text-[#1b1c1c]">描述您的当下身体状态</h2>
                    <p className="text-[11px] text-[#747968] mt-0.5">输入不适症状，AI 为您辨证分析。</p>
                  </div>
                  {symptomText && (
                    <button onClick={handleCleanText} className="text-[11px] font-bold text-neutral-400 hover:text-red-500 transition-all shrink-0">清空</button>
                  )}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {quickSymptoms.map((qs, i) => (
                    <button key={i} type="button" onClick={() => handleQuickTag(qs.text)}
                      className="px-2.5 py-1 rounded-full border border-black/5 bg-[#efeded] hover:bg-[#7ba23f]/10 hover:border-[#7ba23f]/30 text-[11px] font-bold text-[#44493a] hover:text-[#466805] transition-all cursor-pointer">
                      {qs.label}
                    </button>
                  ))}
                </div>
                <form onSubmit={handleAnalyze} className="space-y-2.5">
                  <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />
                  <textarea
                    value={symptomText} onChange={(e) => setSymptomText(e.target.value)}
                    placeholder="示例：近来总是有些气短乏力，手脚容易冰凉怕风，胃口不是特别好，吃过饱了容易肚子胀气..."
                    className="w-full min-h-[110px] bg-[#efeded]/60 border border-transparent focus:border-[#7ba23f]/30 focus:bg-white rounded-xl p-3.5 text-sm font-medium outline-none text-[#1b1c1c] placeholder:text-neutral-400 transition-all leading-relaxed resize-none"
                  />
                  {uploadedImage && (
                    <div className="flex items-center gap-2.5 p-2 bg-[#7ba23f]/5 border border-[#7ba23f]/20 rounded-xl">
                      <img src={uploadedImage} alt="preview" className="w-9 h-9 rounded-lg object-cover" />
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-bold text-[#466805] truncate">{imageName}</p>
                        <p className="text-[10px] text-[#747968]">已上传图片</p>
                      </div>
                      <button type="button" onClick={handleRemoveImage} className="text-neutral-400 hover:text-red-500 transition-all"><X className="w-3.5 h-3.5" /></button>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <button type="button" onClick={handleTriggerUpload}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-black/5 bg-[#efeded] hover:bg-[#7ba23f]/10 text-[11px] font-bold text-[#747968] hover:text-[#466805] transition-all">
                      <Image className="w-3.5 h-3.5" />上传舌苔
                    </button>
                    <button type="submit" disabled={isAnalyzing || !symptomText.trim()}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-[#466805] hover:bg-[#466805]/90 disabled:bg-neutral-200 disabled:text-neutral-400 text-white text-sm font-bold transition-all">
                      {isAnalyzing ? (
                        <span className="flex items-center gap-2"><Sparkles className="w-4 h-4 animate-spin" />AI 辨证分析中...</span>
                      ) : (
                        <span className="flex items-center gap-2"><Send className="w-4 h-4" />提交症状分析</span>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              /* ── Chat Bubbles ── */
              <div className="space-y-3">
                {chatHistory.map((msg, i) => (
                  <div key={i} className={'flex ' + (msg.role === 'user' ? 'justify-end' : 'justify-start')}>
                    <div className={'max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ' + (
                      msg.role === 'user'
                        ? 'bg-[#466805] text-white rounded-br-md'
                        : 'bg-[#efeded] text-[#1b1c1c] rounded-bl-md'
                    )}>
                      <div className="whitespace-pre-wrap">{msg.content}</div>
                    </div>
                  </div>
                ))}
                {(isAnalyzing || isFollowUpLoading) && (
                  <div className="flex justify-start">
                    <div className="bg-[#efeded] rounded-2xl rounded-bl-md px-4 py-2.5 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#7ba23f] animate-spin" />
                      <span className="text-xs text-[#747968]">{streamStatus || '辨证思考中...'}</span>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>
            )}
          </div>

          {/* Bottom bar — herbs/recipes + follow-up input */}
          {aiResult && !isAnalyzing && (
            <div className="shrink-0 border-t border-black/5 px-4 py-3 space-y-2.5 bg-white">
              <div className="grid grid-cols-2 gap-2">
                {(() => { const h = getHerbNameAndImg(aiResult.herbId); return (
                  <div onClick={() => navigateTo('herb-detail', 'herbs', { id: aiResult.herbId })}
                    className="flex items-center gap-2 p-2 bg-[#7ba23f]/5 rounded-xl border border-[#7ba23f]/10 cursor-pointer hover:border-[#7ba23f]/30 transition-all">
                    {h.img && <img src={h.img} alt={h.name} className="w-7 h-7 rounded-lg object-cover" />}
                    <div className="min-w-0">
                      <p className="text-[10px] text-[#747968]">推荐草药</p>
                      <p className="text-[11px] font-bold text-[#1b1c1c] truncate">{h.name}</p>
                    </div>
                  </div>
                );})()}
                {(() => { const r = getRecipeNameAndImg(aiResult.recipeId); return (
                  <div onClick={() => navigateTo('recipe-detail', 'recipes', { id: aiResult.recipeId })}
                    className="flex items-center gap-2 p-2 bg-[#7ba23f]/5 rounded-xl border border-[#7ba23f]/10 cursor-pointer hover:border-[#7ba23f]/30 transition-all">
                    {r.img && <img src={r.img} alt={r.name} className="w-7 h-7 rounded-lg object-cover" />}
                    <div className="min-w-0">
                      <p className="text-[10px] text-[#747968]">推荐食谱</p>
                      <p className="text-[11px] font-bold text-[#1b1c1c] truncate">{r.name}</p>
                    </div>
                  </div>
                );})()}
              </div>
              <form onSubmit={handleFollowUp} className="flex items-center gap-2">
                <input type="text" value={followUpText} onChange={(e) => setFollowUpText(e.target.value)}
                  placeholder="追问：适合吃什么？能跑步吗？..."
                  className="flex-1 bg-[#efeded]/60 border border-transparent focus:border-[#7ba23f]/30 focus:bg-white rounded-xl px-3.5 py-2 text-sm font-medium outline-none text-[#1b1c1c] placeholder:text-neutral-400 transition-all" />
                <button type="submit" disabled={isFollowUpLoading || !followUpText.trim()}
                  className="flex items-center gap-1 px-3.5 py-2 rounded-xl bg-[#466805] hover:bg-[#466805]/90 disabled:bg-neutral-200 disabled:text-neutral-400 text-white text-sm font-bold transition-all cursor-pointer">
                  {isFollowUpLoading ? <Sparkles className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Right: History Sidebar — independent scroll */}
        <div className="w-64 sm:w-72 shrink-0 bg-white rounded-2xl border border-black/5 shadow-xs flex flex-col overflow-hidden hidden lg:flex">
          <div className="shrink-0 px-4 py-3 border-b border-black/5 flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#1b1c1c]">诊断记录</h3>
            {history.length > 0 && (
              <button onClick={() => navigateTo('history', 'profile')}
                className="text-[10px] font-bold text-[#7ba23f] hover:text-[#466805] transition-all cursor-pointer">全部 &rarr;</button>
            )}
          </div>
          <div className="flex-1 overflow-y-auto overscroll-contain px-3 py-3 space-y-2">
            {history.length === 0 ? (
              <p className="text-xs text-[#747968] text-center py-10">暂无记录</p>
            ) : (
              history.map((item, i) => (
                <div key={i} onClick={() => navigateTo('history', 'profile')}
                  className="p-2.5 rounded-xl bg-[#efeded]/60 space-y-0.5 cursor-pointer hover:bg-[#efeded] hover:shadow-sm transition-all">
                  <p className="text-[11px] font-bold text-[#1b1c1c] line-clamp-1">{item.title}</p>
                  <p className="text-[10px] text-[#747968] line-clamp-2">{item.symptoms}</p>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
