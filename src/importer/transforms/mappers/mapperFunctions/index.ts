export type MapperFunction<Input, Output> = (data: Input) => Output;

export { mapGMXHotelDataToHotelContent } from './hotelContentMapper';
export { mapGMXFacilityToHotelFacility } from './facilityMapper';
export { mapGMXDescriptionToHotelDescription } from './descriptionMapper';
export { mapGMXImageToHotelImage } from './imageMapper';
