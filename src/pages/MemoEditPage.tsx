import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { memoService } from '../services/memoService';
import type { Memo } from '../types';
import { marked } from 'marked';

const MemoEditPage: React.FC = () => {
  const { memoId } = useParams<{ memoId: string }>();
  const navigate = useNavigate();
  const [memo, setMemo] = useState<Memo | null>(null);
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [isPreview, setIsPreview] = useState(false);

  useEffect(() => {
    if (memoId) {
      memoService.getMemo(memoId).then((fetchedMemo) => {
        setMemo(fetchedMemo);
        setContent(fetchedMemo.content);
        setTitle(fetchedMemo.title);
      });
    }
  }, [memoId]);

  const handleSave = async () => {
    if (memo) {
      await memoService.updateMemo(memo.id, content);
      navigate('/'); // Navigate back to home after saving
    } else {
      // For new memo creation, this page is not yet designed for it.
      // A separate creation flow would be needed.
      console.error("Cannot save a new memo from edit page.");
    }
  };

  const getMarkdownPreview = () => {
    return { __html: marked.parse(content) };
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">{title || 'New Memo'}</h1>
      <div className="mb-4">
        <button
          onClick={() => setIsPreview(!isPreview)}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          {isPreview ? 'Edit' : 'Preview'}
        </button>
        <button
          onClick={handleSave}
          className="ml-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
        >
          Save
        </button>
      </div>
      {isPreview ? (
        <div
          className="prose max-w-none border p-4 rounded-md bg-gray-50"
          dangerouslySetInnerHTML={getMarkdownPreview()}
        ></div>
      ) : (
        <textarea
          className="w-full h-96 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        ></textarea>
      )}
    </div>
  );
};

export default MemoEditPage;
