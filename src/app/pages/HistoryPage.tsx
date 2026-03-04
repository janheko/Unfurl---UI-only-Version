import React, { useContext } from 'react';
import { useNavigate } from 'react-router';
import { AppContext } from '../layouts/MainLayout';
import { History } from '../components/History';

export function HistoryPage() {
  const navigate = useNavigate();
  const { completedTasks } = useContext(AppContext);

  return (
    <History
      completedTasks={completedTasks}
      onClose={() => navigate('/')}
    />
  );
}
