import BaseMapper from './generic/baseMapper';
import {
  GMXHotelData,
  GMXHotelDescription,
  GMXHotelFacility,
  GMXHotelImage,
} from '../../../types/gmxTypes';
import {
  HotelContent,
  HotelDescription,
  HotelFacility,
  HotelImage,
} from '../../../types/elasticTypes';
import Mapper from './generic/mapper';
import {
  mapGMXDescriptionToHotelDescription,
  mapGMXFacilityToHotelFacility,
  mapGMXHotelDataToHotelContent,
  mapGMXImageToHotelImage,
} from '../../v2/transforms/mappers/mapperFunctions';
import AttributeCollector, { Payload } from './generic/attributeCollector';

export { default as BaseMapper } from './generic/baseMapper';
export { Payload } from './generic/attributeCollector';

export const getHotelMapper = (): BaseMapper<GMXHotelData, HotelContent> => {
  return new Mapper<GMXHotelData, HotelContent>(mapGMXHotelDataToHotelContent);
};

export const getDescriptionMapper = (): AttributeCollector<
  GMXHotelDescription,
  HotelDescription
> => {
  return new AttributeCollector<GMXHotelDescription, HotelDescription>(
    'HotelId',
    'descriptions',
    mapGMXDescriptionToHotelDescription
  );
};

export const getImageMapper = (): AttributeCollector<
  GMXHotelImage,
  HotelImage
> => {
  return new AttributeCollector<GMXHotelImage, HotelImage>(
    'HotelId',
    'images',
    mapGMXImageToHotelImage
  );
};

export const getFacilitiesMapper = (): AttributeCollector<
  GMXHotelFacility,
  HotelFacility
> => {
  return new AttributeCollector<GMXHotelFacility, HotelFacility>(
    'HotelId',
    'facilities',
    mapGMXFacilityToHotelFacility
  );
};
