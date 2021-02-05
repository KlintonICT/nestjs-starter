import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { IProduct } from './products.model';

@Injectable()
export class ProductsService {
  private products: IProduct[] = [];

  constructor(
    @InjectModel('Product') private readonly productModel: Model<IProduct>,
  ) {}

  async insertProduct(title: string, description: string, price: number) {
    const newProduct = new this.productModel({ title, description, price });
    const result = await newProduct.save();
    return result._id;
  }

  async getProducts() {
    const products = await this.productModel.find().exec();
    return products;
  }

  async getSingleProduct(productId: string) {
    let product;
    try {
      product = await this.productModel.findById(productId);
    } catch (err) {
      throw new NotFoundException('Could not find product');
    }
    if (!product) throw new NotFoundException('Could not find product');
    return product;
  }

  async updateProduct(
    productId: string,
    title: string,
    description: string,
    price: number,
  ) {
    const updatedProduct = await this.findProduct(productId);

    if (title) {
      updatedProduct.title = title;
    }
    if (description) {
      updatedProduct.description = description;
    }
    if (price) {
      updatedProduct.price = price;
    }

    updatedProduct.save();
  }

  async deleteProduct(prodId: string) {
    const result = await this.productModel.deleteOne({ _id: prodId }).exec();
    if (result.n === 0) {
      throw new NotFoundException('Could not find product');
    }
  }

  private async findProduct(productId: string): Promise<IProduct> {
    const product = await this.productModel.findById(productId);
    if (!product) throw new NotFoundException('Could not find product');
    return product;
  }
}
