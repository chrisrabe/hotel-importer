import {
  GMXHotelData,
  GMXHotelDescription,
  GMXHotelFacility,
  GMXHotelImage,
} from './gmxTypes';
import {
  HotelContent,
  HotelDescription,
  HotelFacility,
  HotelFacilityType,
  HotelImage,
} from './elasticTypes';

export const mapGMXHotelDataToHotelContent = (
  gmxHotelData: GMXHotelData
): HotelContent => {
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
  } = gmxHotelData;
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

export const mapGMXFacilityToHotelFacility = (
  gmxFacility: GMXHotelFacility
): HotelFacility => {
  const { FacilityName, FacilityType: facilityType } = gmxFacility;
  return {
    type: getFacilityType(facilityType),
    description: FacilityName ?? '',
  };
};

export const mapGMXDescriptionToHotelDescription = (
  gmxDescription: GMXHotelDescription
): HotelDescription => {
  const { Language, Paragraph, Title } = gmxDescription;
  return {
    language: Language ?? '',
    title: Title ?? '',
    detail: Paragraph ?? '',
  };
};

export const mapGMXImageToHotelImage = (
  gmxImage: GMXHotelImage
): HotelImage => {
  const { ImageUrl, Description } = gmxImage;
  return {
    url: ImageUrl,
    description: Description ?? '',
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
