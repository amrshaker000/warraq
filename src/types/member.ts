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
  status: "active" | "inactive" | "suspended";
  membershipType: MembershipType;
  photo?: string;
  financialSupport: "paid" | "unpaid";
  registrationDate: string;
  createdAt: string;
  updatedAt: string;
}

export type MembershipType =
  | "regular"
  | "committee"
  | "assistantSecretary"
  | "organizationSecretary"
  | "secretary"
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
  status: "active" | "inactive" | "suspended";
  membershipType: MembershipType;
  photo?: File | string;
  financialSupport: "paid" | "unpaid";
}

export interface MemberFilters {
  search?: string;
  gender?: string;
  status?: string;
  financialSupport?: string;
  membershipType?: string;
  partyUnit?: string;
  ageMin?: number;
  ageMax?: number;
}

export interface MemberStats {
  totalMembers: number;
  activeMembers: number;
  inactiveMembers: number;
  suspendedMembers: number;
  paidMembers: number;
  unpaidMembers: number;
  maleMembers: number;
  femaleMembers: number;
  recentRegistrations: number;
}
