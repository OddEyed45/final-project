import { useNavigate } from "react-router-dom";
import "../index.css"

const Card = (props) => {
    const navigate = useNavigate();

    const navigateToSite = () => {
        navigate(`/view/${props.id}`);
    }

    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${month}-${day} ${hours}:${minutes}`;
    }

    const upvoteCount = props.upvotes?.likedUsers?.length || 0;


    return (
        <div className="post-container" onClick={navigateToSite}>
            <div className="padding-card-container">
                <h2>{props.title}</h2>
                <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', marginTop: '10px', fontSize: '14px', color: '#666' }}>
                    <span>❤️ {upvoteCount} upvotes</span>
                    <span>{formatTime(props.time)}</span>
                </div>
            </div>
        </div>
    )
}

export default Card