/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ArrowLeft, MessageSquare, UploadCloud, FileText, CheckCircle, Mail, Send, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const Feedback: React.FC = () => {
  const { goBack, submitFeedback, showToast } = useApp();
  
  // Form states
  const [selectedTopic, setSelectedTopic] = useState<string>('功能建议');
  const [suggestion, setSuggestion] = useState('');
  const [userEmail, setUserEmail] = useState('');
  
  // Mock file drag & drop state
  const [isDragging, setIsDragging] = useState(false);
  const [mockFiles, setMockFiles] = useState<{ name: string; size: string }[]>([]);
  
  // Submission successes
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const topics = ['常规反馈', '功能建议', '问题申报', '内容建议'];

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    // Simulating dropping a file
    setMockFiles([
      { name: '舌苔实拍报告_2026.jpg', size: '2.4 MB' }
    ]);
    showToast('实拍附照拖拽抓取成功！', 'success');
  };

  const handleSelectFile = () => {
    setMockFiles([
      { name: '健康脉律检测_waveform.png', size: '1.2 MB' }
    ]);
    showToast('本地报告附图选择成功！', 'success');
  };

  const handleDeleteMockFile = (idx: number) => {
    setMockFiles([]);
    showToast('附图已移走', 'info');
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!suggestion.trim()) {
      showToast('请输入您的反馈建议内容。', 'error');
      return;
    }
    if (!userEmail.trim() || !userEmail.includes('@')) {
      showToast('请提供合规有效的联系电子邮箱。', 'error');
      return;
    }

    setIsSending(true);

    // Simulated email database push
    setTimeout(() => {
      submitFeedback(selectedTopic, suggestion, userEmail);
      setIsSending(false);
      setIsSubmitted(true);
      showToast('极佳！您的反馈意见已直达开发团队，真挚感谢。', 'success');
    }, 1200);
  };

  return (
    <div id="feedback_view" className="max-w-2xl mx-auto px-6 py-8 w-full space-y-6">
      
      {/* Navigation Header */}
      <div className="flex items-center gap-2 border-b border-black/5 pb-4">
        <button 
          onClick={goBack}
          className="w-8 h-8 rounded-full bg-white border border-black/5 hover:bg-neutral-100 flex items-center justify-center text-neutral-400 hover:text-neutral-600 transition-all mr-2 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-xl font-black text-[#1b1c1c]">反馈与建议我</h1>
          <p className="text-xs text-[#747968] font-semibold mt-0.5">如果您在使用过程遇到Bug、内容差漏，或者是希望定制某种功操，请告诉我们。</p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!isSubmitted ? (
          <motion.form 
            key="feedback-form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onSubmit={handleSubmitForm} 
            className="space-y-6"
          >
            {/* टॉपिक Selector panel */}
            <div className="bg-white border border-black/5 p-6 rounded-3xl shadow-xs space-y-4">
              <label className="block text-xs font-bold text-[#44493a] uppercase tracking-wider">
                选择反馈主题类型：
              </label>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5" id="feedback_topic_selector">
                {topics.map((t) => {
                  const isSelected = selectedTopic === t;
                  return (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setSelectedTopic(t)}
                      className={`py-3 px-1 rounded-xl text-[11px] font-extrabold border text-center transition-all cursor-pointer ${
                        isSelected 
                          ? 'border-[#7ba23f] bg-[#7ba23f]/5 text-[#466805]' 
                          : 'border-black/5 bg-white text-[#747968] hover:bg-neutral-50 hover:text-black/80'
                      }`}
                    >
                      {t}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Suggestions Description workspace */}
            <div className="bg-white border border-black/5 p-6 rounded-3xl shadow-xs space-y-4">
              <label className="block text-xs font-bold text-[#44493a] uppercase tracking-wider">
                详尽的描述内容（建议或Bug）：
              </label>
              
              <textarea
                value={suggestion}
                onChange={(e) => setSuggestion(e.target.value)}
                placeholder="请倾吐您的反馈，若属Bug描述，建议写清：在哪个页面、进行何种点击时出现的偏颇错误，感谢！"
                className="w-full min-h-[140px] bg-[#efeded]/60 border border-transparent focus:bg-white focus:border-[#7ba23f]/30 rounded-2xl p-4 text-xs font-medium outline-none text-[#1b1c1c] transition-all leading-relaxed"
                id="feedback_textarea"
              />
            </div>

            {/* Immersive File drop-upload container */}
            <div className="bg-white border border-black/5 p-6 rounded-3xl shadow-xs space-y-4">
              <label className="block text-xs font-bold text-[#44493a] uppercase tracking-wider">
                附件实拍（舌象、检查波形图）：
              </label>

              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={handleSelectFile}
                className={`border-2 border-dashed rounded-2xl py-8 px-4 text-center cursor-pointer transition-all flex flex-col items-center justify-center space-y-2.5 ${
                  isDragging 
                    ? 'border-[#7ba23f] bg-[#7ba23f]/10 text-[#466805]' 
                    : 'border-neutral-200 bg-neutral-50/50 hover:border-[#7ba23f]/40 hover:bg-white'
                }`}
                id="feedback_uploader"
              >
                <UploadCloud className={`w-10 h-10 ${isDragging ? 'text-[#466805]' : 'text-neutral-400 animate-pulse'}`} />
                <div>
                  <p className="text-xs font-bold text-[#1b1c1c]">点击或拖拽文件到这里上传</p>
                  <p className="text-[10px] text-neutral-400 mt-1">支持 JPG, PNG 等常规报告图片，2MB级别以内</p>
                </div>
              </div>

              {/* Renders dropped mock files if uploaded */}
              {mockFiles.length > 0 && (
                <div className="space-y-2">
                  {mockFiles.map((file, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-[#7ba23f]/5 border border-[#7ba23f]/10 rounded-xl">
                      <div className="flex items-center gap-2 text-xs font-bold text-[#466805]">
                        <FileText className="w-4 h-4" />
                        <span className="truncate max-w-[200px]">{file.name}</span>
                        <span className="text-[10px] text-[#747968] font-mono">({file.size})</span>
                      </div>
                      <button 
                        type="button"
                        onClick={() => handleDeleteMockFile(i)}
                        className="text-[10px] font-black hover:underline text-red-500 cursor-pointer"
                      >
                        移除
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Email container */}
            <div className="bg-white border border-black/5 p-6 rounded-3xl shadow-xs space-y-4">
              <label className="block text-xs font-bold text-[#44493a] uppercase tracking-wider">
                联系邮箱（用于答复及赠送调养会员卡）：
              </label>

              <div className="relative">
                <Mail className="absolute left-3.5 top-3 w-4 h-4 text-neutral-400" />
                <input
                  type="email"
                  placeholder="example@yourdomain.com"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  className="w-full bg-[#efeded]/60 border border-transparent focus:border-[#7ba23f]/30 focus:bg-white rounded-xl py-2.5 pl-10 pr-4 text-xs font-semibold outline-none transition-all"
                  id="feedback_email_input"
                />
              </div>
            </div>

            {/* Launch CTA */}
            <button
              type="submit"
              disabled={isSending}
              className="w-full h-11 bg-[#7ba23f] hover:bg-[#466805] text-white disabled:bg-neutral-300 disabled:cursor-not-allowed text-xs font-extrabold flex items-center justify-center gap-1.5 rounded-xl shadow-md transition-all cursor-pointer"
            >
              {isSending ? (
                <>
                  <div className="border-2 border-white/20 border-t-white w-4 h-4 rounded-full animate-spin" />
                  <span>神农信箱寄出中...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>提交建议，雕琢更美本草体验</span>
                </>
              )}
            </button>

          </motion.form>
        ) : (
          /* Submission success visual notice card */
          <motion.div 
            key="feedback-success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white border border-[#7ba23f]/20 rounded-3xl p-8 shadow-md text-center space-y-6 flex flex-col items-center justify-center"
            id="feedback_success_card"
          >
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle className="w-10 h-10 animate-bounce" />
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-black text-[#1b1c1c]">建议已安全送达神农信箱</h3>
              <p className="text-xs text-[#747968] font-semibold max-w-sm leading-relaxed mx-auto">
                尊敬的 Balance 调理官，真挚感谢您为系统的优化拔刀献策！
                我们将在 1-2 个中医工作日内通过 <span className="font-mono font-bold text-[#1b1c1c]">{userEmail}</span> 答复您的留言。
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setIsSubmitted(false);
                setSuggestion('');
                setMockFiles([]);
              }}
              className="text-xs bg-[#7ba23f]/10 text-[#466805] hover:bg-[#7ba23f]/20 font-bold px-6 py-2.5 rounded-xl transition-all h-10 cursor-pointer flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>再次提交一条新意见</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};
