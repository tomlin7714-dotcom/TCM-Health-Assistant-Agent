/**
 * ConstitutionTest — 中医体质测评，前后端联通版
 */
import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { ConstitutionType } from '../types';
import { ArrowLeft, ClipboardList, RefreshCw, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getConstitutionQuestions, evaluateConstitution } from '../api/services';

interface Question {
  id: number;
  category: string;
  title: string;
  options: { score: number; label: string; type: string }[];
}

export const ConstitutionTest: React.FC = () => {
  const { user, updateUser, navigateTo, goBack, showToast } = useApp();
  const [testStep, setTestStep] = useState(0); // 0=intro, 1~N=questions, N+1=result
  const [answers, setAnswers] = useState<{ question_id: number; score: number }[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [result, setResult] = useState<{ constitution: string; description: string; advice: string } | null>(null);
  const [loading, setLoading] = useState(false);

  // Load questions from backend
  useEffect(() => {
    getConstitutionQuestions().then((res: any) => {
      if (res?.questions) setQuestions(res.questions);
    }).catch(() => {});
  }, []);

  const handleStartTest = () => {
    setAnswers([]);
    setResult(null);
    setTestStep(1);
    showToast('请根据真实感受选择最接近的选项', 'info');
  };

  const handleAnswerSelect = async (questionId: number, score: number) => {
    const newAnswers = [...answers, { question_id: questionId, score }];
    setAnswers(newAnswers);

    if (testStep < questions.length) {
      setTestStep(prev => prev + 1);
    } else {
      // Submit to backend
      setLoading(true);
      try {
        const res = await evaluateConstitution(newAnswers);
        setResult({ constitution: res.constitution, description: res.description, advice: res.advice });
        updateUser({ constitution: res.constitution as ConstitutionType | '未测试' });
        showToast(`体质测评完成：${res.constitution}！`, 'success');
      } catch {
        showToast('测评提交失败，请重试', 'error');
      } finally {
        setLoading(false);
        setTestStep(questions.length + 1);
      }
    }
  };

  const progressPct = questions.length > 0 ? ((testStep - 1) / questions.length) * 100 : 0;

  if (!questions.length) {
    return (
      <div className="max-w-xl mx-auto px-6 py-20 text-center">
        <p className="text-sm text-[#747968]">加载测评题目中...</p>
      </div>
    );
  }

  return (
    <div id="constitution_test_view" className="max-w-xl mx-auto px-6 py-8 w-full">
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-black/5 pb-4 mb-6">
        <button onClick={goBack}
          className="w-8 h-8 rounded-full bg-white border border-black/5 hover:bg-neutral-100 flex items-center justify-center text-neutral-400 hover:text-neutral-600 transition-all mr-2 cursor-pointer">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-xl font-black text-[#1b1c1c] flex items-center gap-1.5">
            <ClipboardList className="w-5 h-5 text-[#466805]" />中医体质测评
          </h1>
          <p className="text-xs text-[#747968] mt-0.5">基于《中医体质分类与判定》标准问卷</p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* Intro */}
        {testStep === 0 && (
          <motion.div key="intro" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
            className="bg-white border border-black/5 rounded-3xl p-8 text-center space-y-6 flex flex-col items-center">
            <div className="w-24 h-24 rounded-full border-4 border-[#7ba23f]/30 flex items-center justify-center bg-gradient-to-br from-[#7ba23f]/10 to-[#466805]/10">
              <span className="font-black text-xs text-[#466805]">阴阳和合</span>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-black text-[#1b1c1c]">探析您的体质属性</h3>
              <p className="text-xs text-[#747968] max-w-sm mx-auto leading-relaxed">
                中医体质分为九大类型（平和、阳虚、阴虚、气虚、痰湿、湿热、血瘀、气郁、特禀）。
                本测评通过{questions.length}个核心问题，帮您判断自身体质，指导日常调理养生。
              </p>
            </div>
            <button onClick={handleStartTest}
              className="w-full h-11 bg-[#7ba23f] hover:bg-[#466805] text-white font-extrabold text-xs flex items-center justify-center gap-1.5 rounded-xl transition-all shadow-md cursor-pointer">
              开始体质自测 <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        )}

        {/* Questions */}
        {testStep >= 1 && testStep <= questions.length && (
          <motion.div key={`q-${testStep}`} initial={{ opacity: 0, x: 25 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -25 }} className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-[#747968]">
                <span className="font-bold text-[#7ba23f]">{questions[testStep - 1].category}</span>
                <span>进度 {testStep}/{questions.length}</span>
              </div>
              <div className="bg-neutral-200 h-1 rounded-full overflow-hidden">
                <div className="bg-[#7ba23f] h-full transition-all duration-300" style={{ width: `${progressPct}%` }} />
              </div>
            </div>
            <div className="bg-white border border-black/5 rounded-3xl p-6 shadow-xs space-y-6">
              <h2 className="text-base font-black text-[#1b1c1c]">{questions[testStep - 1].title}</h2>
              <div className="space-y-3">
                {questions[testStep - 1].options.map((opt, i) => (
                  <button key={i} onClick={() => handleAnswerSelect(questions[testStep - 1].id, opt.score)}
                    className="w-full p-4 rounded-2xl border border-black/5 bg-neutral-50/20 hover:bg-white hover:border-[#7ba23f]/40 text-left text-xs font-bold text-[#44493a] hover:text-[#466805] transition-all cursor-pointer shadow-xs">
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="text-center">
              <button onClick={() => setTestStep(0)} className="text-[10px] text-neutral-400 hover:underline cursor-pointer">放弃测评</button>
            </div>
          </motion.div>
        )}

        {/* Loading */}
        {loading && (
          <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="text-center py-16 space-y-4">
            <Sparkles className="w-8 h-8 mx-auto text-[#7ba23f] animate-spin" />
            <p className="text-sm font-bold text-[#747968]">AI 分析您的体质数据中...</p>
          </motion.div>
        )}

        {/* Result */}
        {testStep > questions.length && result && (
          <motion.div key="result" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-[#7ba23f]/15 rounded-3xl p-8 space-y-6 shadow-xs">
            <div className="flex items-center gap-3 border-b border-[#7ba23f]/10 pb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-black text-[#1b1c1c]">测评完成</h3>
                <p className="text-[10px] text-[#747968]">基于《中医体质分类与判定》标准</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <span className="text-[10px] text-[#747968] font-black uppercase">您的体质类型</span>
                <p className="text-2xl font-black text-[#466805] mt-1">【 {result.constitution} 】</p>
              </div>
              <div className="bg-neutral-50 rounded-2xl p-4">
                <span className="text-[10px] text-[#747968] font-black uppercase">体质特征</span>
                <p className="text-xs text-[#44493a] leading-relaxed mt-1">{result.description}</p>
              </div>
              <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4">
                <span className="text-[10px] text-amber-800 font-black uppercase">调养建议</span>
                <p className="text-xs text-amber-900 leading-relaxed font-semibold mt-1">{result.advice}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button onClick={() => navigateTo('home-main', 'home')}
                className="h-11 bg-[#7ba23f] hover:bg-[#466805] text-white font-extrabold text-xs flex items-center justify-center gap-1.5 rounded-xl transition-all cursor-pointer">
                去 AI 辨证咨询 <ArrowRight className="w-4 h-4" />
              </button>
              <button onClick={handleStartTest}
                className="h-11 border border-[#7ba23f]/30 text-[#466805] hover:bg-[#7ba23f]/10 font-bold text-xs flex items-center justify-center gap-1 rounded-xl transition-all cursor-pointer">
                <RefreshCw className="w-3.5 h-3.5" />重新测评
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
