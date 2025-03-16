import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductsService } from 'src/products/products.service';

@Injectable()
export class SeedService {

  constructor(
    private readonly productService: ProductsService
  ){

  }

  async runSeed(){

    await this.productService.deleteAllProducts();

    return await "Seed has been executed"
  }


}
