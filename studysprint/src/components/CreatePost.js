import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const CreatePost = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const navigate = useNavigate();

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!title || !content) return;

    const postsRef = collection(db, 'forumPosts');
    await addDoc(postsRef, {
      title,
      content,
      authorName: auth.currentUser.displayName || auth.currentUser.email,
      createdAt: serverTimestamp(),
    });
    navigate('/forum');
  };

  return (
    <div className="create-post-container">
      <h2>Create a New Post</h2>
      <form onSubmit={handleCreatePost}>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Post Title" />
        <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="What's on your mind?" />
        <button type="submit" className="form-button">Post</button>
      </form>
    </div>
  );
};

export default CreatePost;