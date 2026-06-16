/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { PageLayout } from './components/layout/PageLayout';
import { Login } from './pages/Login';
import { Home } from './pages/Home';
import { Herbs } from './pages/Herbs';
import { Herbs as HerbsList } from './pages/Herbs'; // Alias if needed
import { HerbDetail } from './pages/HerbDetail';
import { Recipes } from './pages/Recipes';
import { RecipeDetail } from './pages/RecipeDetail';
import { Workouts } from './pages/Workouts';
import { WorkoutDetail } from './pages/WorkoutDetail';
import { Profile } from './pages/Profile';
import { Favorites } from './pages/Favorites';
import { History } from './pages/History';
import { Settings } from './pages/Settings';
import { About } from './pages/About';
import { Feedback } from './pages/Feedback';
import { ConstitutionTest } from './pages/ConstitutionTest';
import { Reminders } from './pages/Reminders';
import { motion, AnimatePresence } from 'motion/react';

// Main content dispatcher
const ContentDispatcher: React.FC = () => {
  const { isLoggedIn, activeTab, activePage } = useApp();

  // If not authenticated, render Login Page
  if (!isLoggedIn) {
    return <Login />;
  }

  // Active page component selection
  const renderPageContent = () => {
    switch (activePage) {
      case 'home-main':
        switch (activeTab) {
          case 'home':
            return <Home />;
          case 'herbs':
            return <Herbs />;
          case 'recipes':
            return <Recipes />;
          case 'workouts':
            return <Workouts />;
          case 'profile':
            return <Profile />;
          default:
            return <Home />;
        }
      case 'herb-detail':
        return <HerbDetail />;
      case 'recipe-detail':
        return <RecipeDetail />;
      case 'workout-detail':
        return <WorkoutDetail />;
      case 'favorites':
        return <Favorites />;
      case 'history':
        return <History />;
      case 'settings':
        return <Settings />;
      case 'about':
        return <About />;
      case 'feedback':
        return <Feedback />;
      case 'constitution-test':
        return <ConstitutionTest />;
      case 'reminders':
        return <Reminders />;
      default:
        return <Home />;
    }
  };

  return (
    <PageLayout>
      <AnimatePresence mode="wait">
        <motion.div
          key={`${activePage}-${activeTab}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.22 }}
          className="flex-1 flex flex-col w-full"
        >
          {renderPageContent()}
        </motion.div>
      </AnimatePresence>
    </PageLayout>
  );
};

export default function App() {
  return (
    <AppProvider>
      <ContentDispatcher />
    </AppProvider>
  );
}
