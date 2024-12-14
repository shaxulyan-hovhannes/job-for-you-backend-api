import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

import { USER_ROLES } from 'src/constants/users';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({ required: true, default: '' })
  firstname: string;

  @Prop({ required: true, default: '' })
  lastname: string;

  @Prop({ required: true, default: '' })
  phone: string;

  @Prop({ required: true, unique: true, default: '' })
  email: string;

  @Prop({ required: true, default: '' })
  password: string;

  @Prop({
    required: true,
    default: false,
  })
  is_verified: boolean;

  @Prop({
    required: true,
    enum: Object.values(USER_ROLES),
    default: USER_ROLES.guest,
  })
  role: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
