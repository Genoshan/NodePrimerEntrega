
import express from "express"; //importamos el modulo instalado en node modules
import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';
import __dirname from "./utils.js";

const app = express();

//Config Params
app.use(express.json());
app.use( express.urlencoded( {extended:true} )); //para que el servidor pueda interpretar todas las querys

//app.use(express.static('./src/public'))
app.use(express.static((`${__dirname}/public`)));

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

app.listen(8080, ()=> console.log("Listening on 8080"));