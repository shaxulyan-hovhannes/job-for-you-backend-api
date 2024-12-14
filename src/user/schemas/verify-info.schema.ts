import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type VerifyInfoDocument = HydratedDocument<VerifyInfo>;

@Schema()
export class VerifyInfo {
  @Prop({ default: null })
  user_id: Types.ObjectId;

  @Prop({ default: null })
  code: number;

  @Prop({ default: null })
  code_generated_date: Date;

  @Prop({ default: 3 })
  attempts: number;
}

export const VerifyInfoSchema = SchemaFactory.createForClass(VerifyInfo);
