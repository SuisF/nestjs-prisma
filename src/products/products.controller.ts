import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  HttpException,
  Res,
  Put,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Prisma } from '@prisma/client';
import { Response } from 'express';
import { CacheKey, CacheTTL } from '@nestjs/cache-manager';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createProductDto: CreateProductDto, @Res() res: Response) {
    return this.productsService
      .create(createProductDto)
      .then((data) => {
        return res.status(data.status).json(data);
      })
      .catch((error) => {
        return res.status(error.status).json(error);
      });
  }

  @Get()
  @CacheKey('products')
  @CacheTTL(60)
  findAll(@Res() res: Response) {
    return this.productsService
      .findAll()
      .then((data) => {
        return res.status(data.status).json(data);
      })
      .catch((error) => {
        return res.status(error.status).json(error);
      });
  }

  @Get(':id')
  @CacheKey('product_id')
  @CacheTTL(60)
  findOne(@Param('id') id: string, @Res() res: Response) {
    return this.productsService
      .findOne(+id)
      .then((data) => {
        return res.status(data.status).json(data);
      })
      .catch((error) => {
        return res.status(error.status).json(error);
      });
  }

  @Put('update/:id')
  @CacheKey('product_id')
  @CacheTTL(60)
  update(
    @Param('id') id: number,
    @Body() updateProductDto: UpdateProductDto,
    @Res() res: Response,
  ) {
    return this.productsService
      .update(+id, updateProductDto)
      .then((data) => {
        return res.status(data.status).json(data);
      })
      .catch((error) => {
        return res.status(error.status).json(error);
      });
  }

  @Delete('delete/:id')
  remove(@Param('id') id: string, @Res() res: Response) {
    return this.productsService
      .remove(+id)
      .then((data) => {
        return res.status(data.status).json(data);
      })
      .catch((error) => {
        return res.status(error.status).json(error);
      });
  }
}
