import { Router } from 'express';
import ProductManager from '../managers/ProductManager.js';
import __dirname from '../utils.js';

const router = Router ();

const productManager = new ProductManager(`${__dirname}/files/products.json`);

router.post('/', async (req, res)=>{ //Crear productos
    const product = req.body;

    if(!product.status) {
        product.status = true;    
    }

    if(!product.status || !product.stock || !product.category
         || !product.title || !product.description || !product.code || !product.price) {
            return res.status(404).send({ error: 'incomplete values'}); 
        }

        const result = await productManager.save(product)
        res.send({status: "Success", result })
});

router.get('/', async (req, res) => {
    let products = await productManager.getProducts();
    const limit = Number(req.query.limit);
    if(limit){
        products = products.slice(0, limit);
    }
    res.send({status: "Success", products })
});

router.get('/:id', async (req, res) => {
    const productId = Number(req.params.id)
    const products = await productManager.getProducts();    
    if(productId <= products.length){
        const product = await productManager.getProductsById(productId);
        res.send({ product })        
    } else {
        res.send({error: 'No existe el producto'});
    }    
});

router.put('/:id', async (req, res) => {
    const productId = req.params.id;
    const updatedProduct = req.body;

    if (!updatedProduct.status) {
        updatedProduct.status = true;
    }

    //Verificamos si existe el producto dado su ID
    const existingProduct = await productManager.getProductsById(productId);
    if (!existingProduct) {
        return res.status(404).send({ error: 'Product not found' });
    }

    
    updatedProduct.id = productId;
    //updatedProduct.id = parseInt(updatedProduct.id, 10);

    const result = await productManager.updateProduct(updatedProduct);
    res.send({ status: "Success", result });
});

// Ruta para eliminar un producto por su ID
router.delete('/:id', async (req, res) => {
    const productId = req.params.id;

    try {
        await productManager.deleteProduct(productId);
        res.send({ status: "Success", message: "Product deleted successfully" });
    } catch (error) {
        res.status(404).send({ error: error.message });
    }
});

//Limit
router.get('/', async (req, res)=>{
    let limit = req.query.limit    
    console.log(limit)
    const element = []    
    const products = await productManager.getProducts();

    for (let index = 0; index < products.length ; index++) {        
        if (index < limit) {            
            const product = products[index];
            element.push(product)
        }
    }
    if (limit > products.length ) {
        return res.send (`Se paso del limite de los objetos guardados!`);        
    }
    return res.send ({element});    

});

export default router;