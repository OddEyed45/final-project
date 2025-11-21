import "../index.css"
import { useParams } from "react-router"
import { useState, useEffect } from "react";
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY);


const DetailedView = () => {
    const { symbol } = useParams()
    const [post, setPost] = useState(null);
    const [likeButtonMsg, setLikeButtonMsg] = useState("Upvote")
    const [comment, setComment] = useState("")

    useEffect(() => {
        const fetchPost = async () => {
            const { data } = await supabase
                .from('posts')
                .select()
                .eq('id', symbol)
                .single();

            setPost(data)
        }
        fetchPost()
    }, [symbol])

    const postComment = async () => {
        if (!comment.trim()) return; // Don't post empty comments

        const { data: { session } } = await supabase.auth.getSession();

        let currentComments = post.comments;

        // Initialize empty comments array if it doesn't exist
        if (!currentComments) {
            currentComments = [];
        }

        // Add new comment with user and timestamp
        const newComment = {
            user: session?.user?.email,
            text: comment,
            timestamp: new Date().toISOString()
        };

        const updatedComments = [...currentComments, newComment];

        await supabase
            .from('posts')
            .update({ comments: updatedComments })
            .eq('id', symbol);

        // Clear the textarea
        setComment("");

        // Refresh post data
        const { data } = await supabase
            .from('posts')
            .select()
            .eq('id', symbol)
            .single();
        setPost(data);
    }

    const likePost = async () => {
        const { data: { session } } = await supabase.auth.getSession();

        let currentLikes = post.likes;

        // Check if likes object exists and has likedUsers array
        if (!currentLikes || !currentLikes.likedUsers) {
            // Initialize empty likes object
            currentLikes = { likedUsers: [] };
        }

        let updatedLikes;
        updatedLikes = [...currentLikes.likedUsers, session?.user?.email];
        setLikeButtonMsg("Upvote");


        await supabase
            .from('posts')
            .update({ likes: { likedUsers: updatedLikes } })
            .eq('id', symbol);

        // Refresh post data
        const { data } = await supabase
            .from('posts')
            .select()
            .eq('id', symbol)
            .single();
        setPost(data);
    }


    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${month}-${day} ${hours}:${minutes}`;
    }

    if (!post) return <div className="main-page"><div>Loading...</div></div>

    const upvoteCount = post.likes?.likedUsers?.length || 0;


    return (
        <div className="main-page">
            <div className="detailed-container">
                <div className="padding-card-container">
                    <h1 style={{ marginBottom: '10px' }}>{post.title}</h1>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', fontSize: '14px', color: '#666' }}>
                        <span>Posted by {post.user}</span>
                        <span>{formatTime(post.created_at)}</span>
                    </div>

                    <img
                        src={post.image}
                        alt={post.title}
                        style={{
                            width: '100%',
                            maxHeight: '500px',
                            objectFit: 'contain',
                            borderRadius: '12px',
                            marginBottom: '20px'
                        }}
                    />

                    <p style={{
                        fontSize: '16px',
                        lineHeight: '1.6',
                        marginBottom: '20px',
                        color: '#333'
                    }}>
                        {post.description}
                    </p>

                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '15px',
                        marginBottom: '30px',
                        paddingBottom: '20px',
                        borderBottom: '2px solid #e0e0e0'
                    }}>
                        <button
                            onClick={likePost}
                            className="dashboard-button"
                            style={{ padding: '10px 20px' }}
                        >
                            ❤️ {likeButtonMsg} ({upvoteCount})
                        </button>
                    </div>

                    <div style={{ marginTop: '30px' }}>
                        <h3 style={{ marginBottom: '15px' }}>Add a Comment</h3>
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Share your thoughts..."
                            style={{
                                width: '100%',
                                minHeight: '100px',
                                padding: '12px',
                                borderRadius: '8px',
                                border: '2px solid #8b6f5b',
                                fontSize: '14px',
                                resize: 'vertical',
                                fontFamily: 'inherit'
                            }}
                        />
                        <button
                            className="dashboard-button"
                            style={{ marginTop: '10px', padding: '10px 20px' }}
                            onClick={postComment}
                        >
                            Post Comment
                        </button>
                    </div>

                    <div style={{ marginTop: '30px' }}>
                        <h3 style={{ marginBottom: '15px' }}>Comments</h3>
                        {post.comments && post.comments.length > 0 ? (
                            post.comments.map((c, index) => (
                                <div key={index} style={{
                                    padding: '15px',
                                    backgroundColor: '#f9f6f2',
                                    borderRadius: '8px',
                                    marginBottom: '10px',
                                    border: '1px solid #e0e0e0'
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                        <strong style={{ color: '#4e3b31' }}>{c.user}</strong>
                                        <span style={{ fontSize: '12px', color: '#666' }}>{formatTime(c.timestamp)}</span>
                                    </div>
                                    <p style={{ margin: 0, color: '#333' }}>{c.text}</p>
                                </div>
                            ))
                        ) : (
                            <p style={{ color: '#666', fontStyle: 'italic' }}>No comments yet. Be the first to comment!</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
export default DetailedView