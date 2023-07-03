import { Router } from 'express';
import CartManager from '../managers/CartManager.js';
import __dirname from '../utils.js';

const router = Router ();

const cartManager = new CartManager(`${__dirname}/files/cart.json`);


router.post('/', async (req, res) => {
    const cart = req.body;
    const result = await cartManager.save(cart);
    res.send({ status: "Success", result });
});

router.post('/:cid/products/:pid', async (req, res) => {
    const cid = req.params.cid;
    const pid = req.params.pid;
    
    const result = await cartManager.saveProduct(cid, pid);    
    res.send({ status: "Success", result });
});


router.get('/:id', async(req, res) => {
    const cartId = Number(req.params.id);
    const cart = await cartManager.getCartsById(cartId);
    if(!cart) {
        return res.status(404).send({ error: 'cart not found'});
    }
    res.send({ status: 'success', cart });
});

export default router;