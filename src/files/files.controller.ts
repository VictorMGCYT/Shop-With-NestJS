import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFile, UseInterceptors, BadRequestException, Res } from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileFilter } from './helpers/fileFilter';
import { diskStorage } from 'multer';
import { FileNamer } from './helpers/fileNamer';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';

@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly configService: ConfigService
  ) {}

  @Post('product')
  @UseInterceptors( FileInterceptor('file', {
    fileFilter: FileFilter,
    storage: diskStorage({
      destination: './static/products',
      filename: FileNamer
    })
  }) )
  uploadProductFile( @UploadedFile() file: Express.Multer.File,){

    if(!file){
      throw new BadRequestException('Extension file is not valid ')
    }

    const secureUrl = `${this.configService.get('HOST_API')}/api/files/product/${file.filename}`;

    return {
      secureUrl: secureUrl
    };
  }

  // Servir la imagen para ser mostrada
  @Get('product/:imageName')
  findProductImage(
    @Res() res: Response,
    @Param('imageName') imageName: string
  ){

    const path = this.filesService.getStaticProductImage(imageName)

    return res.sendFile(path);
  }

}
