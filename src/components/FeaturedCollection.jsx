import SignatureProduct from "./SignatureProduct.jsx";function FeaturedCollection({
  signatureImage,
  signaturePrice,
  shirtStyle,
  setShirtStyle,
  products,
}) {
  return (
 <div className="products">
  <SignatureProduct
    signatureImage={signatureImage}
    signaturePrice={signaturePrice}
    shirtStyle={shirtStyle}
    setShirtStyle={setShirtStyle}
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
      <button>BUY NOW</button>
    </div>
  ))}
</div>
</section> 
  );
}

export default FeaturedCollection;