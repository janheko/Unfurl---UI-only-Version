import { createBrowserRouter } from 'react-router';
import { MainLayout } from './layouts/MainLayout';
import { Dashboard } from './pages/Dashboard';
import { TaskQueuePage } from './pages/TaskQueuePage';
import { FocusPage } from './pages/FocusPage';
import { HistoryPage } from './pages/HistoryPage';
import { GardenPage } from './pages/GardenPage';
import { BouquetDetailPage } from './pages/BouquetDetailPage';
import { FlowerDetailPage } from './pages/FlowerDetailPage';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: MainLayout,
    children: [
      {
        index: true,
        Component: Dashboard,
      },
      {
        path: 'queue',
        Component: TaskQueuePage,
      },
      {
        path: 'focus/:taskId',
        Component: FocusPage,
      },
      {
        path: 'history',
        Component: HistoryPage,
      },
      {
        path: 'garden',
        Component: GardenPage,
      },
      {
        path: 'bouquet/:date',
        Component: BouquetDetailPage,
      },
      {
        path: 'flower/:flowerId',
        Component: FlowerDetailPage,
      },
    ],
  },
]);