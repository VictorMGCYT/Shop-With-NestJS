import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductsService } from 'src/products/products.service';
import { initialData } from './data/seed-data';

@Injectable()
export class SeedService {

  constructor(
    private readonly productService: ProductsService
  ){

  }

  async runSeed(){

    await this.productService.deleteAllProducts();

    const products = initialData.products;

    const initialPromises: any | undefined = [];

    // products.forEach( product => {
    //   initialPromises.push( this.productService.create( product ) );
    // })

    await Promise.all( initialPromises );

    return await true;
  }


}
