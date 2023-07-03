import { promises as fs } from "fs";
import __dirname from '../utils.js';
export default class ProductManager {    
    constructor(path) {
        this.products = [];
        this.path = path;        
    }

    async save(product) {
        // Traigo los productos actuales
        const currentProducts = await this.getProducts();

        if (currentProducts.length === 0) {
            product.id = 1;
        } else {
            product.id = currentProducts[currentProducts.length - 1].id + 1;
        }

        currentProducts.push(product);

        try {
            await this.saveProductsToFile(currentProducts);
        } catch (error) {
            console.error(`Error writing to file: ${this.path} - ${error.message}`);
        }

        return product;
    }    


    saveProductsToFile = async (products) => {
        await fs.writeFile(this.path, JSON.stringify(products, null, "\t"), "utf-8");
    };

    getProducts = async () => {
        let productsFromFile = [];
        try {
            const fileContent = await fs.readFile(this.path, "utf-8");
            productsFromFile = JSON.parse(fileContent);
        } catch (error) {
            console.error(`Error leyendo el archivo: ${this.path} - ${error.message}`);
        }
        return productsFromFile;
    }    

    getProductsById = async (id) => {
        const products = await this.getProducts(); // Esperar a que se resuelva la promesa
        const numericId = parseInt(id); // Convertir el ID a número        

        return products.find((product) => product.id === numericId);
    };   

    async updateProduct(updatedProduct) {
        const currentProducts = await this.getProducts();
        const index = currentProducts.findIndex((product) => product.id == updatedProduct.id);

        if (index !== -1) {
          const existingProduct = currentProducts[index];
      
          // Actualizar solo los atributos proporcionados en updatedProduct
          for (const key in updatedProduct) {
            if (key !== "id") {
              existingProduct[key] = updatedProduct[key];
            }
          }
      
          try {
            await this.saveProductsToFile(currentProducts);
          } catch (error) {
            console.error(`Error writing to file: ${this.path} - ${error.message}`);
          }
          return existingProduct;
        } else {
          throw new Error('Product not found');
        }
      }

    // Método para eliminar un producto por su ID
    async deleteProduct(productId) {
        const currentProducts = await this.getProducts();
        const index = currentProducts.findIndex((product) => product.id == productId);

        if (index !== -1) {
            currentProducts.splice(index, 1);
            try {
                await this.saveProductsToFile(currentProducts);
            } catch (error) {
                console.error(`Error writing to file: ${this.path} - ${error.message}`);
                throw new Error('Error deleting product');
            }
        } else {
            throw new Error('Product not found');
        }
    }      


}