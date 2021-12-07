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
import {
  mapGMXDescriptionToHotelDescription,
  mapGMXFacilityToHotelFacility,
  mapGMXHotelDataToHotelContent,
  mapGMXImageToHotelImage,
} from './mapperFunctions';
import Mapper from './generic/mapper';
import AttributeCollector from './generic/attributeCollector';

export const hotelContentMapper = (): Mapper<GMXHotelData, HotelContent> => {
  return new Mapper<GMXHotelData, HotelContent>(mapGMXHotelDataToHotelContent);
};

export const descriptionCollector = (): AttributeCollector<
  GMXHotelDescription,
  HotelDescription
> => {
  return new AttributeCollector<GMXHotelDescription, HotelDescription>(
    'HotelId',
    'descriptions',
    mapGMXDescriptionToHotelDescription
  );
};

export const facilityCollector = (): AttributeCollector<
  GMXHotelFacility,
  HotelFacility
> => {
  return new AttributeCollector<GMXHotelFacility, HotelFacility>(
    'HotelId',
    'facilities',
    mapGMXFacilityToHotelFacility
  );
};

export const imageCollector = (): AttributeCollector<
  GMXHotelImage,
  HotelImage
> => {
  return new AttributeCollector<GMXHotelImage, HotelImage>(
    'HotelId',
    'images',
    mapGMXImageToHotelImage
  );
};
