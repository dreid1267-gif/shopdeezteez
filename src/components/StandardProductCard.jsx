import { useState } from "react";

function StandardProductCard({ product, addProductToCart }) {
  const [size, setSize] = useState("M");
  const [color, setColor] = useState("Black");

  const handleAddToCart = () => {
    addProductToCart({
      ...product,
      size,
      color,
    });
  };

  return (
    <div className="card">
      {product.image && (
        <img
          className="product-image"
          src={product.image}
          alt={product.name}
        />
      )}

      <h3>{product.name}</h3>
      <p>{product.description}</p>
      <span>{product.price}</span>

      <div className="product-options">
        <div className="option-group">
          <label>SIZE</label>
          <select
            value={size}
            onChange={(event) => setSize(event.target.value)}
          >
            <option value="S">Small</option>
            <option value="M">Medium</option>
            <option value="L">Large</option>
            <option value="XL">XL</option>
            <option value="2XL">2XL</option>
            <option value="3XL">3XL</option>
          </select>
        </div>

        <div className="option-group">
          <label>COLOR</label>
          <select
            value={color}
            onChange={(event) => setColor(event.target.value)}
          >
            <option value="Black">Black</option>
            <option value="White">White</option>
            <option value="Cream">Cream</option>
            <option value="Heather Gray">Heather Gray</option>
          </select>
        </div>
      </div>

      <button onClick={handleAddToCart}>BUY NOW</button>
    </div>
  );
}

export default StandardProductCard;