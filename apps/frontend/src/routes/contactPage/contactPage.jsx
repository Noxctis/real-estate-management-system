import BgVisuals from "../../components/BgVisuals/BgVisuals";
import "./contactPage.scss";

function ContactPage() {
  return (
    <div className="contactPage">
      <div className="textContainer">
        <div className="wrapper">
          <h1 className="title">Contact Us</h1>
          <p>
            Have questions or need assistance? Our team is here to help you with all your real estate needs.
            Fill out the form below or reach us directly at <b>info@carolestates.com</b>.
          </p>
          <form className="contactForm">
            <input type="text" placeholder="Your Name" required />
            <input type="email" placeholder="Your Email" required />
            <textarea placeholder="Your Message" rows={5} required />
            <button type="submit">Send Message</button>
          </form>
          <div className="boxes">
            <div className="box">
              <h1>Phone</h1>
              <h2>+1 234 567 890</h2>
            </div>
            <div className="box">
              <h1>Email</h1>
              <h2>info@carolestates.com</h2>
            </div>
            <div className="box">
              <h1>Office</h1>
              <h2>123 Main St, City, Country</h2>
            </div>
          </div>
        </div>
      </div>
      <BgVisuals />
    </div>
  );
}

export default ContactPage;