import Footer from "./components/Footer.jsx";
import Navbar from "./components/Navbar.jsx";
import Hero from "./components/Hero.jsx";
import FeaturedCollection from "./components/FeaturedCollection.jsx";
import About from "./components/About.jsx";
import Benefits from "./components/Benefits.jsx";
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

<Benefits />

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