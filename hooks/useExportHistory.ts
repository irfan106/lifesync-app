import { useState } from 'react';
import { Share } from 'react-native';
import { ITask } from '@interfaces/task.interface';
import Toast from 'react-native-toast-message';

type ExportFormat = 'json' | 'csv';

export const useExportHistory = () => {
  const [isExporting, setIsExporting] = useState(false);

  const exportTasks = async (tasks: ITask[], format: ExportFormat = 'json') => {
    if (tasks.length === 0) {
      Toast.show({
        type: 'error',
        text1: 'No Tasks',
        text2: 'There are no tasks to export.',
      });
      return;
    }

    setIsExporting(true);

    try {
      let content: string;

      if (format === 'json') {
        content = JSON.stringify(tasks, null, 2);
      } else {
        // CSV Format
        const headers = ['ID', 'Title', 'Category', 'Scheduled For', 'Completed', 'Completed At'];
        const rows = tasks.map((t) => [
          t.id,
          `"${t.title.replace(/"/g, '""')}"`,
          t.category || '',
          new Date(t.scheduledFor).toISOString(),
          t.isCompleted ? 'Yes' : 'No',
          t.completedAt ? new Date(t.completedAt).toISOString() : '',
        ]);
        content = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
      }

      // Use Share API
      const result = await Share.share({
        message: content,
        title: `Task History Export (${format.toUpperCase()})`,
      });

      if (result.action === Share.sharedAction) {
        Toast.show({
          type: 'success',
          text1: 'Export Successful',
          text2: `Exported ${tasks.length} tasks as ${format.toUpperCase()}.`,
        });
      }
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Export Failed',
        text2: error.message || 'Something went wrong.',
      });
    } finally {
      setIsExporting(false);
    }
  };

  return { exportTasks, isExporting };
};
