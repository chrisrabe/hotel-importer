export type GMXHotelData = {
  HotelId: string; //"10740289";
  DisplayName: string; //"Vacanze a Sperlonga";
  CountryCode: string; //"IT";
  CountryName: string; //"Italy";
  State: null;
  CityName: string; //"Sperlonga";
  Address: string; //"Via Valle 337";
  ZipCode: string; //"04029";
  StarRating: string | null;
  Lat: string | null; //"41.26104";
  Lng: string | null; //"13.43301";
  RoomCount: string; //"3";
  Phone: string; //"39-339-2077154";
  Fax: string; //"39-339-2077154";
  Email: null;
  WebSite: null;
  CreationTime: string; //"24-07-2018";
  UpdateTime: string; //"24-07-2020";
  PropertyCategory: string; //"Apartment";
  ChainCode: null;
  SupKeys: {};
};

export type GMXHotelFacility = {
  HotelId: string;
  FacilityId: string;
  FacilityName: string;
  FacilityType: string;
};

export type GMXHotelDescription = {
  HotelId: string;
  Language: string; // en
  Line: string; // 1, 2 etc. this is lineNumber
  Paragraph: string; // detail description
  Title: string | undefined; // short description like a category, e.g.attractions
};

export type GMXHotelImage = {
  HotelId: string; //"10740289";
  Uid: string; // 'd18932d2-8bf0-44af-8f0c-5e1016301a7d'
  Priority: string; // '52'
  ImageUrl: string; // 'https://az712897.vo.msecnd.net/images/full/d18932d2-8bf0-44af-8f0c-5e1016301a7d.jpeg',
  ImageHeight: string; // '500'
  ImageWidth: string; // '372'
  ThumbUrl: string | undefined; // ''
  ThumbHeight: string | undefined; // ''
  ThumbWidth: string | undefined; // ''
  Description: string | undefined; // ''
};
