import { IsInt, Min, Max } from 'class-validator';

export class VoteEntryDto {
  @IsInt()
  @Min(1)
  @Max(5)
  bars: number; // Bars rating (1-5)

  @IsInt()
  @Min(1)
  @Max(5)
  flow: number; // Flow rating (1-5)

  @IsInt()
  @Min(1)
  @Max(5)
  creativity: number; // Creativity rating (1-5)
}
