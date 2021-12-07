import { GMXHotelData } from '../../../../../types/gmxTypes';
import { HotelContent } from '../../../../../types/elasticTypes';
import { MapperFunction } from './index';

export const mapGMXHotelDataToHotelContent: MapperFunction<
  GMXHotelData,
  HotelContent
> = (data) => {
  const {
    HotelId,
    State,
    DisplayName,
    StarRating,
    Lat,
    Lng,
    ZipCode,
    CountryName,
    CityName,
    Address,
  } = data;
  const DEFAULT_CHECKOUT = '10:00';
  const DEFAULT_CHECKIN = '14:00';
  const DEFAULT_STARRATING = 5;
  const dateInIsoString = new Date().toISOString();

  return {
    _id: HotelId,
    hotelName: DisplayName,
    images: [],
    facilities: [],
    rating: Number(StarRating ?? DEFAULT_STARRATING),
    checkInTime: DEFAULT_CHECKIN,
    checkOutTime: DEFAULT_CHECKOUT,
    descriptions: [],
    hotelLogo: '',
    location:
      !Lat || !Lng
        ? undefined
        : {
            coordinates: {
              lat: Number(Lat),
              lon: Number(Lng),
            },
          },
    address: {
      line_1: Address,
      city: CityName,
      state: State ?? '',
      country: CountryName,
      postcode: ZipCode,
    },
    createdTime: dateInIsoString,
    updatedTime: dateInIsoString,
  };
};
