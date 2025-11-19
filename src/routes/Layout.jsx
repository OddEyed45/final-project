import { Outlet, Link } from "react-router"
import '../index.css'
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY);


const LeftSide = () => {
    const [session, setSession] = useState(null);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
        });

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        return () => subscription.unsubscribe();
    }, [])

    const handleLogout = async () => {
        await supabase.auth.signOut();
        setSession(null);
        window.location = "/"
    };

    return (<>
        <div className="leftside">
            <h1>Louvre-stagram</h1>
            <Link to="/" className="dashboard-button">
                🏠 Home Gallery
            </Link>
            <Link to="/create" className="dashboard-button">
                🎨 Create Some Art
            </Link>
            <Link to="/" className="dashboard-button">
                🏛️ View Museum Posts
            </Link>
            {(session) ?
                <button className="dashboard-button" onClick={handleLogout}>
                    Sign Out
                </button>
                :
                <Link to="/login" className="dashboard-button">Login</Link>
            }
        </div>
    </>)
}

function Layout() {
    return (
        <div className="app-container">
            <LeftSide />
            <div className="main-content">
                <Outlet />
            </div>
        </div>
    )
}

export default Layout