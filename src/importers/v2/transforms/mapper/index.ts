import { GMXHotelData } from '../../../../types/gmxTypes';
import { HotelContent } from '../../../../types/elasticTypes';
import { mapGMXHotelDataToHotelContent } from '../../../v1/mappers/mapperFunctions';
import Mapper from './mapper';

export const getHotelContentMapper = (): Mapper<GMXHotelData, HotelContent> => {
  return new Mapper<GMXHotelData, HotelContent>(mapGMXHotelDataToHotelContent);
};
