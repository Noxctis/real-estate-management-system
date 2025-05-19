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
              <img src="/agent1.jpg" alt="Agent" />
              <h2>Sid Andre P. Bordario</h2>
              <p>Senior Citizen - 10+ years experience</p>
              <span>Email: 23101361@usc.edu.ph Phone #123456789</span>
            </div>
            <div className="agentCard">
              <img src="/agent2.jpg" alt="Agent" />
              <h2>Cyril John Christian A. Calo</h2>
              <p>Property Specialist - 8+ years experience</p>
              <span>Email: 2310118@usc.edu.ph Phone #123456789</span>
            </div>
            <div className="agentCard">
              <img src="/agent3.jpg" alt="Agent" />
              <h2>Chrys Sean T. Sevilla</h2>
              <p>Rental Expert - 5+ years experience</p>
              <span>Email: 21101819@usc.edu.ph</span>
            </div>
          </div>
        </div>
      </div>
      <BgVisuals />
    </div>
  );
}

export default AgentsPage;