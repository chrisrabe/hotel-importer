import { GMXHotelImage } from '../../../../../types/gmxTypes';
import { HotelImage } from '../../../../../types/elasticTypes';
import { MapperFunction } from './index';

export const mapGMXImageToHotelImage: MapperFunction<
  GMXHotelImage,
  HotelImage
> = (data) => {
  const { ImageUrl, Description } = data;
  return {
    url: ImageUrl,
    description: Description ?? '',
  };
};
