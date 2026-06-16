/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ConstitutionType } from '../types';
import { ArrowLeft, Compass, ClipboardList, RefreshCw, Sparkles, AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const ConstitutionTest: React.FC = () => {
  const { user, updateUser, navigateTo, goBack, showToast } = useApp();
  
  // Test steps: 0=intro, 1=Q1, 2=Q2, 3=Q3, 4=ResultCard
  const [testStep, setTestStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);

  // Detailed question specifications
  const questions = [
    {
      id: 1,
      category: '量表一：阳气与畏寒度',
      title: '您平时感觉自己的身体温度和耐受度如何？',
      options: [
        { score: 1, label: '特别怕冷，手脚常常冰冰凉，一吹空调或寒风就起鸡皮疙瘩。', type: '阳虚质' },
        { score: 2, label: '耐受温和，四季体温比较均衡舒适，没有明显的畏寒或怕热。', type: '平和质' },
        { score: 3, label: '特别容易燥热发热，平时特别多汗、总是口渴想喝冷水。', type: '湿热质' }
      ]
    },
    {
      id: 2,
      category: '量表二：气运与精神原能',
      title: '您平时白天的精力和气色状态如何？',
      options: [
        { score: 1, label: '极其容易疲惫，经常感觉气短无力、懒得跟人多说话。', type: '气虚质' },
        { score: 2, label: '精神饱满，气息平稳，大病久病极。少有神色焦悴。', type: '平和质' },
        { score: 3, label: '容易身体发懒、头重脚轻，大便黏腻粘马桶或经常胃胀。', type: '痰湿质' }
      ]
    },
    {
      id: 3,
      category: '量表三：面色、发质与体虚',
      title: '您的面部气色与皮肤、头发的出油状态如何？',
      options: [
        { score: 1, label: '面色苍白没有血色，发质枯槁、容易落发干燥。', type: '气血虚' },
        { score: 2, label: '面色红润有光泽，发丝黑亮顺滑，皮肤弹性较好。', type: '平和质' },
        { score: 3, label: '面部和头发出油严重，极易长粉刺痤疮、口发苦发臭。', type: '湿热质' }
      ]
    }
  ];

  const handleStartTest = () => {
    setAnswers([]);
    setTestStep(1);
    showToast('测评已开启，请跟随直觉选择当下的真实反馈。', 'info');
  };

  const handleAnswerSelect = (score: number) => {
    const nextAnswers = [...answers, score];
    setAnswers(nextAnswers);

    if (testStep < questions.length) {
      setTestStep(prev => prev + 1);
    } else {
      // Calculate resulting constitution quality
      const sum = nextAnswers.reduce((prev, curr) => prev + curr, 0);
      let calculatedConst: ConstitutionType = '平和质';

      // Simple heuristic based on option scores
      if (nextAnswers[0] === 1 && nextAnswers[1] === 1) {
        calculatedConst = '阳虚质';
      } else if (nextAnswers[1] === 1) {
        calculatedConst = '气虚质';
      } else if (nextAnswers[0] === 3 || nextAnswers[2] === 3) {
        calculatedConst = '湿热质';
      } else if (nextAnswers[0] === 2 && nextAnswers[1] === 2 && nextAnswers[2] === 2) {
        calculatedConst = '平和质';
      } else {
        calculatedConst = '阴虚质';
      }

      // Update globally
      updateUser({ constitution: calculatedConst });
      setTestStep(4);
      showToast(`体质测算完成：您属于【${calculatedConst}】！`, 'success');
    }
  };

  const getConstitutionDescription = (type: ConstitutionType) => {
    switch(type) {
      case '阳虚质': 
        return '阳虚质是由于脏腑阳气不足，清温失司，以怕冷、生冷不舒、手足厥冷为特征的体质状态。多由天生元阳虚衰，或后天饱食生冷、熬夜伤阴引起。';
      case '气虚质':
        return '气虚质是因为一身之气亏虚，气之生化受阻，以神疲乏力、少气懒言、气息低弱为特征的体质状态。脾肺两虚，抵抗力一般偏低，极易感冒。';
      case '湿热质':
        return '湿热质指湿热内蕴，以面部出油长粉刺痘痘、口苦口臭、排尿黄涩、大便粘滞等湿热下注症状为突出的体质，平素性情容易暴躁。';
      default:
        return '平和质是九大体质中最为理想的状态。心身平衡，阴阳匀协，面色红润，精神极好，适应大自然四季冷热能力极好。只需常规维持作息即可。';
    }
  };

  const getConstitutionAdvise = (type: ConstitutionType) => {
    switch(type) {
      case '阳虚质':
        return '宜日常多吃韭菜、羊肉、干姜、红枣温补食物，忌喝凉茶、冷饮。推荐进行【八段锦】晨练以宣通诸经，并推荐在关元、足三里艾灸，保护体内元阳。';
      case '气虚质':
        return '宜进补人参、黄芪、茯苓、大枣等大补中脾气胃气之物。平时不可过劳超支体力。推荐练习【太极导引 · 紫气东来】调理和缓呼吸，促进中气生发。';
      case '湿热质':
        return '饮食宜清淡，少吃麻辣油炸及肥甘荤杂。多吃赤小豆、薏苡仁、莲子祛湿清热。推荐经常进行【经络穴位按摩 · 顺揉足三里】，泄其阳明湿热郁气。';
      default:
        return '常保饮食规律，起居有常。春防风，夏避暑，秋御燥，冬温阳。每日配合一刻钟的静心调息运动，可葆常青之元气。';
    }
  };

  return (
    <div id="constitution_test_view" className="max-w-xl mx-auto px-6 py-8 w-full">
      
      {/* Navigation header */}
      <div className="flex items-center gap-2 border-b border-black/5 pb-4 mb-6">
        <button 
          onClick={goBack}
          className="w-8 h-8 rounded-full bg-white border border-black/5 hover:bg-neutral-100 flex items-center justify-center text-neutral-400 hover:text-neutral-600 transition-all mr-2 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-xl font-black text-[#1b1c1c] flex items-center gap-1.5">
            <ClipboardList className="w-5 h-5 text-[#466805]" />
            <span>中医体质测评</span>
          </h1>
          <p className="text-xs text-[#747968] font-semibold mt-0.5">基于中华中医药学会《中医体质分类与判定》科学问答量表。</p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        
        {/* Step 0: Welcome card */}
        {testStep === 0 && (
          <motion.div
            key="test-intro"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="bg-white border border-black/5 rounded-3xl p-6 md:p-8 text-center space-y-6 flex flex-col items-center justify-center"
            id="constitution_test_intro"
          >
            {/* Traditional Yin-Yang Tai Chi motive emulated */}
            <div className="w-24 h-24 rounded-full border-4 border-[#7ba23f]/30 flex items-center justify-center relative bg-gradient-to-br from-[#7ba23f]/10 to-[#466805]/10 group p-1">
              <div className="w-full h-full rounded-full border border-[#466805]/20 flex items-center justify-center font-black text-xs text-[#466805] font-serif bg-white shadow-inner select-none animate-pulse">
                阴阳和合
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-black text-[#1b1c1c]">探析您的先天九大之谜</h3>
              <p className="text-xs text-[#747968] font-semibold max-w-sm leading-relaxed mx-auto">
                千人千面，人体质也具有九大流派属性（如平和、阳虚、气虚、阴虚等）。
                本量表仅需3分钟，通过3大深度病理指标，探知您的体内机制，指导日常配药熬汤。
              </p>
            </div>

            <button
              onClick={handleStartTest}
              className="w-full h-11 bg-[#7ba23f] hover:bg-[#466805] text-white font-extrabold text-xs flex items-center justify-center gap-1.5 rounded-xl transition-all shadow-md shadow-[#7ba23f]/10 cursor-pointer"
            >
              <span>开始体质自测</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        )}

        {/* Steps 1, 2, 3: Active Question view */}
        {testStep >= 1 && testStep <= 3 && (
          <motion.div
            key={`test-q-${testStep}`}
            initial={{ opacity: 0, x: 25 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -25 }}
            className="space-y-6"
            id={`constitution_q_step_${testStep}`}
          >
            {/* Progress header progress bar */}
            <div className="space-y-2">
              <div className="flex justify-between items-baseline text-xs text-[#747968] font-mono leading-none">
                <span className="font-bold uppercase tracking-widest text-[#7ba23f]">
                  {questions[testStep - 1].category}
                </span>
                <span>量表进度 {testStep} / 3</span>
              </div>
              <div className="bg-neutral-250 h-1 rounded-full overflow-hidden">
                <div 
                  className="bg-[#7ba23f] h-full transition-all duration-300" 
                  style={{ width: `${(testStep / 3) * 100}%` }}
                />
              </div>
            </div>

            {/* Questions details content */}
            <div className="bg-white border border-black/5 rounded-3xl p-6 shadow-xs space-y-6">
              <h2 className="text-base font-black text-[#1b1c1c] leading-relaxed">
                {questions[testStep - 1].title}
              </h2>

              {/* Options lists vertically stacked */}
              <div className="space-y-3">
                {questions[testStep - 1].options.map((opt, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleAnswerSelect(opt.score)}
                    className="w-full p-4 rounded-2xl border border-black/5 bg-neutral-50/20 hover:bg-white hover:border-[#7ba23f]/40 text-left text-xs font-bold text-[#44493a] hover:text-[#466805] transition-all cursor-pointer shadow-xs active:scale-99"
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="text-center">
              <button 
                onClick={() => setTestStep(0)}
                className="text-[10px] text-neutral-450 font-bold hover:underline cursor-pointer"
              >
                放弃测评并返回上一页
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 4: Final Result reporting */}
        {testStep === 4 && (
          <motion.div
            key="test-result"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-emerald-950/5 border border-[#7ba23f]/15 rounded-3xl p-6 md:p-8 space-y-6"
            id="constitution_test_success_card"
          >
            <div className="flex items-center gap-3 border-b border-[#7ba23f]/10 pb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h3 className="text-sm font-black text-[#1b1c1c]">测评完成：诊断就书已生成</h3>
                <p className="text-[9px] text-[#747968] font-mono leading-none mt-0.5">GUIDE POLICY: NO-S8241</p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Type tag */}
              <div>
                <span className="text-[10px] text-[#747968] font-black uppercase tracking-wider block">
                  诊断体质归宗结果为：
                </span>
                <p className="text-2xl font-black text-[#466805] tracking-tight mt-1">
                  【 {user.constitution} 】
                </p>
              </div>

              {/* Brief */}
              <div className="space-y-1 bg-white border border-black/5 rounded-2xl p-4">
                <span className="text-[10px] text-[#747968] font-black uppercase tracking-wider block">
                  一、体质病机特征科普：
                </span>
                <p className="text-xs text-[#44493a] leading-relaxed font-semibold mt-1">
                  {getConstitutionDescription(user.constitution as ConstitutionType)}
                </p>
              </div>

              {/* Practical Guidance */}
              <div className="space-y-1 bg-amber-500/[0.04] border border-amber-100 rounded-2xl p-4">
                <span className="text-[10px] text-amber-800 font-black uppercase tracking-wider block">
                  二、药补、食疗、功用调摄建议：
                </span>
                <p className="text-xs text-amber-900 leading-relaxed font-bold mt-1">
                  {getConstitutionAdvise(user.constitution as ConstitutionType)}
                </p>
              </div>
            </div>

            {/* Actions triggers */}
            <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={() => {
                  // Direct paths based on results
                  navigateTo('workout-detail', 'workouts', { workout: 'w1' }); //八段锦
                }}
                className="h-11 bg-[#7ba23f] hover:bg-[#466805] text-white font-extrabold text-xs flex items-center justify-center gap-1.5 rounded-xl shadow-xs transition-all cursor-pointer"
              >
                <span>匹配并开启【八段锦】功法</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={handleStartTest}
                className="h-11 border border-[#7ba23f]/30 text-[#466805] hover:bg-[#7ba23f]/10 font-bold text-xs flex items-center justify-center gap-1 rounded-xl transition-all cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>重新测算体质</span>
              </button>
            </div>

            <p className="text-center text-[10px] text-neutral-400 font-semibold leading-relaxed">
              ⚠️ 注：体质并非永久不变，配合饮食规律、代茶饮调护，气虚可归为平和，阳虚可固元。
            </p>

          </motion.div>
        )}

      </AnimatePresence>

    </div>
  );
};
