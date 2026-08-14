import { IsString } from 'class-validator';

export class PurchaseBeatDto {
  @IsString()
  receipt: string; // Apple IAP receipt
}

