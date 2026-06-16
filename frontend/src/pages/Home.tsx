/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Brain, Activity, Star, Send, Sparkles, Image, X, MessageCircle, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { MOCK_HERBS, MOCK_RECIPES } from '../data';
import { diagnose, loginGuest, sendChatMessage, syncChatLog } from '../api/services';
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
  const chatEndRef = useRef<HTMLDivElement>(null);

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
    try {
      let token = localStorage.getItem('tcm_token');
      if (!token) {
        const res = await loginGuest();
        token = res.access_token;
        localStorage.setItem('tcm_token', token);
      }
      const result = await diagnose(symptomText, uploadedImage ?? undefined);
      const matched = {
        symptoms: symptomText,
        title: result.title,
        diagnosis: result.diagnosis,
        advice: result.advice,
        herbId: result.herb_id ?? 'h1',
        recipeId: result.recipe_id ?? 'r1',
      };
      setAiResult(matched);
      const cid = result.consultation_id;
      if (cid) setConsultationId(cid);
      addConsultation({
        title: matched.title,
        type: 'tongue',
        symptoms: matched.symptoms,
        analysis: matched.diagnosis,
        suggestion: matched.advice,
      }, cid);  // pass backend ID so record IDs match for sync
      showToast('AI 中医处方研判已完成！', 'success');
      const initialChat = [
        { role: 'user' as const, content: symptomText },
        { role: 'assistant' as const, content: matched.diagnosis },
      ];
      setChatHistory(initialChat);
      // Sync initial chat to backend + local state
      if (cid) {
        const json = JSON.stringify(initialChat);
        syncChatLog(cid, json).catch(() => {});
        updateConsultationSuggestion(cid, json);
      }
    } catch (err: any) {
      showToast(err?.response?.data?.detail ?? 'AI 服务暂时不可用，请稍后重试', 'error');
    } finally {
      setIsAnalyzing(false);
    }
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
      // Sync full conversation to backend + local state
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
    setAiResult(null);
    setChatHistory([]);
    setConsultationId(null);
    setSymptomText('');
    setUploadedImage(null);
    setImageName('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, isFollowUpLoading]);

  // Load a past consultation to resume chatting
  useEffect(() => {
    if (!pendingConsultation) return;
    const c = pendingConsultation;
    setConsultationId(c.id);

    // Try to restore full chat log from saved suggestion
    let restoredChat: ChatMessage[] = [];
    try {
      if (c.suggestion && c.suggestion.startsWith('[')) {
        restoredChat = JSON.parse(c.suggestion);
      }
    } catch {}

    if (restoredChat.length === 0) {
      // Fallback: build from scratch
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
    <div id="home_view" className="max-w-7xl mx-auto px-6 py-8 w-full">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8">

        {/* Left column */}
        <div className="space-y-8 flex flex-col">

          {/* Banner */}
          <div className="rounded-3xl bg-gradient-to-br from-[#466805] via-[#466805]/90 to-[#7ba23f] text-white p-8 md:p-10 shadow-lg shadow-[#466805]/10 relative overflow-hidden">
            <div className="absolute right-0 bottom-0 top-0 w-1/3 opacity-15 pointer-events-none" />
            <div className="relative z-10 max-w-2xl space-y-4">
              <span className="px-3 py-1 rounded-full bg-[#c5f183]/20 border border-[#c5f183]/30 text-[#c5f183] text-[10px] font-bold tracking-widest uppercase">
                AI COGNITIVE MEDICINE CLINIC
              </span>
              <h1 className="text-3xl md:text-4xl font-black tracking-tight leading-tight">
                智能本草辨证 · 守护身心和谐
              </h1>
              <p className="text-sm text-neutral-200 font-medium leading-relaxed">
                结合中国传统古籍《黄帝内经》、《伤寒杂病论》与现代 AI 大模型推理，为您量身定制调摄计划。
              </p>
            </div>
          </div>

          {/* Three entry cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div onClick={() => navigateTo('constitution-test', 'profile')}
              className="bg-white border border-black/5 rounded-2xl p-6 hover:border-[#7ba23f]/40 hover:shadow-md transition-all cursor-pointer flex flex-col items-start gap-4 group">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                <Star className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#1b1c1c] group-hover:text-[#466805] transition-all">体质科学测评</h3>
                <p className="text-xs text-[#747968] font-medium mt-1">3分钟九大体质标准科学测试</p>
              </div>
            </div>
            <div onClick={() => navigateTo('tongue-scan')}
              className="bg-white border border-black/5 rounded-2xl p-6 hover:border-[#7ba23f]/40 hover:shadow-md transition-all cursor-pointer flex flex-col items-start gap-4 group">
              <div className="w-12 h-12 rounded-xl bg-[#7ba23f]/10 text-[#466805] flex items-center justify-center">
                <Brain className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#1b1c1c] group-hover:text-[#466805] transition-all">智能舌部扫描</h3>
                <p className="text-xs text-[#747968] font-medium mt-1">分析舌色和胎色辨别体内寒湿</p>
              </div>
            </div>
            <div onClick={() => navigateTo('history', 'profile')}
              className="bg-white border border-black/5 rounded-2xl p-6 hover:border-[#7ba23f]/40 hover:shadow-md transition-all cursor-pointer flex flex-col items-start gap-4 group">
              <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#1b1c1c] group-hover:text-[#466805] transition-all">极快脉搏分析</h3>
                <p className="text-xs text-[#747968] font-medium mt-1">智能记录并分析脉来急缓强弱</p>
              </div>
            </div>
          </div>

          {/* Symptom input form */}
          <div className="bg-white border border-black/5 rounded-2xl p-6 shadow-xs space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black text-[#1b1c1c]">描述您的当下身体状态</h2>
                <p className="text-xs text-[#747968] font-semibold mt-0.5">输入手脚温度、食欲消化、睡眠汗液、精神压力等不适状况。</p>
              </div>
              {symptomText && (
                <button onClick={handleCleanText} className="text-xs font-bold text-neutral-400 hover:text-red-500 transition-all">
                  清空输入
                </button>
              )}
            </div>

            <div className="flex flex-wrap gap-2.5">
              {quickSymptoms.map((qs, i) => (
                <button key={i} type="button" onClick={() => handleQuickTag(qs.text)}
                  className="px-3.5 py-1.5 rounded-full border border-black/5 bg-[#efeded] hover:bg-[#7ba23f]/10 hover:border-[#7ba23f]/30 text-xs font-bold text-[#44493a] hover:text-[#466805] transition-all cursor-pointer">
                  {qs.label}
                </button>
              ))}
            </div>

            <form onSubmit={handleAnalyze} className="space-y-4">
              <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />

              <textarea
                value={symptomText}
                onChange={(e) => setSymptomText(e.target.value)}
                placeholder="示例：近来总是有些气短乏力，手脚容易冰凉怕风，胃口不是特别好，吃过饱了容易肚子胀气，夜间口干有点多梦..."
                className="w-full min-h-[140px] bg-[#efeded]/60 border border-transparent focus:border-[#7ba23f]/30 focus:bg-white rounded-2xl p-4 text-sm font-medium outline-none text-[#1b1c1c] placeholder:text-neutral-400 transition-all leading-relaxed"
              />

              {uploadedImage && (
                <div className="flex items-center gap-3 p-3 bg-[#7ba23f]/5 border border-[#7ba23f]/20 rounded-xl">
                  <img src={uploadedImage} alt="preview" className="w-12 h-12 rounded-lg object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-[#466805] truncate">{imageName}</p>
                    <p className="text-xs text-[#747968]">已上传图片，AI 将结合图片分析</p>
                  </div>
                  <button type="button" onClick={handleRemoveImage} className="text-neutral-400 hover:text-red-500 transition-all">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              <div className="flex items-center gap-3">
                <button type="button" onClick={handleTriggerUpload}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-black/5 bg-[#efeded] hover:bg-[#7ba23f]/10 text-xs font-bold text-[#747968] hover:text-[#466805] transition-all">
                  <Image className="w-4 h-4" />
                  上传舌苔图片
                </button>
                <button type="submit" disabled={isAnalyzing || !symptomText.trim()}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-[#466805] hover:bg-[#466805]/90 disabled:bg-neutral-200 disabled:text-neutral-400 text-white text-sm font-bold transition-all">
                  {isAnalyzing ? (
                    <span className="flex items-center gap-2"><Sparkles className="w-4 h-4 animate-spin" />AI 辨证分析中...</span>
                  ) : (
                    <span className="flex items-center gap-2"><Send className="w-4 h-4" />提交症状分析</span>
                  )}
                </button>
              </div>
            </form>

            {/* Chat View — shown after initial diagnosis */}
            <AnimatePresence>
              {aiResult && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  className="border border-[#7ba23f]/20 bg-white rounded-2xl overflow-hidden shadow-xs">

                  <div className="flex items-center justify-between px-5 py-3 bg-[#7ba23f]/5 border-b border-[#7ba23f]/10">
                    <div className="flex items-center gap-2">
                      <MessageCircle className="w-4 h-4 text-[#7ba23f]" />
                      <span className="text-xs font-bold text-[#466805]">AI 中医问诊对话</span>
                    </div>
                    <button onClick={handleNewSession}
                      className="text-xs font-bold text-[#747968] hover:text-[#466805] transition-all cursor-pointer">
                      + 新建问诊
                    </button>
                  </div>

                  <div className="max-h-[420px] overflow-y-auto p-4 space-y-3">
                    {chatHistory.map((msg, i) => (
                      <div key={i} className={'flex ' + (msg.role === 'user' ? 'justify-end' : 'justify-start')}>
                        <div className={'max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ' + (
                          msg.role === 'user'
                            ? 'bg-[#466805] text-white rounded-br-md'
                            : 'bg-[#efeded] text-[#1b1c1c] rounded-bl-md'
                        )}>
                          <div className="whitespace-pre-wrap">{msg.content}</div>
                        </div>
                      </div>
                    ))}
                    {isFollowUpLoading && (
                      <div className="flex justify-start">
                        <div className="bg-[#efeded] rounded-2xl rounded-bl-md px-4 py-3">
                          <div className="flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-[#7ba23f] animate-spin" />
                            <span className="text-xs text-[#747968] font-medium">辨证思考中...</span>
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={chatEndRef} />
                  </div>

                  <div className="grid grid-cols-2 gap-3 px-5 pb-3">
                    {(() => { const h = getHerbNameAndImg(aiResult.herbId); return (
                      <div onClick={() => navigateTo('herb-detail', 'herbs', { id: aiResult.herbId })}
                        className="flex items-center gap-3 p-3 bg-[#7ba23f]/5 rounded-xl border border-[#7ba23f]/10 cursor-pointer hover:border-[#7ba23f]/30 transition-all">
                        {h.img && <img src={h.img} alt={h.name} className="w-10 h-10 rounded-lg object-cover" />}
                        <div>
                          <p className="text-[10px] text-[#747968] font-semibold">推荐草药</p>
                          <p className="text-sm font-bold text-[#1b1c1c]">{h.name}</p>
                        </div>
                      </div>
                    );})()}
                    {(() => { const r = getRecipeNameAndImg(aiResult.recipeId); return (
                      <div onClick={() => navigateTo('recipe-detail', 'recipes', { id: aiResult.recipeId })}
                        className="flex items-center gap-3 p-3 bg-[#7ba23f]/5 rounded-xl border border-[#7ba23f]/10 cursor-pointer hover:border-[#7ba23f]/30 transition-all">
                        {r.img && <img src={r.img} alt={r.name} className="w-10 h-10 rounded-lg object-cover" />}
                        <div>
                          <p className="text-[10px] text-[#747968] font-semibold">推荐食谱</p>
                          <p className="text-sm font-bold text-[#1b1c1c]">{r.name}</p>
                        </div>
                      </div>
                    );})()}
                  </div>

                  <form onSubmit={handleFollowUp} className="flex items-center gap-2 px-4 py-3 border-t border-[#7ba23f]/10 bg-[#7ba23f]/3">
                    <input
                      type="text"
                      value={followUpText}
                      onChange={(e) => setFollowUpText(e.target.value)}
                      placeholder="追问：比如适合吃什么、能跑步吗、为什么会这样..."
                      className="flex-1 bg-white border border-transparent focus:border-[#7ba23f]/30 rounded-xl px-4 py-2 text-sm font-medium outline-none text-[#1b1c1c] placeholder:text-neutral-400 transition-all"
                    />
                    <button type="submit" disabled={isFollowUpLoading || !followUpText.trim()}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#466805] hover:bg-[#466805]/90 disabled:bg-neutral-200 disabled:text-neutral-400 text-white text-sm font-bold transition-all cursor-pointer">
                      {isFollowUpLoading ? (
                        <Sparkles className="w-4 h-4 animate-spin" />
                      ) : (
                        <ArrowRight className="w-4 h-4" />
                      )}
                    </button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right sidebar */}
        <div className="space-y-6">
          <div className="bg-white border border-black/5 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-[#1b1c1c]">近期诊断记录</h3>
              {history.length > 0 && (
                <button onClick={() => navigateTo('history', 'profile')}
                  className="text-[10px] font-bold text-[#7ba23f] hover:text-[#466805] transition-all cursor-pointer">
                  查看全部 &rarr;
                </button>
              )}
            </div>
            {history.length === 0 ? (
              <p className="text-xs text-[#747968] font-medium">暂无记录，完成首次 AI 辨证后将在此显示。</p>
            ) : (
              <div className="space-y-3">
                {history.slice(0, 3).map((item, i) => (
                  <div key={i} onClick={() => navigateTo('history', 'profile')}
                    className="p-3 rounded-xl bg-[#efeded]/60 space-y-1 cursor-pointer hover:bg-[#efeded] hover:shadow-sm transition-all">
                    <p className="text-xs font-bold text-[#1b1c1c] line-clamp-1">{item.title}</p>
                    <p className="text-xs text-[#747968] line-clamp-2">{item.symptoms}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
