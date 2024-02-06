import { getModelForClass, modelOptions, prop } from "@typegoose/typegoose";
import { StudentRole } from "../objects/student.roles";
import mongoose, { Document } from "mongoose";

@modelOptions({ schemaOptions: { timestamps: true, autoCreate: true } })
export class Student extends Document {
  /** The student's academic ID. This ID is unique for every student. */
  @prop({ type: Number, required: true })
  academicId!: number;

  /** The student's national identification number. This is also an unique value. */
  @prop({ type: Number, required: true })
  dni!: number;

  /** The student's first name. */
  @prop({ type: String, required: true })
  name!: string;

  /** The student's last name. */
  @prop({ type: String, required: true })
  lastName!: string;

  /** The student's email address, if provided. */
  @prop({ type: String, required: false })
  email?: string;

  /** The student's phone number, if provided. */
  @prop({ type: String, required: false })
  phone?: string;

  /** If provided by the student, their custom profile picture. */
  @prop({ type: String, required: false })
  profilePicture?: string;

  /** A special role that identifies the student within the platform. */
  @prop({ type: String, required: true, default: StudentRole.STUDENT })
  role!: StudentRole;

  createdAt!: Date;
  updatedAt!: Date;
}

const StudentModel = mongoose.models.Student || getModelForClass(Student);

export default StudentModel;
