/**
 * Auto-generated entity types
 * Contains all CMS collection interfaces in a single file 
 */

/**
 * Collection ID: studentrecords
 * Interface for StudentRecords
 */
export interface StudentRecords {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  studentName?: string;
  /** @wixFieldType number */
  rollNumber?: number;
  /** @wixFieldType text */
  semester?: string;
  /** @wixFieldType date */
  dateOfBirth?: Date | string;
  /** @wixFieldType text */
  emailAddress?: string;
  /** @wixFieldType number */
  totalClasses?: number;
  /** @wixFieldType number */
  classesAttended?: number;
  /** @wixFieldType text */
  subject1Name?: string;
  /** @wixFieldType number */
  subject1Marks?: number;
  /** @wixFieldType text */
  subject2Name?: string;
  /** @wixFieldType number */
  subject2Marks?: number;
  /** @wixFieldType text */
  overallGrade?: string;
}
