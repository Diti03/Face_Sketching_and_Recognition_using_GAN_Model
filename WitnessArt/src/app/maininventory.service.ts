import { Injectable } from '@angular/core';
import { Product } from './models/product.model';

@Injectable({
  providedIn: 'root'
})
export class MaininventoryService {

  constructor() { }
  products: Product[] = [
    { name: 'Jeans', size: 'M', color: 'Blue', quantity: 10, threshold: 5 },
    { name: 'Damage Jeans', size: 'L', color: 'Navy Blue', quantity: 20, threshold: 15 },
    { name: 'High Waist', size: 'S', color: 'Sky Blue', quantity: 5, threshold: 10 },
    { name: 'Plazo Jeans', size: 'M', color: 'Black', quantity: 8, threshold: 7 },
    { name: 'Frock', size: 'L', color: 'Green', quantity: 3, threshold: 6 },
    { name: 'Suit', size: 'XL', color: 'Gray', quantity: 7, threshold: 5 },
  ];

  getAllProducts(name: string): Product[] {
    return this.products.filter(product => product.name.toLowerCase().includes(name.toLowerCase()));
  }
  

  getProductByNameSizeColor(name: string, size: string, color: string): Product | undefined {
    return this.products.find(product => 
      product.name.toLowerCase() === name.toLowerCase() &&
      product.size.toLowerCase() === size.toLowerCase() &&
      product.color.toLowerCase() === color.toLowerCase()
    );
  }

  addProduct(newProduct: Product): void {
    const existingProduct = this.getProductByNameSizeColor(newProduct.name, newProduct.size, newProduct.color);
    if (!existingProduct) {
      this.products.push(newProduct); // Add as a new product
    } else {
      Object.assign(existingProduct, newProduct); // Update existing product
    }
  }

  updateProduct(index: number, updatedProduct: Product): void {
    this.products[index] = updatedProduct;
  }

  updateProductQuantity(name: string, size: string, color: string, change: number): void {
    const product = this.products.find(p => p.name.toLowerCase() === name.toLowerCase() &&
                                            p.size.toLowerCase() === size.toLowerCase() &&
                                            p.color.toLowerCase() === color.toLowerCase());
    if (product) {
      product.quantity += change;
      if (product.quantity < 0) product.quantity = 0;
    }
  }

  deleteProduct(index: number): void {
    this.products.splice(index, 1);
  }
}
