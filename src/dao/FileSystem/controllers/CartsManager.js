import { promises as fs } from "fs";
import ProductManager from "./ProductManager.js";

const products = new ProductManager();

class CartManager {
    constructor() {
        this.path = './src/dao/FileSystem/json/cart.json'
        }

        
        readCarts = async () => {
          try {
            let allCarts = await fs.readFile(this.path, "utf-8");
            return JSON.parse(allCarts);
          } catch (error) {
            console.error(`Error: ${error}`);
            return [];
          }
        };

    writeCarts = async (cart) => {
      await fs.writeFile(this.path, JSON.stringify(cart), (error) => {
        if (error) throw error;
      });
    };

    
    exist = async (id) => {
      let cartsAll = await this.readCarts(this.path);

      return cartsAll.find((cart) => cart.id === id); 
      
    };
    
    deleteCart = async (id) => {
      let carts = await this.readCarts();
      let filterCarts = carts.filter((cart) => cart.id != id);
      await this.writeCarts(filterCarts);
      return filterCarts;
    };


    addCarts = async () => {
      let id = Math.floor(Math.random() * 1000 + 1);
      let oldCarts = await this.readCarts();
      let allCarts = [];
      if (Array.isArray(oldCarts)) {
        allCarts = [...oldCarts, { id: id, productos: [] }];
      } else {
        allCarts = [{ id: id, productos: [] }];
      }
      await this.writeCarts(allCarts);
    };


    getCartById = async (id) => {
      let actualCarts = await this.exist(id);
      if (!actualCarts) return 404;
      return actualCarts.productos;
    };

 
    addProductInCart = async (cartId, prodId) => {
      
    
      let cartById = await this.readCarts(cartId)
      let actualCarts = cartById.find(cart => cart.id == cartId);
      console.log(actualCarts)

      
      let productById = await products.readProducts(prodId);
      let existProduct = productById.find(product => product.id == prodId);    

      console.log(existProduct)

   const oldCarts = await this.deleteCart(cartId);
   console.log(oldCarts)


      let existingProductInCart = actualCarts.productos.find(product => product.id === prodId);

  if (existingProductInCart) {
    existingProductInCart.quantity += 1;
  } else {
    actualCarts.productos.push({ id: prodId, quantity: 1 });
  }
      
    let allCarts = [...oldCarts, actualCarts];
    await this.writeCarts(allCarts);
    return `El producto "${existProduct.title}" fue añadido exitosamente al carrito: ${cartId}`;


  };


    };
  

  export default CartManager;