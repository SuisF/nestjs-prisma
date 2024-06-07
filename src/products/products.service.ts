import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { DatabaseService } from 'src/database/database.service';
import { Prisma } from '@prisma/client';
import { STATUS_CODES } from 'http';

@Injectable()
export class ProductsService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(createProductDto: CreateProductDto) {
    try {
      const product = await this.databaseService.product.create({
        data: {
          name: createProductDto.name,
          price: Number(createProductDto.price),
          availibility: 0,
        },
      });

      return {
        status: HttpStatus.CREATED,
        message: 'Product created successfully',
        data: product,
      };
    } catch (error) {
      if (error.code === 'P2002') {
        return {
          status: HttpStatus.BAD_REQUEST,
          message: `${error.meta.target} has already been used, ${error.meta.target} needs to be unique.`,
          error: 'Prisma Error Code: P2002',
        };
      } else {
        return {
          status: HttpStatus.BAD_REQUEST,
          message: 'Product creation failed',
          error: error.message,
        };
      }
    }
  }

  async findAll() {
    return this.databaseService.product.findMany().then((data) => {
      if (data.length === 0) {
        return {
          status: HttpStatus.NOT_FOUND,
          message: 'No products found',
        };
      } else {
        return {
          status: HttpStatus.OK,
          message: 'Products retrieved successfully',
          data: data,
        };
      }
    });
  }

  async findOne(id: number) {
    return this.databaseService.product
      .findUnique({
        where: {
          product_id: id,
        },
      })
      .then((data) => {
        if (data === null) {
          return {
            status: HttpStatus.NOT_FOUND,
            message: `Product with ID of ${id} wasn't found`,
          };
        } else {
          return {
            status: HttpStatus.OK,
            message: 'Product retrieved successfully',
            data: data,
          };
        }
      });
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    try {
      const product = await this.databaseService.product.update({
        where: {
          product_id: id,
        },
        data: {
          name: updateProductDto.name,
          price: Number(updateProductDto.price),
          updatedAt: new Date(),
        },
      });

      return {
        status: HttpStatus.OK,
        message: 'Product updated successfully',
        data: product,
      };
    } catch (error) {
      if (error.code === 'P2025') {
        return {
          status: HttpStatus.NOT_FOUND,
          message: `Product with ID of ${id} wasn't found`,
          error: 'Prisma Error Code: P2025',
        };
      } else {
        return {
          status: HttpStatus.BAD_REQUEST,
          message: 'Product update failed',
          error: error.message,
        };
      }
    }
  }

  async remove(id: number) {
    try {
      const product = await this.databaseService.product.delete({
        where: {
          product_id: id,
        },
      });

      return {
        status: HttpStatus.OK,
        message: 'Product deleted successfully',
        data: product,
      };
    } catch (error) {
      if (error.code === 'P2025') {
        return {
          status: HttpStatus.NOT_FOUND,
          message: `Product with ID of ${id} wasn't found`,
          error: 'Prisma Error Code: P2025',
        };
      } else {
        return {
          status: HttpStatus.BAD_REQUEST,
          message: 'Product deletion failed',
          error: error.message,
        };
      }
    }
  }
}
