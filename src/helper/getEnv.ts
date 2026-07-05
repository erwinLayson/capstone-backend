import ValidationError from "../error/validationError";

export default function getEnv(name: string):string {
  const value = process.env[name];

  if(value === undefined) {
    console.log(`Name: ${name}`)
    throw new ValidationError(`ENV name ${name}`);
  }

  return value;
}