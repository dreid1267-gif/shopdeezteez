function Navbar({ cartCount, onCartClick }) {
  return (
    <nav className="navbar">
      <h2 className="logo">DEEZ TEEZ</h2>

      <ul>
        
        <li>
          <a href="#home">Home</a>
        </li>

        <li>
          <a href="#shop">Shop</a>
        </li>

        <li>About</li>
        <li>Contact</li>
      </ul>
      <button className="cart-count" onClick={onCartClick}>
  CART ({cartCount})
</button>
    </nav>
  );
}

export default Navbar;