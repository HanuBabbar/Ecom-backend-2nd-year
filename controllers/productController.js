
exports.getProducts = (req, res) => {
  res.render('pages/products'); // Render the products.ejs file
};

exports.getCart = (req, res) => {
  res.render('pages/cart'); // Render the cart.ejs file
};
