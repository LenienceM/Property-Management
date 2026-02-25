import { PropertyStatus } from "./PropertyStatus";
// src/types/Property.ts

export interface PropertyImage {
  id: number;
}

export interface Property {
  id: number;
  title: string;
  suburb: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  description?: string;
  //images?: PropertyImage[];
  imageUrls: string[]; 
  status: PropertyStatus; 
  
}
