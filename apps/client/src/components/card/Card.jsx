import { Link } from "react-router-dom";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import apiRequest from "../../lib/apiRequest";
import "./card.scss";

function Card({ item }) {
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [saved, setSaved] = useState(item.isSaved || false);
  const isOwner = currentUser && currentUser.id === item.userId;
  const [loading, setLoading] = useState(false);

  const handleSave = async (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (!currentUser) {
      navigate("/login");
      return;
    }
    if (isOwner) return;
    setSaved((prev) => !prev); // Optimistic update
    try {
      await apiRequest.post(`/users/save`, { postId: item.id });
    } catch (err) {
      setSaved((prev) => !prev); // Revert if error
    }
  };

  const handleChat = async (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (!currentUser) {
      navigate("/login");
      return;
    }
    if (isOwner) return;
    try {
      const res = await apiRequest.post(`/chats`, { receiverId: item.userId });
      navigate(`/profile?tab=chats&chatId=${res.data.id}`);
    } catch (err) {
      // Optionally show error
    }
  };

  return (
    <div className="card">
      <Link to={`/${item.id}`} className="imageContainer">
        <img src={item.images[0]} alt="" />
      </Link>
      <div className="textContainer">
        <h2 className="title">
          <Link to={`/${item.id}`}>{item.title}</Link>
        </h2>
        <p className="address">
          <img src="/pin.png" alt="" />
          <span>{item.address}</span>
        </p>
        <p className="price">$ {item.price}</p>
        <div className="bottom">
          <div className="features">
            <div className="feature">
              <img src="/bed.png" alt="" />
              <span>{item.bedroom} bedroom</span>
            </div>
            <div className="feature">
              <img src="/bath.png" alt="" />
              <span>{item.bathroom} bathroom</span>
            </div>
          </div>
          <div className="icons">
            <div
              className="icon"
              title={saved ? "Unsave" : "Save"}
              onClick={isOwner ? undefined : handleSave}
              style={{ opacity: isOwner ? 0.5 : 1, cursor: isOwner ? "not-allowed" : "pointer" }}
            >
              <img
                src={saved ? "/save-filled.png" : "/save.png"}
                alt="save"
                style={{ filter: saved ? "drop-shadow(0 0 2px #fece51)" : undefined }}
              />
            </div>
            <div
              className="icon"
              title="Chat with owner"
              onClick={isOwner ? undefined : handleChat}
              style={{ opacity: isOwner ? 0.5 : 1, cursor: isOwner ? "not-allowed" : "pointer" }}
            >
              <img src="/chat.png" alt="chat" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Card;
