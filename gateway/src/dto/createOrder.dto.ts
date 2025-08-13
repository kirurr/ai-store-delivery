import { CreateOrderInput, CreateOrderInputItem } from '@shared';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateOrderDTO implements CreateOrderInput {
  @IsString()
  @IsNotEmpty()
  userDocumentId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ItemDTO)
  items: ItemDTO[];

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsOptional()
  commentary?: string | undefined;
}

class ItemDTO implements CreateOrderInputItem {
  @IsString()
  @IsNotEmpty()
  documentId: string;

  @IsNumber()
  @Min(1)
  quantity: number;

  @IsNumber()
  price: number;
}
