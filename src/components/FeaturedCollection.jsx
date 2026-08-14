import SignatureProduct from "./SignatureProduct.jsx";
import StandardProductCard from "./StandardProductCard.jsx";
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
  <StandardProductCard
    key={product.name}
    product={product}
    addProductToCart={addProductToCart}
  />
))} 
      </div>
    </section>
  );
}

export default FeaturedCollection;