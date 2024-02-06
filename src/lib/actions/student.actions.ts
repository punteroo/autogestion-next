"use server";

import StudentModel, { Student } from "../models/student.model";
import { connect } from "../mongoose";
import { StudentRole } from "../objects/student.roles";
import { StudentCreateDto } from "../types/student.create.dto";

/**
 * Creates a new student in the database.
 *
 * Students can optionally subscribe to this service, and not all students will be here.
 *
 * @param {StudentCreateDto} student The student to create.
 *
 * @returns {Promise<Student>} The created student.
 */
export async function createStudent(
  student: StudentCreateDto
): Promise<Student> {
  await connect();

  // Does the student already exist?
  if (await StudentModel.exists({ academicId: student.academicId }))
    throw new Error(
      `${student.academicId} is already subscribed to the over-service.`
    );

  // Create the student.
  return await StudentModel.create({
    ...student,
    role: StudentRole.STUDENT,
  });
}

/**
 * Fetches a student from the database.
 *
 * @param {number} academicId The academic ID of the student to fetch.
 *
 * @returns {Promise<Student>} The student, if found.
 */
export async function fetchStudent(
  academicId: number
): Promise<Student | null> {
  await connect();

  return await StudentModel.findOne({ academicId });
}

/**
 * Updates a student's subscription data.
 *
 * @param {number} academicId The academic ID of the student to update.
 * @param {string} [profilePicture] The student's profile picture URL.
 * @param {string} [email] The student's email address.
 * @param {string} [phone] The student's phone number.
 *
 * @returns {Promise<Student>} The updated student.
 */
export async function updateStudentSubscription(
  academicId: number,
  profilePicture?: string,
  email?: string,
  phone?: string
): Promise<Student> {
  await connect();

  // Fetch the student.
  const student = await fetchStudent(academicId);

  if (!student)
    throw new Error(
      `Student with academic ID ${academicId} is not subscribed to the over-service.`
    );

  // Update the student.
  if (profilePicture) {
    student.profilePicture = profilePicture;
    student.markModified("profilePicture");
  }

  if (email) {
    student.email = email;
    student.markModified("email");
  }

  if (phone) {
    student.phone = phone;
    student.markModified("phone");
  }

  return await student.save();
}
