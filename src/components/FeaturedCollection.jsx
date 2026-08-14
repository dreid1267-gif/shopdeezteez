import SignatureProduct from "./SignatureProduct.jsx";

function FeaturedCollection({
  signatureImage,
  signaturePrice,
  shirtStyle,
  setShirtStyle,
  shirtSize,
  setShirtSize,
  shirtColor,
  setShirtColor,
  addSignatureToCart,
  addProductToCart,
  products,
}) {
  return (
    <section className="collection" id="shop">
      <h2>Featured Collection</h2>

      <div className="products">
        <SignatureProduct
          signatureImage={signatureImage}
          signaturePrice={signaturePrice}
          shirtStyle={shirtStyle}
          setShirtStyle={setShirtStyle}
          shirtSize={shirtSize}
          setShirtSize={setShirtSize}
          shirtColor={shirtColor}
          setShirtColor={setShirtColor}
          addSignatureToCart={addSignatureToCart}
        />

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
            <button onClick={() => addProductToCart(product)}>
  BUY NOW
</button>
          </div>
        ))}
      </div>
    </section>
  );
}

export default FeaturedCollection;