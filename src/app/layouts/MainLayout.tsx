import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router';
import { Task, CompletedTask, EnergyLevel } from '../types';
import { EnergyCheck } from '../components/EnergyCheck';

// Context for sharing state across pages
export const AppContext = React.createContext<{
  energyLevel: EnergyLevel | null;
  setEnergyLevel: (level: EnergyLevel) => void;
  allTasks: Task[];
  setAllTasks: (tasks: Task[]) => void;
  prioritizedTasks: Task[];
  setPrioritizedTasks: (tasks: Task[]) => void;
  currentTaskIndex: number;
  setCurrentTaskIndex: (index: number) => void;
  completedTasks: CompletedTask[];
  setCompletedTasks: (tasks: CompletedTask[]) => void;
  customCategories: string[];
  setCustomCategories: (categories: string[]) => void;
  isPrioritized: boolean;
  setIsPrioritized: (prioritized: boolean) => void;
  todaysBouquet: CompletedTask[];
  gardenBouquets: { date: string; flowers: CompletedTask[] }[];
  setGardenBouquets: (bouquets: { date: string; flowers: CompletedTask[] }[]) => void;
  todaysTasks: Task[]; // Tasks explicitly added to today's queue
  setTodaysTasks: (tasks: Task[]) => void;
}>({
  energyLevel: null,
  setEnergyLevel: () => {},
  allTasks: [],
  setAllTasks: () => {},
  prioritizedTasks: [],
  setPrioritizedTasks: () => {},
  currentTaskIndex: 0,
  setCurrentTaskIndex: () => {},
  completedTasks: [],
  setCompletedTasks: () => {},
  customCategories: [],
  setCustomCategories: () => {},
  isPrioritized: false,
  setIsPrioritized: () => {},
  todaysBouquet: [],
  gardenBouquets: [],
  setGardenBouquets: () => {},
  todaysTasks: [],
  setTodaysTasks: () => {},
});

export function MainLayout() {
  const [energyLevel, setEnergyLevel] = useState<EnergyLevel | null>(null);
  const [allTasks, setAllTasks] = useState<Task[]>([]);
  const [prioritizedTasks, setPrioritizedTasks] = useState<Task[]>([]);
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [completedTasks, setCompletedTasks] = useState<CompletedTask[]>([]);
  const [customCategories, setCustomCategories] = useState<string[]>([]);
  const [isPrioritized, setIsPrioritized] = useState(false);
  const [gardenBouquets, setGardenBouquets] = useState<{ date: string; flowers: CompletedTask[] }[]>([]);
  const [todaysTasks, setTodaysTasks] = useState<Task[]>([]);

  // Load custom categories from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('unfurl_custom_categories');
    if (saved) {
      setCustomCategories(JSON.parse(saved));
    }
  }, []);

  // Load garden bouquets from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('unfurl_garden_bouquets');
    if (saved) {
      setGardenBouquets(JSON.parse(saved));
    }
  }, []);

  // Save custom categories to localStorage
  useEffect(() => {
    localStorage.setItem('unfurl_custom_categories', JSON.stringify(customCategories));
  }, [customCategories]);

  // Save garden bouquets to localStorage
  useEffect(() => {
    localStorage.setItem('unfurl_garden_bouquets', JSON.stringify(gardenBouquets));
  }, [gardenBouquets]);

  // Check for midnight and save today's bouquet to garden
  useEffect(() => {
    const checkMidnight = () => {
      const now = new Date();
      const lastCheck = localStorage.getItem('unfurl_last_midnight_check');
      const today = now.toDateString();

      if (lastCheck !== today) {
        // It's a new day! Save yesterday's bouquet if it has flowers
        const yesterdaysBouquet = completedTasks;
        if (yesterdaysBouquet.length > 0) {
          const yesterday = new Date(now);
          yesterday.setDate(yesterday.getDate() - 1);
          const dateStr = yesterday.toISOString().split('T')[0];
          
          const newBouquet = {
            date: dateStr,
            flowers: yesterdaysBouquet,
          };
          
          setGardenBouquets([...gardenBouquets, newBouquet]);
        }
        
        // Clear today's bouquet for the new day
        setCompletedTasks([]);
        localStorage.setItem('unfurl_last_midnight_check', today);
      }
    };

    // Check immediately
    checkMidnight();

    // Check every minute for midnight
    const interval = setInterval(checkMidnight, 60000);
    return () => clearInterval(interval);
  }, [completedTasks, gardenBouquets]);

  // Today's bouquet is just the completed tasks for today
  const todaysBouquet = completedTasks;

  // Show energy check screen first
  if (!energyLevel) {
    return <EnergyCheck onSelectEnergy={(energy) => setEnergyLevel(energy)} />;
  }

  return (
    <AppContext.Provider
      value={{
        energyLevel,
        setEnergyLevel,
        allTasks,
        setAllTasks,
        prioritizedTasks,
        setPrioritizedTasks,
        currentTaskIndex,
        setCurrentTaskIndex,
        completedTasks,
        setCompletedTasks,
        customCategories,
        setCustomCategories,
        isPrioritized,
        setIsPrioritized,
        todaysBouquet,
        gardenBouquets,
        setGardenBouquets,
        todaysTasks,
        setTodaysTasks,
      }}
    >
      <Outlet />
    </AppContext.Provider>
  );
}