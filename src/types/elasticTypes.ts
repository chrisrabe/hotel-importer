/**
 * This is the data structure stored in elastic.
 * It is populated by transforming GMX hotel data.
 */
export type HotelContent = {
  _id: string;
  hotelId: string
  hotelName: string;
  images: HotelImage[];
  rating: number;
  checkInTime: string; // 14:00
  checkOutTime: string; // 10:00
  facilities: HotelFacility[];
  descriptions: HotelDescription[];
  hotelLogo: string;
  location:
    | undefined
    | {
        coordinates: {
          lat: number;
          lon: number;
        };
      };
  address: {
    line_1: string;
    city: string;
    state: string;
    country: string;
    postcode: string;
  };
  createdTime: string;
  updatedTime: string;
};

export type HotelImage = {
  url: string;
  description: string;
};

export enum HotelFacilityType {
  'HotelFacility' = 'hotel',
  'RoomFacility' = 'room',
  'Other' = 'other',
}

export type HotelFacility = {
  type: HotelFacilityType;
  description: string;
};

export type HotelDescription = {
  language: string; // en
  title: string; // e.g. attractions
  detail: string;
};
