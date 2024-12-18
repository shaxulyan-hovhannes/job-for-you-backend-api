import { Types } from 'mongoose';

import { User } from 'src/user/schemas/user.schema';

type SignupUserResponseType = Omit<
  User,
  '_id' | 'password' | 'refresh_token'
> & {
  id: Types.ObjectId;
};

export type { SignupUserResponseType };
