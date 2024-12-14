const USER_ROLES = {
  guest: 'guest',
  candidate: 'candidate',
  employer: 'employer',
  admin: 'admin',
} as const;

const VERIFY_CODE_EXPIRES_TIME = 600000 as const;

export { USER_ROLES, VERIFY_CODE_EXPIRES_TIME };
