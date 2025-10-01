import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Download, Upload, Database, HardDrive } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import TopNav from '../components/TopNav';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { useToastContext } from '../contexts/ToastContext';
import { getMembers } from '../slices/membersSlice';
import { LocalStorageService } from '../services/localStorage';
import { ExcelService } from '../services/excelService';
import type { RootState } from '../store';
import type { AppDispatch } from '../store';

const BackupPage: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const { addToast } = useToastContext();
  const { list: members } = useSelector((state: RootState) => state.members);
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);

  const handleBackup = async (format: 'json' | 'excel' = 'json') => {
    if (members.length === 0) {
      addToast({
        title: t('common.warning'),
        message: t('backup.noDataToBackup'),
        type: 'warning'
      });
      return;
    }

    setIsBackingUp(true);

    try {
      if (format === 'excel') {
        await ExcelService.exportToExcel(members, 'أعضاء_الحزب.xlsx');
        addToast({
          title: t('common.success'),
          message: t('export.excelSuccess'),
          type: 'success'
        });
      } else {
        // JSON backup
        const backupData = {
          members,
          timestamp: new Date().toISOString(),
          version: '1.0.0'
        };

        const dataStr = JSON.stringify(backupData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });

        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `backup_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        addToast({
          title: t('common.success'),
          message: t('backup.backupSuccess'),
          type: 'success'
        });
      }
    } catch (error) {
      console.error('Backup error:', error);
      addToast({
        title: t('common.error'),
        message: t('backup.backupError'),
        type: 'error'
      });
    } finally {
      setIsBackingUp(false);
    }
  };

  const handleRestore = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.json')) {
      addToast({
        title: t('common.error'),
        message: t('backup.invalidFile'),
        type: 'error'
      });
      return;
    }

    setIsRestoring(true);

    try {
      const text = await file.text();
      const backupData = JSON.parse(text);

      if (!backupData.members || !Array.isArray(backupData.members)) {
        throw new Error(t('backup.invalidBackupFile'));
      }

      // Clear existing data
      LocalStorageService.clearAllData();
      
      // Restore members
      for (const member of backupData.members) {
        LocalStorageService.addMember(member);
      }

      // Refresh members in Redux store
      await dispatch(getMembers());

      addToast({
        title: t('common.success'),
        message: t('backup.membersRestored', { count: backupData.members.length }),
        type: 'success'
      });
    } catch (error) {
      console.error('Restore error:', error);
      addToast({
        title: t('common.error'),
        message: t('backup.restoreError'),
        type: 'error'
      });
    } finally {
      setIsRestoring(false);
    }
  };

  const handleClearAllData = () => {
    if (window.confirm(t('backup.clearAllDataWarning'))) {
      try {
        LocalStorageService.clearAllData();
        dispatch(getMembers());
        addToast({
          title: t('common.success'),
          message: t('backup.dataCleared'),
          type: 'success'
        });
      } catch (error) {
        console.error('Clear data error:', error);
        addToast({
          title: t('common.error'),
          message: t('backup.clearDataError'),
          type: 'error'
        });
      }
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-900">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col">
        <TopNav onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 p-4 lg:p-8">
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {t('backup.title')}
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  {t('backup.subtitle')}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Backup Section */}
              <Card className="p-6">
                <div className="text-center">
                  <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-4">
                    <Upload className="h-8 w-8 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {t('backup.createBackup')}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    {t('backup.backupDescription')}
                  </p>
                  <Button
                    onClick={() => handleBackup('json')}
                    disabled={isBackingUp || members.length === 0}
                    leftIcon={<Database className="h-5 w-5" />}
                    className="w-full"
                    size="lg"
                  >
                    {isBackingUp ? t('backup.creatingBackup') : t('backup.createBackup')}
                  </Button>
                </div>
              </Card>

              {/* Restore Section */}
              <Card className="p-6">
                <div className="text-center">
                  <div className="mx-auto w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4">
                    <Download className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {t('backup.restoreData')}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    {t('backup.restoreDescription')}
                  </p>
                  <div className="space-y-4">
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleRestore}
                      className="hidden"
                      id="restore-file"
                      disabled={isRestoring}
                    />
                    <label htmlFor="restore-file">
                      <Button
                        variant="secondary"
                        size="lg"
                        leftIcon={<HardDrive className="h-5 w-5" />}
                        disabled={isRestoring}
                        className="w-full"
                      >
                        {isRestoring ? t('backup.restoring') : t('backup.selectRestoreFile')}
                      </Button>
                    </label>
                  </div>
                </div>
              </Card>
            </div>

            {/* Data Statistics */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                {t('backup.dataStatistics')}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {members.length}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {t('backup.totalMembers')}
                  </div>
                </div>
                
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {new Date().toLocaleDateString()}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {t('backup.lastUpdate')}
                  </div>
                </div>
                
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {Math.round(JSON.stringify(members).length / 1024)} KB
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {t('backup.dataSize')}
                  </div>
                </div>
              </div>
            </Card>

            {/* Danger Zone */}
            <Card className="p-6 border-red-200 dark:border-red-800">
              <h3 className="text-lg font-semibold text-red-600 dark:text-red-400 mb-4">
                {t('backup.dangerZone')}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                {t('backup.clearAllDataWarning')}
              </p>
              <Button
                onClick={handleClearAllData}
                variant="secondary"
                className="border-red-300 text-red-600 hover:bg-red-50 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-900"
              >
                {t('backup.clearAllData')}
              </Button>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default BackupPage;
