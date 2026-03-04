export interface Account {
  name: string;
  accountName: string;
  type: "PERSONAL" | "LOCATION_GROUP" | "USER_GROUP" | "ORGANIZATION";
  accountNumber: string;
}

export interface Location {
  name: string;
  title: string;
  storefrontAddress?: PostalAddress;
  phoneNumbers?: PhoneNumbers;
  categories?: Categories;
  regularHours?: BusinessHours;
  specialHours?: SpecialHours;
  websiteUri?: string;
  profile?: Profile;
}

export interface PostalAddress {
  regionCode: string;
  languageCode: string;
  addressLines: string[];
  locality: string;
  administrativeArea: string;
  postalCode: string;
}

export interface PhoneNumbers {
  primaryPhone: string;
  additionalPhones?: string[];
}

export interface Categories {
  primaryCategory: Category;
  additionalCategories?: Category[];
}

export interface Category {
  displayName: string;
  categoryId: string;
}

export interface BusinessHours {
  periods: TimePeriod[];
}

export interface TimePeriod {
  openDay: string;
  openTime: TimeOfDay;
  closeDay: string;
  closeTime: TimeOfDay;
}

export interface TimeOfDay {
  hours: number;
  minutes: number;
}

export interface SpecialHours {
  specialHourPeriods: SpecialHourPeriod[];
}

export interface SpecialHourPeriod {
  startDate: DateType;
  openTime: TimeOfDay;
  endDate: DateType;
  closeTime: TimeOfDay;
  closed: boolean;
}

export interface DateType {
  year: number;
  month: number;
  day: number;
}

export interface Profile {
  description: string;
}

export interface Review {
  name: string;
  reviewId: string;
  reviewer: Reviewer;
  starRating: "ONE" | "TWO" | "THREE" | "FOUR" | "FIVE";
  comment: string;
  createTime: string;
  updateTime: string;
  reviewReply?: ReviewReply;
}

export interface Reviewer {
  displayName: string;
  profilePhotoUrl: string;
  isAnonymous: boolean;
}

export interface ReviewReply {
  comment: string;
  updateTime: string;
}

export interface AccountsListResponse {
  accounts: Account[];
  nextPageToken?: string;
}

export interface LocationsListResponse {
  locations: Location[];
  nextPageToken?: string;
  totalSize?: number;
}

export interface ReviewsListResponse {
  reviews: Review[];
  averageRating: number;
  totalReviewCount: number;
  nextPageToken?: string;
}
