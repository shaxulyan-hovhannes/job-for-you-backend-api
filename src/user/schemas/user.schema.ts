import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

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
}

export const UserSchema = SchemaFactory.createForClass(User);
