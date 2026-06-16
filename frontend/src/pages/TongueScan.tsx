/**
 * TongueScan — 智能舌部扫描 · AI 望诊分析
 */
import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { Upload, Camera, RefreshCw, Sparkles, ArrowRight, ArrowLeft, X, Eye, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { diagnose, loginGuest } from '../api/services';

export const TongueScan: React.FC = () => {
  const { navigateTo, showToast, goBack } = useApp();
  const [image, setImage] = useState<string | null>(null);
  const [imageName, setImageName] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<{
    title: string;
    diagnosis: string;
    advice: string;
    constitution: string;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      showToast('图片过大，请选择 5MB 以内的图片', 'error');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result as string);
      setImageName(file.name);
      setResult(null);
      showToast('舌苔图片已载入，点击分析开始望诊', 'info');
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setImage(null);
    setImageName('');
    setResult(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleAnalyze = async () => {
    if (!image) return;
    setIsAnalyzing(true);
    setResult(null);
    try {
      let token = localStorage.getItem('tcm_token');
      if (!token) {
        const res = await loginGuest();
        token = res.access_token;
        localStorage.setItem('tcm_token', token);
      }
      const res = await diagnose(
        '请根据上传的舌苔图片进行中医望诊分析，判断舌色、苔色、苔厚薄、齿痕裂纹、舌形胖瘦，给出寒热虚实判断和体质类型。',
        image
      );
      setResult({
        title: res.title,
        diagnosis: res.diagnosis,
        advice: res.advice,
        constitution: res.constitution || '未知',
      });
      showToast('舌诊望诊分析完成！', 'success');
    } catch (err: any) {
      showToast(err?.response?.data?.detail ?? '舌诊分析暂时不可用，请稍后重试', 'error');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleContinueConsult = () => {
    if (!result) return;
    // Navigate to home with context
    navigateTo('home-main', 'home');
    showToast('已返回主页，可粘贴舌诊结果进行追问', 'info');
  };

  return (
    <div id="tongue_scan_view" className="max-w-3xl mx-auto px-6 py-8 w-full space-y-8">

      {/* Header */}
      <div className="text-center space-y-2 relative">
        <button onClick={goBack}
          className="absolute left-0 top-0 w-10 h-10 rounded-full bg-white border border-black/5 hover:bg-neutral-100 flex items-center justify-center text-neutral-400 hover:text-neutral-600 transition-all cursor-pointer">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-purple-700 text-[10px] font-bold tracking-widest uppercase">
          <Eye className="w-3.5 h-3.5" />
          AI Tongue Diagnosis
        </div>
        <h1 className="text-2xl font-black text-[#1b1c1c]">智能舌部扫描</h1>
        <p className="text-sm text-[#747968] font-medium max-w-md mx-auto">
          上传清晰的舌面照片，AI 将根据舌色、苔质、舌形等特征进行中医望诊分析。
        </p>
      </div>

      {/* Upload / Preview area */}
      <div className="bg-white border border-black/5 rounded-2xl p-6 shadow-xs space-y-6">
        <AnimatePresence mode="wait">
          {!image ? (
            /* Upload state */
            <motion.div key="upload" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-12 space-y-4">
              <div className="w-20 h-20 rounded-2xl bg-purple-50 flex items-center justify-center">
                <Camera className="w-9 h-9 text-purple-400" />
              </div>
              <div className="text-center space-y-1">
                <p className="text-sm font-bold text-[#1b1c1c]">拍摄或上传舌面照片</p>
                <p className="text-xs text-[#747968]">请在自然光下拍摄，避免美颜滤镜，舌头自然伸出</p>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                />
                <button onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-sm font-bold transition-all cursor-pointer shadow-sm">
                  <Upload className="w-4 h-4" />
                  上传舌苔图片
                </button>
              </div>
              <p className="text-[10px] text-neutral-400">支持 JPG / PNG / WebP，不超过 5MB</p>
            </motion.div>
          ) : (
            /* Preview state */
            <motion.div key="preview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-[#1b1c1c]">已上传舌苔图片</h3>
                <button onClick={handleRemoveImage}
                  className="flex items-center gap-1 text-xs font-bold text-neutral-400 hover:text-red-500 transition-all">
                  <X className="w-3.5 h-3.5" />移除
                </button>
              </div>
              <div className="relative rounded-2xl overflow-hidden bg-black/5 flex items-center justify-center max-h-[320px]">
                <img src={image} alt="舌苔" className="max-w-full max-h-[320px] object-contain" />
              </div>
              <p className="text-xs text-[#747968] truncate">{imageName}</p>
              {!isAnalyzing && !result && (
                <button onClick={handleAnalyze}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-sm font-bold transition-all cursor-pointer shadow-sm">
                  <Sparkles className="w-4 h-4" />
                  开始 AI 舌诊分析
                </button>
              )}
              {isAnalyzing && (
                <div className="w-full flex items-center justify-center gap-3 py-4 rounded-xl bg-purple-50 border border-purple-200">
                  <Sparkles className="w-5 h-5 text-purple-500 animate-spin" />
                  <span className="text-sm font-bold text-purple-700">AI 望诊分析中…</span>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Result */}
        <AnimatePresence>
          {result && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="border border-purple-200 bg-purple-50/50 rounded-2xl p-5 space-y-5">

              <div className="flex items-center gap-2 pb-3 border-b border-purple-200">
                <Activity className="w-4 h-4 text-purple-600" />
                <span className="text-xs font-bold text-purple-700 uppercase tracking-wider">望诊分析结果</span>
              </div>

              <div>
                <h3 className="text-base font-black text-[#1b1c1c] mb-2">{result.title}</h3>
                <p className="text-sm text-[#44493a] leading-relaxed whitespace-pre-wrap">{result.diagnosis}</p>
              </div>

              <div className="bg-white rounded-xl p-4 border border-purple-100">
                <p className="text-xs font-bold text-purple-700 mb-1">体质判断</p>
                <span className="inline-block px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-bold">
                  {result.constitution}
                </span>
              </div>

              <div className="bg-white rounded-xl p-4 border border-purple-100">
                <p className="text-xs font-bold text-purple-700 mb-1">养生建议</p>
                <p className="text-sm text-[#44493a] leading-relaxed whitespace-pre-wrap">{result.advice}</p>
              </div>

              <button onClick={handleContinueConsult}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#466805] hover:bg-[#466805]/90 text-white text-sm font-bold transition-all cursor-pointer">
                <span>基于此舌诊结果，进行完整辨证咨询</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Tips */}
      <div className="bg-white border border-black/5 rounded-2xl p-5 space-y-3">
        <h3 className="text-sm font-bold text-[#1b1c1c]">拍摄舌苔小贴士</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 bg-amber-50 rounded-xl border border-amber-100">
            <p className="font-bold text-amber-800 mb-0.5">☀️ 自然光线</p>
            <p className="text-amber-700">在白天自然光下拍摄，避免黄色灯光影响舌色判断。</p>
          </div>
          <div className="p-3 bg-blue-50 rounded-xl border border-blue-100">
            <p className="font-bold text-blue-800 mb-0.5">👅 自然伸舌</p>
            <p className="text-blue-700">舌头自然伸出，不要用力，拍到舌面和舌根为佳。</p>
          </div>
          <div className="p-3 bg-green-50 rounded-xl border border-green-100">
            <p className="font-bold text-green-800 mb-0.5">🚫 避免干扰</p>
            <p className="text-green-700">拍摄前不喝咖啡、茶、不吸烟，避免舌苔染色。</p>
          </div>
        </div>
      </div>

    </div>
  );
};
