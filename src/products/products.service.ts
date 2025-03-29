import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { DataSource, Repository } from 'typeorm';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { validate as isUUID } from 'uuid';
import { title } from 'process';
import { ProductImage } from './entities/product-image.entity';
import { User } from 'src/auth/entities/user.entity';

@Injectable()
export class ProductsService {

  private readonly logger = new Logger('ProductsService');

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,


    private readonly dataSource: DataSource
  ){}

  async create(createProductDto: CreateProductDto, user: User) {
    
    try {

      const { images = [], ...restDetail } = createProductDto;

      const product = this.productRepository.create({
        ...restDetail, 
        // ! ESTO ESTÁ JODIDO
        images: images.map( image => this.productImageRepository.create({ url: image})),
        user: user
      });
      await this.productRepository.save(product)
      // Para que no retorne las imagenes desde la tabla con todo y los ID
      return {...product, images: images};
      
    } catch (error) {
      this.handleExeptions(error);
    }

  }

  // TODO paginar
  async findAll( paginationDto: PaginationDto ) {

    const { limit = 10, offset = 0 } = paginationDto; 

    const products = await this.productRepository.find({
      take: limit,
      skip: offset,
      relations: {
        images: true
      }
      // TODO relaciones
    });

    return products.map( product => ({
      ...product,
      images: product.images?.map( image => image.url )
    }) )
  }

  async findOne(term: string) {

    // const product = await this.productRepository.findOneBy({term});
    let product: Product | null

    if( isUUID(term) ){
      product = await this.productRepository.findOne({
        where: { id: term },
        relations: ['images'],
      });
    } else{

      const queryBuilder = this.productRepository.createQueryBuilder('prod');
      product = await queryBuilder
        .where(' LOWER(title) = :title or slug = :slug', {
          title: term.toLowerCase(),
          slug: term.toLowerCase(),
        })
        .leftJoinAndSelect('prod.images', 'prodImages')
        .getOne();

    }

    if(!product){
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto, user: User) {

    const { images, ...rest } = updateProductDto;

    const product = await this.productRepository.preload({
      id: id,
      ...rest
    })

    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`)
    }
  
    // Create queryRunner
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      
      if(images){
        await queryRunner.manager.delete(ProductImage, { product: { id: id } })
        product.images = images.map( 
          image => this.productImageRepository.create({ url: image })
        );
      }

      product.user = user;
      await queryRunner.manager.save(product);
      await queryRunner.commitTransaction();
      await queryRunner.release();

      return this.finOnePlain(id);

    } catch (error) {

      await queryRunner.rollbackTransaction();
      await queryRunner.release();

      this.handleExeptions(error);
    }
   
  }

  async remove(id: string) {

    const product = await this.findOne(id);

    await this.productRepository.remove(product);
    return `Product with id: #${id} was deleted`;
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

  async finOnePlain( term: string ){
    const {images = [], ...rest} = await this.findOne(term);

    console.log(images, rest);
    return {
      ...rest,
      images: images.map( image => image.url)
    }
  }

  async deleteAllProducts() {

    try {
      
      const queryBuilder = await this.productRepository.createQueryBuilder('product');

      await queryBuilder
        .delete()
        .where({})
        .execute()

    } catch (error) {
      this.handleExeptions(error);
    }

  }
}
