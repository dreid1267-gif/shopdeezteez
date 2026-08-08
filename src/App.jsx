import Footer from "./components/Footer.jsx";
import Navbar from "./components/Navbar.jsx";
import Hero from "./components/Hero.jsx";
import FeaturedCollection from "./components/FeaturedCollection.jsx";
import About from "./components/About.jsx";
import { useState } from "react";
import "./App.css";

function App() {
  const [shirtStyle, setShirtStyle] = useState("front-only");

  const signatureImage =
    shirtStyle === "front-only"
      ? "/images/blessed-front-only.png"
      : "/images/blessed-front-back.png";

  const signaturePrice =
    shirtStyle === "front-only" ? "$29.99" : "$34.99";

const products = [
  {
    name: "RISE ABOVE",
    description: "Push beyond limits. Become unstoppable.",
    price: "$29.99",
    image: "/images/rise-above.png",
  },
  {
    name: "NO EXCUSES",
    description: "Discipline creates greatness.",
    price: "$29.99",
    image: "/images/no-excuses.png",
  },
  {
    name: "LEVEL UP",
    description: "Build the future you believe in.",
    price: "$29.99",
    image: "/images/level-up.png",
  },
];


  

  return (
    <div className="app" id="home">
     <Navbar />

     <Hero /> 

     <FeaturedCollection
  signatureImage={signatureImage}
  signaturePrice={signaturePrice}
  shirtStyle={shirtStyle}
  setShirtStyle={setShirtStyle}
  products={products}
/> 
 <About />     

<section className="benefits">
  <p className="benefits-label">WHY CHOOSE DEEZ TEEZ?</p>

  <h2>BUILT TO INSPIRE. MADE TO LAST.</h2>

  <div className="benefits-grid">
    <div className="benefit-card">
      <h3>PREMIUM QUALITY</h3>
      <p>Comfortable materials selected for style, durability, and everyday wear.</p>
    </div>

    <div className="benefit-card">
      <h3>BOLD DESIGNS</h3>
      <p>Motivational apparel created to stand out and make a statement.</p>
    </div>

    <div className="benefit-card">
      <h3>MADE WITH PURPOSE</h3>
      <p>Every design is created to encourage confidence, discipline, and greatness.</p>
    </div>

    <div className="benefit-card">
      <h3>FAST SHIPPING</h3>
      <p>Reliable fulfillment and delivery through our trusted production partners.</p>
    </div>
  </div>
</section>

<section className="newsletter">
  <p className="newsletter-label">JOIN THE MOVEMENT</p>

  <h2>WEAR YOUR MOTIVATION.</h2>

  <p className="newsletter-text">
    Sign up for new drops, special offers, and motivation delivered straight
    to your inbox.
  </p>

  <form className="newsletter-form">
    <input
      type="email"
      placeholder="Enter your email address"
      aria-label="Email address"
    />

    <button type="submit">SIGN ME UP</button>
  </form>
</section>

<Footer />
    </div>
  );
}

export default App;