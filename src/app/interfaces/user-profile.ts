import { UserType } from '../enums/user-type';

export interface UserTimes {
  am: number;
  pm: number;
  evening: number;
}

export interface UserProfile {
  email: string;
  firstName: string;
  lastName: string;
  birthDate: Date;
  admin: boolean;
  approved: boolean;
  userType: UserType;
}

export interface UserProfileId extends UserProfile { id: string; }
