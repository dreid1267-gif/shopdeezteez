function SignatureProduct({
  signatureImage,
  signaturePrice,
  shirtStyle,
  setShirtStyle,
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

      <span className="product-price">{signaturePrice}</span>

      <button>ADD TO CART</button>
    </div>
  );
}

export default SignatureProduct;