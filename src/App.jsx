import Footer from "./components/Footer.jsx";
import Navbar from "./components/Navbar.jsx";
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

      <section className="hero">
        <h1>DEEZ TEEZ</h1>
        <h2>Wear Your Motivation.</h2>

        <p>
          Premium motivational apparel designed to inspire greatness,
          confidence, and success.
        </p>

        <a className="shop-button" href="#shop">
  SHOP NOW
</a>
      </section>

      <section className="collection" id="shop">
        <h2>Featured Collection</h2>

        <div className="products">
<div className="card signature-card">
  <img
    className="product-image"
    src={signatureImage}
    alt="Blessed and Highly Flavored Deez Teez shirt"
  />

  <p className="product-badge">SIGNATURE COLLECTION</p>

  <h3>BLESSED &amp; HIGHLY FLAVORED!!!</h3>

  <p className="product-description">
    Premium motivational streetwear created for those who were made to stand out.
  </p>

  <div className="style-options">
    <label>
      <input
        type="radio"
        name="shirtStyle"
        value="front-only"
        checked={shirtStyle === "front-only"}
        onChange={(event) => setShirtStyle(event.target.value)}
      />
      Front Only Design — $29.99
    </label>

    <label>
      <input
        type="radio"
        name="shirtStyle"
        value="front-back"
        checked={shirtStyle === "front-back"}
        onChange={(event) => setShirtStyle(event.target.value)}
      />
      Front + Back Design — $34.99
    </label>
  </div>

  <span className="product-price">{signaturePrice}</span>

  <button>BUY NOW</button>
</div>

{products.map((product) => (
          
  <div className="card" key={product.name}>
    {product.image && (
      <img
        className="product-image"
        src={product.image}
        alt={`${product.name} Deez Teez shirt`}
      />
    )}

    <h3>{product.name}</h3>
    <p>{product.description}</p>
    <span>{product.price}</span>
    <button>BUY NOW</button>
  </div>
))}
        </div>
      </section>
      <section className="about">
  <p className="about-label">THE DEEZ TEEZ STORY</p>

  <h2>MORE THAN APPAREL. IT’S A MOVEMENT.</h2>

  <p>
    Deez Teez creates premium motivational apparel for people who choose
    confidence, purpose, and greatness. Every design is made to inspire you
    and everyone around you.
  </p>

  <p>
    We believe what you wear can remind you who you are, where you are going,
    and what you are capable of becoming.
  </p>
</section>

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