export interface Member {
  id: string;
  fullName: string;
  nationalId: string;
  gender: "male" | "female";
  phoneNumber: string;
  landlineNumber?: string;
  partyUnit?: string;
  email: string;
  membershipNumber: string;
  age: number;
  address: string;
  job: string;
  membershipType: MembershipType;
  religion: "muslim" | "christian";
  photo?: string;
  registrationDate: string;
  createdAt: string;
  updatedAt: string;
}

export type MembershipType =
  | "regular"
  | "committee"
  | "divisionSecretary"
  | "assistantSecretary"
  | "organizationSecretary"
  | "secretary"
  | "assistantSecretaryGeneral"
  | "baseUnitSecretary"
  | "baseUnitAssistantSecretary"
  | "baseUnitOrganizationSecretary"
  | "baseUnitSecretaryGeneral"
  | "premium"
  | "vip";

export interface MemberFormData {
  fullName: string;
  nationalId: string;
  gender: "male" | "female";
  phoneNumber: string;
  landlineNumber?: string;
  partyUnit?: string;
  email: string;
  membershipNumber: string;
  age: number;
  address: string;
  job: string;
  membershipType: MembershipType;
  religion: "muslim" | "christian";
  photo?: File | string;
}

export interface MemberFilters {
  search?: string;
  gender?: string;
  membershipType?: string;
  partyUnit?: string;
  ageMin?: number;
  ageMax?: number;
}

export interface MemberStats {
  totalMembers: number;
  maleMembers: number;
  femaleMembers: number;
  recentRegistrations: number;
}
