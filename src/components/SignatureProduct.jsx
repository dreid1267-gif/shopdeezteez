function SignatureProduct({
  signatureImage,
  signaturePrice,
  shirtStyle,
  setShirtStyle,
  shirtSize,
  setShirtSize,
  shirtColor,
  setShirtColor,
}) {
  return (
    <div className="card signature-card">
      <img
        className="product-image"
        src={signatureImage}
        alt="Blessed and Highly Flavored Deez Teez shirt"
      />

      <p className="product-badge">SIGNATURE COLLECTION</p>

      <h3>BLESSED &amp; HIGHLY FLAVORED!!!</h3>

      <p className="product-description">
        Premium motivational streetwear created for those who were made to
        stand out.
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
      <div className="product-options">
  <div className="option-group">
    <label htmlFor="shirtSize">SIZE</label>

    <select
      id="shirtSize"
      value={shirtSize}
      onChange={(event) => setShirtSize(event.target.value)}
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
    <label htmlFor="shirtColor">COLOR</label>

    <select
      id="shirtColor"
      value={shirtColor}
      onChange={(event) => setShirtColor(event.target.value)}
    >
      <option value="Black">Black</option>
      <option value="White">White</option>
      <option value="Cream">Cream</option>
      <option value="Heather Gray">Heather Gray</option>
    </select>
  </div>
</div>

      <span className="product-price">{signaturePrice}</span>

      <button>ADD TO CART</button>
    </div>
  );
}

export default SignatureProduct;