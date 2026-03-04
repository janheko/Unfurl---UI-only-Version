import { Task, EnergyLevel, TaskCategory } from '../types';

// Helper to check if a date is today
function isToday(date: Date): boolean {
  const today = new Date();
  return date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear();
}

// AI-powered subtask distribution across days until deadline
export function distributeSubtasksAcrossDays(task: Task): Task {
  if (!task.subtasks || task.subtasks.length === 0 || !task.deadline) {
    return task;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const deadline = new Date(task.deadline);
  deadline.setHours(0, 0, 0, 0);
  
  const daysUntilDeadline = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  
  if (daysUntilDeadline <= 0) {
    // Deadline passed or today - schedule all for today
    return {
      ...task,
      subtasks: task.subtasks.map(st => ({
        ...st,
        scheduledDate: st.scheduledDate || today.toISOString(),
      })),
    };
  }

  // Distribute subtasks evenly across available days
  const subtasksWithSchedule = task.subtasks.map((subtask, index) => {
    if (subtask.completed || subtask.scheduledDate) {
      return subtask; // Keep existing schedule or completed status
    }

    // Simple distribution: spread subtasks evenly
    const dayOffset = Math.floor((index / task.subtasks!.length) * daysUntilDeadline);
    const scheduledDate = new Date(today);
    scheduledDate.setDate(scheduledDate.getDate() + dayOffset);
    
    return {
      ...subtask,
      scheduledDate: scheduledDate.toISOString(),
    };
  });

  return {
    ...task,
    subtasks: subtasksWithSchedule,
  };
}

// Categorize task type based on deadline and subtasks
export function getTaskType(task: Task): 'global' | 'future' | 'regular' {
  if (!task.deadline) return 'regular';
  
  const deadline = new Date(task.deadline);
  const isDueToday = isToday(deadline);
  
  if (isDueToday) return 'regular';
  
  // Not due today
  if (task.subtasks && task.subtasks.length > 0) {
    return 'global'; // Global task: has subtasks + not due today
  } else {
    return 'future'; // Future project: no subtasks + not due today
  }
}

// Mock AI task parsing - in production, this would call OpenAI API
export function parseTaskDump(input: string): Task[] {
  const lines = input.split('\n').filter(line => line.trim().length > 0);
  const tasks: Task[] = [];

  lines.forEach((line, index) => {
    // Simple parsing logic - in production this would use AI
    const estimatedMinutes = line.toLowerCase().includes('quick') ? 15 : 
                            line.toLowerCase().includes('long') ? 60 : 30;
    
    let category: TaskCategory = 'work';
    if (line.toLowerCase().includes('clean') || line.toLowerCase().includes('wash')) {
      category = 'chores';
    } else if (line.toLowerCase().includes('write') || line.toLowerCase().includes('draw')) {
      category = 'creative';
    } else if (line.toLowerCase().includes('relax') || line.toLowerCase().includes('rest')) {
      category = 'selfcare';
    }

    tasks.push({
      id: `task-${Date.now()}-${index}`,
      name: line.trim(),
      category,
      estimatedMinutes,
      energyRequired: Math.floor(Math.random() * 5) + 3, // 3-8
      urgency: Math.floor(Math.random() * 10) + 1,
      importance: Math.floor(Math.random() * 10) + 1,
      createdAt: Date.now(),
    });
  });

  return tasks;
}

export function getPrioritizedTasks(
  tasks: Task[],
  energyLevel: EnergyLevel,
  count: number = 3
): Task[] {
  const energyMap: Record<EnergyLevel, number> = {
    fog: 3,
    steady: 6,
    hyperfocus: 9,
  };

  const userEnergy = energyMap[energyLevel];
  const now = Date.now();

  // Filter tasks - include regular tasks AND global tasks with subtasks scheduled for today
  const todayTasks = tasks.filter(task => {
    const taskType = getTaskType(task);
    
    if (taskType === 'regular') {
      return true;
    }
    
    if (taskType === 'global' && task.subtasks) {
      // Include global task if it has any incomplete subtasks added to today
      return task.subtasks.some(st => !st.completed && st.addedToToday);
    }
    
    return false;
  });

  // Filter tasks that match the user's energy level
  const suitableTasks = todayTasks.filter(
    task => Math.abs(task.energyRequired - userEnergy) <= 3
  );

  // Calculate priority score
  const scoredTasks = suitableTasks.map(task => {
    const energyMatch = 10 - Math.abs(task.energyRequired - userEnergy);
    
    // DEADLINE BOOST: Tasks with deadlines get massive priority boost
    let deadlineBoost = 0;
    if (task.deadline) {
      const deadline = new Date(task.deadline).getTime();
      const hoursUntilDeadline = (deadline - now) / (1000 * 60 * 60);
      
      if (hoursUntilDeadline < 0) {
        deadlineBoost = 100; // Overdue tasks are top priority
      } else if (hoursUntilDeadline < 24) {
        deadlineBoost = 50; // Due today
      } else if (hoursUntilDeadline < 48) {
        deadlineBoost = 30; // Due tomorrow
      } else if (hoursUntilDeadline < 168) {
        deadlineBoost = 15; // Due this week
      }
    }
    
    const score = 
      task.urgency * 0.4 + 
      task.importance * 0.3 + 
      energyMatch * 0.3 +
      deadlineBoost;
    
    return { task, score };
  });

  // Sort by score and return top tasks
  scoredTasks.sort((a, b) => b.score - a.score);
  
  const selectedTasks = scoredTasks.slice(0, count).map(({ task }) => task);
  
  // Randomly select which tasks to reveal (only first one is revealed)
  return selectedTasks.map((task, index) => ({
    ...task,
    isRevealed: index === 0,
  }));
}

export function shuffleTasks(allTasks: Task[], currentTasks: Task[], energyLevel: EnergyLevel): Task[] {
  // Remove current tasks from pool
  const availableTasks = allTasks.filter(
    t => !currentTasks.some(ct => ct.id === t.id)
  );
  
  if (availableTasks.length === 0) {
    // If no more tasks, re-shuffle from all tasks
    return getPrioritizedTasks(allTasks, energyLevel, 3);
  }
  
  return getPrioritizedTasks(availableTasks, energyLevel, 3);
}