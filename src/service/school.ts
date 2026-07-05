
// Database Pool connection
import { getDBPoolConnection } from "../config/database";

// Model
import SchoolModel from "../model/school";

// Helper 
import checkFields from "../helper/checkFields";

// Constant
import { School, updateSchoolInfoProps} from "../constant/school";
import ValidationError from "../error/validationError";
import NotFoundError from "../error/NotFoundError";



// Create School info function 
export const createSchoolInfo = async (school: School) => {
  checkFields(school);

  const pool = getDBPoolConnection();
  const connection = await pool.getConnection()

  try {
    const schoolModel = new SchoolModel(connection);

    const existingSchoolInfo = await schoolModel.getSchoolInfo();
    if (existingSchoolInfo) {
      throw new ValidationError("School information already Exist", 400,)
    }

    const schoolId = await schoolModel.createSchoolInfo(school);
    
    return schoolId;
  } catch (err) {
    await connection.rollback();
    throw err;
  } finally {
    connection.release();
  }
}


// Update School Info Function
export const updateSchoolInfo = async (schoolId: number, newSchoolInfo: updateSchoolInfoProps) => {

  if (Object.keys(newSchoolInfo).length === 0) {
    throw new ValidationError("Atleast one field Required");
  }
  
  // check fields
  checkFields(newSchoolInfo);

  const pool = getDBPoolConnection();
  const connection = await pool.getConnection();

  try {

    const schoolModel = new SchoolModel(connection);
    const affectedRows = await schoolModel.updateSchoolInfo(schoolId, newSchoolInfo);

    if (affectedRows === 0) {
      throw new NotFoundError("School Info Not found");
    }

    return affectedRows;
  } catch (err) {
    throw err;
  } finally {
    connection.release()
  }
}

// Get school Info function

export const getSchoolInfo = async () => {
  const pool = getDBPoolConnection();
  const connection = await pool.getConnection();

  try {
    const schoolModel = new SchoolModel(connection);
    const schoolInfo = await schoolModel.getSchoolInfo();

    if (!schoolInfo) {
      throw new NotFoundError("School detail not found");
    }

    return schoolInfo;
  } catch (err) {
    throw err;
  } finally {
    connection.release();
  }
}