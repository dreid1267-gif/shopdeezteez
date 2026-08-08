function Newsletter() {
  return (
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
  );
}

export default Newsletter;