function FeaturedCollection({
  signatureImage,
  signaturePrice,
  shirtStyle,
  setShirtStyle,
  products,
}) {
  return (
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

          <button>BUY NOW</button>
        </div>

        {products.map((product) => (
          <div className="card" key={product.name}>
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
            <button>BUY NOW</button>
          </div>
        ))}
      </div>
    </section>
  );
}

export default FeaturedCollection;