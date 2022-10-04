export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

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
