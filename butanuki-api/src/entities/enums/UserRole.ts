import { registerEnumType } from '@nestjs/graphql';

export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

registerEnumType(UserRole, { name: 'UserRole' });

export const roleHierarchy = (role?: UserRole): UserRole[] => {
  if (!role) {
    return [];
  }
  const roles: UserRole[] = [role];
  switch (role) {
    case UserRole.ADMIN:
      roles.push(...roleHierarchy(UserRole.USER));
      break;
  }
  return roles;
};
