import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../firebase';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';

const ForumPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      const postsRef = collection(db, 'forumPosts');
      const q = query(postsRef, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      setPosts(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    };
    fetchPosts();
  }, []);

  if (loading) return <div className="loading-screen"><h1>Loading Forum...</h1></div>;

  return (
    <div className="forum-container">
      <div className="forum-header">
        <h2>Community Forum</h2>
        <Link to="/create-post" className="form-button">Create New Post</Link>
      </div>
      <div className="post-list">
        {posts.map(post => (
          <Link key={post.id} to={`/post/${post.id}`} className="post-summary">
            <h3>{post.title}</h3>
            <p>by {post.authorName} on {new Date(post.createdAt?.toDate()).toLocaleDateString()}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ForumPage;