import { useState, useEffect } from 'react';
import { MessageCircle, ThumbsUp, Eye, Search, PlusCircle, User, ArrowLeft, Send, X, Loader2 } from 'lucide-react';
import { DualText, useLanguage, useAuth } from '../App';
import axios from 'axios';

export const Forum = () => {
    const { lang } = useLanguage();
    const { user } = useAuth();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedPost, setSelectedPost] = useState(null);
    const [showNewPostModal, setShowNewPostModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const [newPostTitle, setNewPostTitle] = useState('');
    const [newPostContent, setNewPostContent] = useState('');
    const [newComment, setNewComment] = useState('');
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/forum');
            setPosts(res.data);
        } catch (err) {
            console.error("Error fetching posts:", err);
        } finally {
            setLoading(false);
        }
    };

    const filteredPosts = posts.filter(post =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.content.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleAddPost = async (e) => {
        e.preventDefault();
        if (!user) return alert("Please login to post a question");
        if (!newPostTitle.trim() || !newPostContent.trim()) return;

        setActionLoading(true);
        try {
            const token = localStorage.getItem('krishi_token');
            const res = await axios.post('http://localhost:5000/api/forum', {
                title: newPostTitle,
                content: newPostContent,
                author: user.username,
                role: user.role,
                tags: ["Question"]
            }, {
                headers: { 'x-auth-token': token }
            });

            setPosts([res.data, ...posts]);
            setNewPostTitle('');
            setNewPostContent('');
            setShowNewPostModal(false);
        } catch (err) {
            alert("Error posting discussion: " + (err.response?.data?.message || err.message));
        } finally {
            setActionLoading(false);
        }
    };

    const handleAddComment = async (e) => {
        e.preventDefault();
        if (!user) return alert("Please login to comment");
        if (!newComment.trim()) return;

        setActionLoading(true);
        try {
            const token = localStorage.getItem('krishi_token');
            const res = await axios.post(`http://localhost:5000/api/forum/${selectedPost._id}/comment`, {
                author: user.username,
                content: newComment
            }, {
                headers: { 'x-auth-token': token }
            });

            // Update local state
            const updatedPost = res.data;
            setSelectedPost(updatedPost);
            setPosts(posts.map(p => p._id === updatedPost._id ? updatedPost : p));
            setNewComment('');
        } catch (err) {
            alert("Error adding comment: " + (err.response?.data?.message || err.message));
        } finally {
            setActionLoading(false);
        }
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
                <Loader2 size={48} className="animate-spin" color="#10b981" />
            </div>
        );
    }

    if (selectedPost) {
        return (
            <div className="animate-fade-in" style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
                <button
                    onClick={() => setSelectedPost(null)}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', marginBottom: '2rem', fontSize: '1rem' }}
                >
                    <ArrowLeft size={18} /> Back to Forum
                </button>

                <div className="glass-panel" style={{ padding: '2rem', textAlign: 'left', marginBottom: '2rem' }}>
                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><User size={20} /></div>
                        <div>
                            <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{selectedPost.author}</div>
                            <div style={{ fontSize: '0.9rem', color: '#10b981' }}>{selectedPost.role}</div>
                        </div>
                    </div>
                    <h2 style={{ fontSize: '1.75rem', marginBottom: '1rem' }}>{selectedPost.title}</h2>
                    <p style={{ color: '#e2e8f0', fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '1.5rem' }}>{selectedPost.content}</p>
                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
                        {selectedPost.tags?.map(tag => (
                            <span key={tag} style={{ padding: '0.2rem 0.6rem', background: 'rgba(59, 130, 246, 0.2)', color: '#60a5fa', borderRadius: '12px', fontSize: '0.8rem' }}>{tag}</span>
                        ))}
                    </div>
                </div>

                <h3 style={{ textAlign: 'left', marginBottom: '1.5rem' }}>Comments ({selectedPost.comments?.length || 0})</h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                    {selectedPost.comments?.map(comment => (
                        <div key={comment._id} className="glass-panel" style={{ padding: '1.25rem', textAlign: 'left', background: 'rgba(255,255,255,0.03)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                <span style={{ fontWeight: 'bold', color: '#10b981' }}>{comment.author}</span>
                                <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{new Date(comment.createdAt).toLocaleDateString()}</span>
                            </div>
                            <p style={{ margin: 0, color: '#f8fafc', lineHeight: '1.5' }}>{comment.content}</p>
                        </div>
                    ))}
                    {(!selectedPost.comments || selectedPost.comments.length === 0) && (
                        <p style={{ color: '#94a3b8', textAlign: 'left' }}>No comments yet. Be the first to reply!</p>
                    )}
                </div>

                <form onSubmit={handleAddComment} style={{ display: 'flex', gap: '0.75rem' }}>
                    <input
                        type="text"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder={user ? "Write a comment..." : "Login to write a comment"}
                        disabled={!user || actionLoading}
                        style={{ flex: 1, padding: '1rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', borderRadius: '12px', color: 'white', fontSize: '1rem' }}
                    />
                    <button type="submit" disabled={!user || actionLoading} className="btn-primary" style={{ padding: '0 1.5rem' }}>
                        {actionLoading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
                    </button>
                </form>
            </div>
        );
    }

    return (
        <div className="animate-fade-in" style={{ padding: '2rem', width:"50%" , height:"100vh", margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div style={{ textAlign: 'left' }}>
                    <h2 style={{ fontSize: '2rem', margin: 0 }}><DualText english="Community Forum" id="forum_title" /></h2>
                </div>
                <button onClick={() => user ? setShowNewPostModal(true) : alert("Please login to post")} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <PlusCircle size={20} /> <DualText english="New Question" id="forum_new_q" style={{ alignItems: 'center' }} />
                </button>
            </div>

            <div style={{ marginBottom: '2rem', position: 'relative' }}>
                <Search size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input
                    type="text"
                    placeholder="Search discussions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ width: '100%', padding: '1rem 1rem 1rem 3rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', borderRadius: '12px', color: 'white', fontSize: '1rem', outline: 'none' }}
                />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {filteredPosts.map(post => (
                    <div
                        key={post._id}
                        className="glass-panel"
                        style={{ padding: '1.5rem', transition: 'transform 0.2s', cursor: 'pointer', textAlign: 'left' }}
                        onClick={() => setSelectedPost(post)}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><User size={16} /></div>
                                <div>
                                    <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>{post.author}</div>
                                    <div style={{ fontSize: '0.8rem', color: '#10b981' }}>{post.role}</div>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                {post.tags?.map(tag => (
                                    <span key={tag} style={{ fontSize: '0.75rem', padding: '0.2rem 0.6rem', borderRadius: '12px', background: 'rgba(59, 130, 246, 0.2)', color: '#60a5fa', border: '1px solid rgba(59, 130, 246, 0.3)' }}>{tag}</span>
                                ))}
                            </div>
                        </div>

                        <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.25rem' }}>{post.title}</h3>

                        <div style={{ display: 'flex', gap: '1.5rem', color: '#94a3b8', fontSize: '0.9rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                <MessageCircle size={16} /> {post.comments?.length || 0} comments
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><ThumbsUp size={16} /> {post.likes}</div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Eye size={16} /> {post.views}</div>
                        </div>
                    </div>
                ))}
                {filteredPosts.length === 0 && !loading && (
                    <p style={{ color: '#94a3b8', marginTop: '2rem' }}>No discussions found. Be the first to start one!</p>
                )}
            </div>

            {showNewPostModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
                    <div className="glass-panel" style={{ maxWidth: '600px', width: '100%', padding: '2rem', position: 'relative', textAlign: 'left' }}>
                        <button onClick={() => setShowNewPostModal(false)} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}><X size={24} /></button>
                        <h2 style={{ marginTop: 0 }}>Ask the Community</h2>
                        <form onSubmit={handleAddPost}>
                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#94a3b8' }}>Question Title</label>
                                <input
                                    type="text"
                                    value={newPostTitle}
                                    onChange={(e) => setNewPostTitle(e.target.value)}
                                    placeholder="e.g. How to prevent root rot in rice?"
                                    style={{ width: '100%', padding: '0.75rem', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)', borderRadius: '8px', color: 'white' }}
                                />
                            </div>
                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#94a3b8' }}>Details</label>
                                <textarea
                                    rows="5"
                                    value={newPostContent}
                                    onChange={(e) => setNewPostContent(e.target.value)}
                                    placeholder="Describe your problem in detail..."
                                    style={{ width: '100%', padding: '0.75rem', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)', borderRadius: '8px', color: 'white', resize: 'none' }}
                                />
                            </div>
                            <button type="submit" disabled={actionLoading} className="btn-primary" style={{ width: '100%', padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                                {actionLoading ? <Loader2 size={20} className="animate-spin" /> : 'Post Question'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
