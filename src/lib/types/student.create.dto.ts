export interface StudentCreateDto {
  /** The name of the student. */
  readonly name: string;

  /** The last name of the student. */
  readonly lastName: string;

  /** The student's academic ID. This ID is unique for every student. */
  readonly academicId: number;

  /** The student's National Document Number (DNI). */
  readonly dni: number;

  /** The student's email address, if provided. */
  readonly email?: string;

  /** The student's phone number, if provided. */
  readonly phone?: string;

  /** If provided by the student, their custom profile picture. */
  readonly profilePicture?: string;
}
