import Footer from "./components/Footer.jsx";
import Navbar from "./components/Navbar.jsx";
import Hero from "./components/Hero.jsx";
import FeaturedCollection from "./components/FeaturedCollection.jsx";
import About from "./components/About.jsx";
import Benefits from "./components/Benefits.jsx";
import Newsletter from "./components/Newsletter.jsx";
import { useState } from "react";
import "./App.css";

function App() {
const [shirtStyle, setShirtStyle] = useState("front-only");
const [shirtSize, setShirtSize] = useState("M");
const [shirtColor, setShirtColor] = useState("Black");
 const [cart, setCart] = useState([]);
 const [isCartOpen, setIsCartOpen] = useState(false);
 
 const checkoutSuccess =
  new URLSearchParams(window.location.search).get("checkout") === "success";
 const addSignatureToCart = () => {
  const item = {
    name: "BLESSED & HIGHLY FLAVORED!!!",
    style: shirtStyle,
    size: shirtSize,
    color: shirtColor,
    price: signaturePrice,
    image: signatureImage,
  };

  setCart([...cart, item]);
};

const addProductToCart = (product) => {
  const item = {
    name: product.name,
    style: "standard",
    size: product.size,
    color: product.color,
    price: product.price,
    image: product.image,
  };

  setCart([...cart, item]);
};

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
     <Navbar
  cartCount={cart.length}
  onCartClick={() => setIsCartOpen(!isCartOpen)}
/>
{checkoutSuccess && (
  <div className="checkout-success">
    <h2>THANK YOU FOR YOUR ORDER!</h2>
    <p>Your payment was successful.</p>
    <p>We're getting your DEEZ TEEZ order ready.</p>
    <strong>Wear Your Motivation.</strong>
  </div>
)}

{isCartOpen && (
 <div className="cart-panel">
  <button
    className="cart-close"
    onClick={() => setIsCartOpen(false)}
  >
    ×
  </button>

  <h2>Your Cart</h2>

    {cart.length === 0 ? (
      <p>Your cart is empty.</p>
    ) : (
      <>
  {cart.map((item, index) => (
        <div className="cart-item" key={`${item.name}-${index}`}>
          <img
            src={item.image}
            alt={item.name}
            className="cart-item-image"
          />

          <div>
            <h3>{item.name}</h3>
            <p>Style: {item.style}</p>
            <p>Size: {item.size}</p>
            <p>Color: {item.color}</p>
            <p>Price: {item.price}</p>
            <button
  className="remove-item"
  onClick={() =>
    setCart(cart.filter((_, itemIndex) => itemIndex !== index))
  }
>
  REMOVE
</button>
          </div>
        </div>
      ))}

  <div className="cart-summary">
    <h3>
      Total: $
      {cart
        .reduce(
          (total, item) =>
            total + Number(item.price.replace("$", "")),
          0
        )
        .toFixed(2)}
    </h3>

   <button
  className="checkout-button"
  onClick={async () => {
    try {
      const response = await fetch(
        "http://localhost:4242/create-checkout-session",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ cart }),
        }
      );

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("Checkout error:", error);
    }
  }}
>
  CHECKOUT
</button> 
  </div>
</>
)}
  </div>
)}

     <Hero /> 

  <FeaturedCollection
  signatureImage={signatureImage}
  signaturePrice={signaturePrice}
  shirtStyle={shirtStyle}
  setShirtStyle={setShirtStyle}
  shirtSize={shirtSize}
  setShirtSize={setShirtSize}
  shirtColor={shirtColor}
  setShirtColor={setShirtColor}
  addSignatureToCart={addSignatureToCart}
  addProductToCart={addProductToCart}
  products={products}
/>  
 <About />     

<Benefits />

<Newsletter />

<Footer />
    </div>
  );
}

export default App;