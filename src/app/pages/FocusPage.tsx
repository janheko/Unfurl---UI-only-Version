import React, { useContext, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { AppContext } from '../layouts/MainLayout';
import { FocusTimer } from '../components/FocusTimer';
import { CompletedTask } from '../types';

export function FocusPage() {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const { prioritizedTasks, setAllTasks, setPrioritizedTasks, allTasks, completedTasks, setCompletedTasks, currentTaskIndex } = useContext(AppContext);

  const task = prioritizedTasks.find(t => t.id === taskId);

  useEffect(() => {
    if (!task) {
      navigate('/');
    }
  }, [task, navigate]);

  if (!task) {
    return null;
  }

  const handleComplete = (timeSpent: number, subtaskId?: string) => {
    // Determine flower type
    let flowerType: 'rose' | 'daisy' | 'sunflower' | 'lavender';
    
    if (task.energyRequired >= 8) {
      flowerType = 'rose';
    } else if (task.estimatedMinutes >= 60) {
      flowerType = 'sunflower';
    } else if (task.energyRequired <= 4) {
      flowerType = 'lavender';
    } else {
      flowerType = 'daisy';
    }

    if (subtaskId) {
      // Completing a subtask from a global task
      const updatedTasks = allTasks.map(t => {
        if (t.id === task.id && t.subtasks) {
          return {
            ...t,
            subtasks: t.subtasks.map(st =>
              st.id === subtaskId
                ? { ...st, completed: true, completedAt: Date.now() }
                : st
            ),
          };
        }
        return t;
      });
      setAllTasks(updatedTasks);

      // Create completed task entry for the subtask
      const completedSubtask = task.subtasks?.find(st => st.id === subtaskId);
      if (completedSubtask) {
        const completedTask: CompletedTask = {
          ...task,
          name: `${task.name} - ${completedSubtask.name}`,
          completedAt: Date.now(),
          timeSpent,
          flowerType,
        };
        setCompletedTasks([...completedTasks, completedTask]);
      }

      // Check if all subtasks for today are done
      const remainingTodaySubtasks = task.subtasks?.filter(
        st => st.addedToToday && !st.completed && st.id !== subtaskId
      );

      if (!remainingTodaySubtasks || remainingTodaySubtasks.length === 0) {
        // All today's subtasks done, remove from prioritized
        setPrioritizedTasks(prioritizedTasks.filter(t => t.id !== task.id));
      }
    } else {
      // Completing a regular task
      const completedTask: CompletedTask = {
        ...task,
        completedAt: Date.now(),
        timeSpent,
        flowerType,
      };
      
      setCompletedTasks([...completedTasks, completedTask]);
      
      // Remove from all tasks and prioritized tasks
      setAllTasks(allTasks.filter(t => t.id !== task.id));
      setPrioritizedTasks(prioritizedTasks.filter(t => t.id !== task.id));
    }
    
    // Navigate back to dashboard
    navigate('/');
  };

  const handleClose = () => {
    navigate('/');
  };

  const handleSkip = () => {
    // Skip to next task - keep this task in the list
    navigate('/');
  };

  const handlePauseLater = () => {
    // Move task to end of today's queue
    const taskIndex = prioritizedTasks.findIndex(t => t.id === task.id);
    if (taskIndex !== -1) {
      const reorderedTasks = [
        ...prioritizedTasks.slice(0, taskIndex),
        ...prioritizedTasks.slice(taskIndex + 1),
        task,
      ];
      setPrioritizedTasks(reorderedTasks);
    }
    navigate('/');
  };

  const handlePauseTomorrow = () => {
    // Set deadline to tomorrow and remove from prioritized
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(23, 59, 0, 0);

    const updatedTasks = allTasks.map(t =>
      t.id === task.id
        ? { ...t, deadline: tomorrow.toISOString() }
        : t
    );
    setAllTasks(updatedTasks);
    setPrioritizedTasks(prioritizedTasks.filter(t => t.id !== task.id));
    navigate('/');
  };

  return (
    <FocusTimer
      task={task}
      onClose={handleClose}
      onComplete={handleComplete}
      onSkip={handleSkip}
      onPauseLater={handlePauseLater}
      onPauseTomorrow={handlePauseTomorrow}
    />
  );
}