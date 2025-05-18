import BgVisuals from "../../components/BgVisuals/BgVisuals";
import "./agentsPage.scss";

function AgentsPage() {
  return (
    <div className="agentsPage">
      <div className="textContainer">
        <div className="wrapper">
          <h1 className="title">Meet Our Agents</h1>
          <p>
            Our experienced agents are dedicated to helping you find the perfect property. 
            Get to know the professionals who make CarolEstates your trusted real estate partner.
          </p>
          <div className="agentsList">
            <div className="agentCard">
              <img src="/noavatar.jpg" alt="Agent" />
              <h2>Jane Doe</h2>
              <p>Senior Agent - 10+ years experience</p>
              <span>Email: jane@carolestates.com</span>
            </div>
            <div className="agentCard">
              <img src="/noavatar.jpg" alt="Agent" />
              <h2>John Smith</h2>
              <p>Property Specialist - 8+ years experience</p>
              <span>Email: john@carolestates.com</span>
            </div>
            <div className="agentCard">
              <img src="/noavatar.jpg" alt="Agent" />
              <h2>Emily Clark</h2>
              <p>Rental Expert - 5+ years experience</p>
              <span>Email: emily@carolestates.com</span>
            </div>
          </div>
        </div>
      </div>
      <BgVisuals />
    </div>
  );
}

export default AgentsPage;