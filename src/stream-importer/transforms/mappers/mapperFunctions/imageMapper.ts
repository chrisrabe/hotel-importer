import { GMXHotelImage } from '../../../../types/gmxTypes';
import { HotelImage } from '../../../../types/elasticTypes';
import { MapperFunction } from './index';

export const mapGMXImageToHotelImage: MapperFunction<
  GMXHotelImage,
  HotelImage
> = (data) => {
  const { ImageUrl, Description, HotelId: hotelId } = data;
  return {
    hotelId,
    url: ImageUrl,
    description: Description ?? '',
  };
};
