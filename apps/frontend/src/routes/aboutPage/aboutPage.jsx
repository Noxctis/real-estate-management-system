import BgVisuals from "../../components/BgVisuals/BgVisuals";
import "./aboutPage.scss";

function About() {
  return (
    <div className="aboutPage">
      <div className="textContainer">
        <div className="wrapper">
          <h1 className="title">About CarolEstates</h1>
          <p>
            CarolEstates is dedicated to helping you find your perfect property. 
            With over 16 years of experience, our team of expert agents provides 
            personalized service and deep knowledge of the real estate market.
          </p>
          <p>
            We pride ourselves on our integrity, professionalism, and commitment 
            to making your property journey smooth and successful. Whether you’re 
            buying, selling, or renting, we’re here to guide you every step of the way.
          </p>
          <div className="boxes">
            <div className="box">
              <h1>16+</h1>
              <h2>Years of Experience</h2>
            </div>
            <div className="box">
              <h1>200</h1>
              <h2>Awards Gained</h2>
            </div>
            <div className="box">
              <h1>2000+</h1>
              <h2>Properties Ready</h2>
            </div>
          </div>
        </div>
      </div>
      <BgVisuals />
    </div>
  );
}

export default About;