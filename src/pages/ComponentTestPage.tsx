import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ErrorNotification, { useErrorStore } from '../components/ErrorNotification'; // useErrorStore を追加
import OfflineIndicator from '../components/OfflineIndicator';
import { useNetworkStore } from '../stores/networkStore';

const ComponentTestPage: React.FC = () => {
  const { componentName } = useParams<{ componentName: string }>();

  switch (componentName) {
    case 'error-notification':
      useEffect(() => {
        useErrorStore.getState().setMessage("This is a test error message.");
        return () => {
          useErrorStore.getState().setMessage(null); // クリーンアップ
        };
      }, []);
      return (
        <div style={{ padding: '20px' }}>
          <h1>Error Notification Test</h1>
          <ErrorNotification />
        </div>
      );
    case 'offline-indicator':
      // Playwright テスト用に isOnline を false に設定
      useEffect(() => {
        useNetworkStore.setState({ isOnline: false });
        return () => {
          // テスト終了後に状態を元に戻す（必要であれば）
          useNetworkStore.setState({ isOnline: true });
        };
      }, []);
      return (
        <div style={{ padding: '20px' }}>
          <h1>Offline Indicator Test</h1>
          <OfflineIndicator />
        </div>
      );
    // 他のコンポーネントもここに追加
    default:
      return <div>Component not found.</div>;
  }
};

export default ComponentTestPage;
