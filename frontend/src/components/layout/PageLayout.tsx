/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { TopNav } from './TopNav';
import { Footer } from './Footer';
import { useApp } from '../../context/AppContext';
import { AlertCircle, CheckCircle, Info, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const PageLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { toast, hideToast, activePage } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-[#fbf9f8] text-[#1b1c1c] selection:bg-[#7ba23f]/20 font-sans antialiased">
      
      {/* Top sticky navigation bar */}
      <TopNav />

      {/* Main scrolling content area */}
      <main className="flex-1 flex flex-col w-full">
        {children}
      </main>

      {/* Universal footer */}
      <Footer />

      {/* Universal Notification Toast with framer-motion */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            id="toast_message"
            className="fixed top-24 left-1/2 -translate-x-1/2 z-50 max-w-md w-full px-4"
          >
            <div className={`p-4 rounded-2xl shadow-xl flex items-start gap-3 border ${
              toast.type === 'success' 
                ? 'bg-[#ffffff] border-emerald-100 text-emerald-900 shadow-emerald-500/5' 
                : toast.type === 'error'
                  ? 'bg-[#ffffff] border-red-100 text-red-900 shadow-red-500/5'
                  : 'bg-[#ffffff] border-amber-100 text-amber-900 shadow-amber-500/5'
            }`}>
              
              <div className="mt-0.5">
                {toast.type === 'success' && <CheckCircle className="w-5 h-5 text-emerald-600" />}
                {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-red-600" />}
                {toast.type === 'info' && <Info className="w-5 h-5 text-amber-600" />}
              </div>

              <div className="flex-1">
                <p className="text-xs font-semibold leading-relaxed">
                  {toast.message}
                </p>
              </div>

              <button 
                onClick={hideToast}
                className="text-neutral-400 hover:text-neutral-600 rounded-lg p-0.5"
              >
                <X className="w-4 h-4" />
              </button>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};
