import { useEffect, useState } from "react";
import "./index.css";
import { createClient } from '@supabase/supabase-js'
import Card from "./components/Card";

const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY);


const App = () => {
  const [posts, setPosts] = useState([]);
  const [sortBy, setSortBy] = useState('created_at');
  const [search, setSearch] = useState('')

  useEffect(() => {

    const fetchPosts = async () => {
      const { data } = await supabase
        .from('posts')
        .select()
        .order('created_at', { ascending: false });

      // set state of posts
      setPosts(data)
    }
    fetchPosts()

  }, [])

  const sortPosts = (e) => {
    setSortBy(e.target.value)
  }

  const getSortedPosts = () => {
    let sortedPosts = [...posts];

    if (search.length > 0) {
      sortedPosts = sortedPosts.filter(post =>
        post.title.toLowerCase().includes(search.toLowerCase()) ||
        post.description.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (sortBy === 'created_at') {
      return sortedPosts.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    } else if (sortBy === 'likes') {
      return sortedPosts.sort((a, b) => {
        const aLikes = a.likes?.likedUsers?.length || 0;
        const bLikes = b.likes?.likedUsers?.length || 0;
        return bLikes - aLikes;
      });
    }
    return sortedPosts;
  }

  return (
    <div className="main-page">
      <div style={{ display: "flex", width: "100%", lexDirection: "row", alignItems: "center", gap: "30px" }}>
        <select
          value={sortBy}
          onChange={sortPosts}
          style={{
            padding: '8px 12px',
            borderRadius: '8px',
            border: '2px solid #8b6f5b',
            backgroundColor: '#f5f1ed',
            color: '#4e3b31',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          <option value="created_at">Newest First</option>
          <option value="likes">Most upvotes</option>
        </select>
        <input placeholder="Search for..." onChange={(e) => setSearch(e.target.value)} />
      </div>
      <br />
      <div className="all-cards">
        {posts.length > 0 ? getSortedPosts().map((post) => (
          <div key={post.id}>
            <Card image={post.image} user={post.user} title={post.title} description={post.description} id={post.id} upvotes={post.likes} time={post.created_at} />
          </div>
        )) : <div>Loading...</div>}
      </div>
    </div>
  )
}

export default App