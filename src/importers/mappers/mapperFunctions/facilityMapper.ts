import { GMXHotelFacility } from '../../../types/gmxTypes';
import { HotelFacility, HotelFacilityType } from '../../../types/elasticTypes';
import { MapperFunction } from './index';

export const mapGMXFacilityToHotelFacility: MapperFunction<
  GMXHotelFacility,
  HotelFacility
> = (data) => {
  const { FacilityName, FacilityType: facilityType } = data;
  return {
    type: getFacilityType(facilityType),
    description: FacilityName ?? '',
  };
};

const getFacilityType = (type: string) => {
  switch (type) {
    case 'HotelFacility':
      return HotelFacilityType.HotelFacility;
    case 'RoomFacility':
      return HotelFacilityType.RoomFacility;
    default:
      return HotelFacilityType.Other;
  }
};
