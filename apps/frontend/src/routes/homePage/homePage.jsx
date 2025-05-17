import { useContext } from "react";
import SearchBar from "../../components/searchBar/SearchBar";
import BgVisuals from "../../components/BgVisuals/BgVisuals";
import "./homePage.scss";
import { AuthContext } from "../../context/AuthContext";

function HomePage() {

  const {currentUser} = useContext(AuthContext)

  return (
    <div className="homePage">
      <div className="textContainer">
        <div className="wrapper">
          <h1 className="title">Discover Your Perfect Property: Homes, Condos, and More Await!</h1>
          <p>
            Explore our extensive listings of quality real estate in prime locations. 
            Whether you're looking to buy or rent, our dedicated agents are here to 
            guide you every step of the way. 
            Start your search today and unlock the door to your ideal property!
          </p>
          <SearchBar />
          <div className="boxes">
            <div className="box">
              <h1>16+</h1>
              <h2>Years of Experience</h2>
            </div>
            <div className="box">
              <h1>200</h1>
              <h2>Award Gained</h2>
            </div>
            <div className="box">
              <h1>2000+</h1>
              <h2>Property Ready</h2>
            </div>
          </div>
        </div>
      </div>
      <BgVisuals />
    </div>
  );
}

export default HomePage;
