import type BaseSeriesDto from './BaseSeriesDto.interface';
export default interface AddSeriesDto extends BaseSeriesDto {
  authorFirstName: string;
  authorLastName: string;
}
