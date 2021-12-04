import { GMXHotelDescription } from '../../../types/gmxTypes';
import { HotelDescription } from '../../../types/elasticTypes';
import { MapperFunction } from './index';

export const mapGMXDescriptionToHotelDescription: MapperFunction<
  GMXHotelDescription,
  HotelDescription
> = (data) => {
  const { Language, Paragraph, Title } = data;
  return {
    language: Language ?? '',
    title: Title ?? '',
    detail: Paragraph ?? '',
  };
};
