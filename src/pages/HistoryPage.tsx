import React, { useEffect, useState } from 'react';
import { gitService } from '../services/gitService';
import type { CommitInfo } from '../types';

const HistoryPage: React.FC = () => {
  const [commits, setCommits] = useState<CommitInfo[]>([]);

  useEffect(() => {
    gitService.getHistory().then(setCommits);
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Commit History</h1>
      <div className="space-y-4">
        {commits.map((commit) => (
          <div key={commit.hash} className="p-4 border border-gray-200 rounded-md shadow-sm">
            <p className="font-semibold">{commit.message}</p>
            <p className="text-sm text-gray-600">Author: {commit.author}</p>
            <p className="text-sm text-gray-600">Date: {new Date(commit.date).toLocaleString()}</p>
            <p className="text-xs text-gray-500">Hash: {commit.hash}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HistoryPage;
