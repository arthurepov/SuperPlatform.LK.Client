export interface IDirection {
  created_at: Date;
  disciplines: any[];
  id: number;
  name: string;
  published_at: Date;
  updated_at: Date;
}

export interface IWrapListArrayItem {
  name: string;
  ageMin: number;
  ageMax: number;
  photo: any[];
  id: number;
  organizationsCount: number;
}

export interface IDiscipline {
  id: number;
  name: string;
  ageMin: number;
  ageMax: number;
  published_at: Date;
  created_at: Date;
  updated_at: Date;
  direction: IDirection;
}

export interface IOrganization {
  id: number;
  name: string;
  address: string;
  station: string;
  latitude: string;
  longitude: string;
  phone: string;
  published_at: Date;
  created_at: Date;
  updated_at: Date;
}

export interface ISchedule {
  id: number;
  name: string;
  disciplineId: number;
  dayOfWeek: number;
  timeStart: string;
  timeEnd: string;
  address: string;
  phone: string;
  latitude: number;
  longitude: number;
  organizationId: number;
  ageMin: number;
  ageMax: number;
  published_at: Date;
  created_at: Date;
  updated_at: Date;
}

export interface IChild {
  id: string;
  fullName: string;
  avatar?: string;
}
