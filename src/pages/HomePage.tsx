import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { memoService } from '../services/memoService';
import { Memo } from '../types';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [memos, setMemos] = useState<Memo[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    memoService.listMemos().then(setMemos);
  }, []);

  const handleCreateNewMemo = async () => {
    const newMemo = await memoService.createMemo('New Memo', '# New Memo\n\nStart writing your memo here.');
    navigate(`/edit/${newMemo.id}`);
  };

  const filteredMemos = useMemo(() => {
    return memos.filter(
      (memo) =>
        memo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        memo.content.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [memos, searchTerm]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Your Memos</h1>
      <div className="flex mb-4 space-x-2">
        <button
          onClick={handleCreateNewMemo}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Create New Memo
        </button>
        <input
          type="text"
          placeholder="Search memos..."
          className="flex-grow p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMemos.map((memo) => (
          <div
            key={memo.id}
            className="p-4 border border-gray-200 rounded-md shadow-sm cursor-pointer hover:shadow-md"
            onClick={() => navigate(`/edit/${memo.id}`)}
          >
            <h2 className="text-xl font-semibold mb-2">{memo.title}</h2>
            <p className="text-gray-600 text-sm">
              Last updated: {new Date(memo.updatedAt).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
