import { join } from 'path';
import { existsSync } from 'fs';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class FilesService {
  
  getStaticProductImage( imageName: string ){

    const path = join( __dirname, '../../static/products', imageName )

    if( !existsSync(path) ){
      throw new  NotFoundException(`Image was not found: ${imageName}`)
    }

    return path;

  }

}
