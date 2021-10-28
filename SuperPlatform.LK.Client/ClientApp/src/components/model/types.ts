export interface IPhoto {
  id: number;
  url: string;
}

export interface IDirection {
  id: number;
  name: string;
  ageMin: number;
  ageMax: number;
  photo: IPhoto[];
}

export interface ICity {
  id: number;
  name: string;
}

export interface IDiscipline {
  id: number;
  name: string;
  ageMin: number;
  ageMax: number;
  photo: IPhoto[];
}

export interface IOrganization {
  id: number;
  name: string;
  address: string;
  email: string;
  station: string;
  latitude: number;
  longitude: number;
  phone: string;
  photo: IPhoto;
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
  sections?: {
    sectionId: number;
    sectionGroupId: number;
    sectionName: string;
    sectionGroupName: string;
    organizationName: string;
    disciplineName: string;
    directionName: string;
  }[];
}

export interface ISectionGroup {
  id: number;
  name: string;
  sectionName: string;
  organizationName: string;
  address: string;
  recordType: number;
  cost: number;
  costDuration: number;
  teacherFullName: string;
  teacherPhoto: string;
  sectionGroupSchedules: [
    {
      id: number;
      dayOfWeek: number;
      sectionGroupScheduleTimes: [
        {
          id: number;
          startTime: string;
          endTime: string;
        }
      ];
    }
  ];
}
