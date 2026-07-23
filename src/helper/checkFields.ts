import ValidationError from "../error/validationError";


export default function checkFields<T extends Object>(field: T) {

  for (const [key, value] of Object.entries(field)) {
    if (value === null || value === "" || value === " ") {
      throw new ValidationError(`Missing required fields ${key}`);
    }
  }
}