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
 * Returns the amount of registered students on OverService.
 *
 * @returns {Promise<number>} The amount of students.
 */
export async function getStudentsCount(): Promise<number> {
  await connect();

  return await StudentModel.countDocuments();
}

/**
 * Searches for a list of students adhered to OverService.
 *
 * @param {string} [query] The query to search for. Default is none.
 * @param {number} [limit] The maximum amount of students to return. Default is 25.
 * @param {number} [offset] The amount of students to skip, if paging results. Default is 0.
 *
 * @returns {Promise<Array<Partial<Student>>>} The list of students.
 */
export async function searchStudents(
  query?: string,
  limit?: number,
  offset?: number
): Promise<Array<Partial<Student>>> {
  await connect();

  const search = query ? { $text: { $search: query } } : {};

  const result: Array<Student> = await StudentModel.find(search)
    .limit(limit ?? 25)
    .skip(offset ?? 0);

  // Remove certain data from the students.
  return result.map(
    ({ academicId, createdAt, name, lastName, profilePicture, role }) => ({
      academicId,
      createdAt,
      name,
      lastName,
      profilePicture,
      role,
    })
  );
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
