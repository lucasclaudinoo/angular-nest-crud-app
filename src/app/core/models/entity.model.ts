export interface EntityModel {
  name: string;
  region: string;
  specialties: string;
  active: string;
}

export interface ResponseModel {
  totalReports: number;
  result: EntityModel[];
}