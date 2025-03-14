import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { validate as isUUID } from 'uuid';
import { title } from 'process';

@Injectable()
export class ProductsService {

  private readonly logger = new Logger('ProductsService');

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>
  ){}

  async create(createProductDto: CreateProductDto) {
    
    try {

      const product = this.productRepository.create(createProductDto);
      await this.productRepository.save(product)
      return product;
      
    } catch (error) {
      this.handleExeptions(error);
    }

  }

  // TODO paginar
  async findAll( paginationDto: PaginationDto ) {

    const { limit = 10, offset = 0 } = paginationDto; 

    return await this.productRepository.find({
      take: limit,
      skip: offset
      // TODO relaciones
    });
  }

  async findOne(term: string) {

    // const product = await this.productRepository.findOneBy({term});
    let product: Product | null

    if( isUUID(term) ){
      product = await this.productRepository.findOneBy({ id: term});
    } else{

      const queryBuilder = this.productRepository.createQueryBuilder('');
      product = await queryBuilder
        .where(' LOWER(title) = :title or slug = :slug', {
          title: term.toLowerCase(),
          slug: term.toLowerCase(),
        }).getOne();

    }

    if(!product){
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {

    try {
      const product = await this.productRepository.preload({
        id: id,
        ...updateProductDto
      })
  
      if (!product) {
        throw new NotFoundException(`Product with id ${id} not found`)
      }
  
  
  
      return await this.productRepository.save(product);
    } catch (error) {
      this.handleExeptions(error);
    }
   
  }

  async remove(id: string) {

    const product = await this.findOne(id);

    await this.productRepository.remove(product);
    return `This action removes a #${id} product`;
  }


  private handleExeptions(error: any) {
    if(error.code === '23505'){
      throw new BadRequestException(error.detail);
    }
    else{
      this.logger.error(error);
      throw new InternalServerErrorException('Unexpected error, chekc server logs');
    }
  }
}
