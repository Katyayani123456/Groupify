import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { db, auth } from '../firebase';
import { doc, getDoc, collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';

const PostDetail = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      const postRef = doc(db, 'forumPosts', postId);
      const docSnap = await getDoc(postRef);
      if (docSnap.exists()) setPost(docSnap.data());
      setLoading(false);
    };
    fetchPost();

    const commentsRef = collection(db, 'forumPosts', postId, 'comments');
    const q = query(commentsRef, orderBy('createdAt'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setComments(snapshot.docs.map(doc => doc.data()));
    });
    return unsubscribe;
  }, [postId]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (newComment.trim() === '') return;
    const commentsRef = collection(db, 'forumPosts', postId, 'comments');
    await addDoc(commentsRef, {
      text: newComment,
      authorName: auth.currentUser.displayName || auth.currentUser.email,
      createdAt: serverTimestamp(),
    });
    setNewComment('');
  };

  if (loading) return <div className="loading-screen"><h1>Loading Post...</h1></div>;
  if (!post) return <h2>Post not found</h2>;

  return (
    <div className="post-detail-container">
      <h2>{post.title}</h2>
      <p className="post-meta">by {post.authorName} on {new Date(post.createdAt?.toDate()).toLocaleDateString()}</p>
      <div className="post-content">{post.content}</div>

      <div className="comments-section">
        <h3>Comments</h3>
        {comments.map((comment, index) => (
          <div key={index} className="comment">
            <strong>{comment.authorName}:</strong> {comment.text}
          </div>
        ))}
        <form onSubmit={handleAddComment}>
          <input value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="Add a comment..." />
          <button type="submit" className="form-button">Submit</button>
        </form>
      </div>
    </div>
  );
};
export default PostDetail;