import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMemoStore } from '../stores/memoStore';
import { memoService } from '../services/memoService';

const HomePage: React.FC = () => {
  const memos = useMemoStore((state) => state.memos);
  const setMemos = useMemoStore((state) => state.setMemos);
  const navigate = useNavigate();

  useEffect(() => {
    memoService.listMemos().then(setMemos);
  }, [setMemos]);

  const handleCreateMemo = async () => {
    const newMemo = await memoService.createMemo('New Memo', '');
    navigate(`/edit/${newMemo.id}`);
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Memos</h1>
        <button
          onClick={handleCreateMemo}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          Create Memo
        </button>
      </div>
      <div className="space-y-2">
        {memos.map((memo) => (
          <Link to={`/edit/${memo.id}`} key={memo.id} className="block p-4 bg-white rounded-lg shadow-md hover:bg-gray-50">
            <h2 className="text-lg font-semibold">{memo.title}</h2>
            <p className="text-sm text-gray-500">
              Last updated: {new Date(memo.updatedAt).toLocaleString()}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
