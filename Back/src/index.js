const express = require("express");
const server = express();
const axios = require("axios");
const env = require("dotenv");
const enviroment=env.config();
const cors = require("cors");

server.use(cors())
server.listen(process.env.PORT, () =>{
    console.log(`Server funcionando en puerto ${process.env.PORT}`);
});
var cache=[]

server.get("/api/search/:data", /*cache(20),*/(req, res) => {
    const product1 = req.params.data;
    if(!cache[product1]){
    axios.get(`https://api.mercadolibre.com/sites/MLA/search?q=${product1}`)
    .then((product) => {
      const result = product.data.results;
      if (result.length > 0) {
        let products = result.map((product) => {
          return {
            id: product.id,
            title: product.title,
            price: product.price,
            currency_id: product.currency_id,
            available_quantity: product.available_quantity,
            thumbnail: product.thumbnail,
            condition: product.condition,
            permalink : product.permalink 
          };
        });
        cache[product1]=products
        res.status(200).send(products);
      } 
      else {
        throw "Product not found.";
      }
    })
      .catch((err) => {
        res.status(404).send(err);
      });
    }
    else{
      res.status(200).send(cache[product1])
    }
  });
  
module.exports = server;