export interface CompanyAddress {
  street: string;
  city: string;
  postalCode: string;
  province: string;
  country: string;
}

export interface CompanyContact {
  phone: string;
  email: string;
  whatsapp?: string;
}

export interface BusinessHours {
  weekdays: string;
  saturday: string;
  sunday: string;
}

export interface CompanyData {
  brandName: string;
  legalName: string;
  cif: string;
  address: CompanyAddress;
  contact: CompanyContact;
  businessHours: BusinessHours;
  yearFounded?: number;
  description: string;
}
