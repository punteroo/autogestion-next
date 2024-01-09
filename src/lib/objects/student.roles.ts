export enum StudentRole {
  /** A normal student who uses the application. */
  STUDENT = "student",

  /** Role assigned to students who collaborated to the project. */
  COLLABORATOR = "collaborator",

  /** Represents a student who is an active developer in the project. */
  DEVELOPER = "developer",

  /** Special unique role given only to the owner of the project. */
  OWNER = "owner",
}
