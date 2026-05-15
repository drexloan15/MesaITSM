export interface User {
  id: string;
  email: string;
  username: string;
  fullName: string;
  phone?: string;
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
  userRoles: { roleId: string; role: { id: string; name: string } }[];
}
