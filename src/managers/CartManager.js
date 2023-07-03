import { promises as fs } from "fs";
import __dirname from '../utils.js';
export default class CartManager {
    constructor(path) {
        this.products = [];
        this.path = path;        
    }

    async save(cart) {
        // Traigo los carritos actuales
        const currentcarts = await this.getCarts();

        if (currentcarts.length === 0) {
            cart.id = 1;
        } else {
            cart.id = currentcarts[currentcarts.length - 1].id + 1;
        }
        //Guardo array de productos
        cart.products = [];

        currentcarts.push(cart);

        try {
            await this.savecartsToFile(currentcarts);
        } catch (error) {
            console.error(`Error writing to file: ${this.path} - ${error.message}`);
        }

        return cart;
    }

    async saveProduct(cid, pid) {
        const currentcarts = await this.getCarts();
        const cartIndex = currentcarts.findIndex((cart) => cart.id === parseInt(cid));

        if (cartIndex !== -1) {
            const cart = currentcarts[cartIndex];
            const productIndex = cart.products.findIndex((product) => product.product === pid);
            
    
            if (productIndex !== -1) {
                // Si el producto ya existe en el carrito, aumentar la cantidad en 1
                cart.products[productIndex].quantity++;
            } else {
                // Si el producto no existe en el carrito, agregarlo con cantidad 1
                cart.products.push({ product: pid, quantity: 1 });
            }
    
            try {
                await this.savecartsToFile(currentcarts);
            } catch (error) {
                console.error(`Error writing to file: ${this.path} - ${error.message}`);
            }
    
            return currentcarts[cartIndex];
        } else {
            throw new Error('Cart not found');
        }
    }
    
    
    

    savecartsToFile = async (products) => {
        await fs.writeFile(this.path, JSON.stringify(products, null, "\t"), "utf-8");
    };

    getCartsById = async (id) => {
        const carts = await this.getCarts(); // Esperar a que se resuelva la promesa
        const numericId = parseInt(id); // Convertir el ID a número        
        return carts.find((product) => product.id === numericId);
    };


    getCarts = async () => {
        let cartsFromFile = [];
        try {
            const fileContent = await fs.readFile(this.path, "utf-8");
            cartsFromFile = JSON.parse(fileContent);
        } catch (error) {
            console.error(`Error reading file: ${this.path} - ${error.message}`);
        }
        return cartsFromFile;
    }   

}