/**
 * A utility function that combines multiple validators and returns a validation function for a value.
 * @param value - The value to be validated.
 * @param validators - An array of Validator instances to apply.
 * @returns A validation function that returns an error message or null based on the validators.
 */
export function validator(value: string | null, validators: Validator[]): () => string | null {
  const isEmpty = value === null || value.trim().length === 0;

  for (let i = 0; i < validators.length; i++) {
    const validator = validators[i];

    if (validator.ignoreEmptyValues && isEmpty) return () => null;
    if (!validator.validate(value)) return () => validator.errorMessage;
  }

  return () => null;
}

/**
 * Base class for creating custom validators.
 */
export abstract class Validator {
  errorMessage: string | null;

  /**
   * Creates a new Validator instance with the specified error message.
   * @param errorMessage - The error message for validation failure.
   */
  constructor(errorMessage: string) {
    this.errorMessage = errorMessage;
  }

  /**
   * Indicates whether empty values should be ignored during validation.
   */
  abstract ignoreEmptyValues: boolean;

  /**
   * Validates the provided value.
   * @param value - The value to be validated.
   * @returns true if validation passes, false otherwise.
   */
  abstract validate(value: string | null): boolean;
}

/**
 * Validator for ensuring a value is required and not empty.
 */
export class RequiredValidator extends Validator {
  ignoreEmptyValues = false;

  validate(value: string | null): boolean {
    return value !== null && value.trim().length > 0;
  }
}

/**
 * Validator for enforcing a maximum length for a value.
 */
export class MaxLengthValidator extends Validator {
  max: number;

  constructor(max: number, errorMessage: string) {
    super(errorMessage);
    this.max = max;
  }

  ignoreEmptyValues = true;

  validate(value: string | null): boolean {
    return value !== null && value.length <= this.max;
  }
}

/**
 * Validator for enforcing a minimum length for a value.
 */
export class MinLengthValidator extends Validator {
  min: number;

  constructor(min: number, errorMessage: string) {
    super(errorMessage);
    this.min = min;
  }

  ignoreEmptyValues = true;

  validate(value: string | null): boolean {
    return value !== null && value.length >= this.min;
  }
}

/**
 * Validator for enforcing a minimum and maximum length for a value.
 */
export class RangeLengthValidator extends Validator {
  min: number;
  max: number;

  constructor(min: number, max: number, errorMessage: string) {
    super(errorMessage);
    this.min = min;
    this.max = max;
  }

  ignoreEmptyValues = true;

  validate(value: string | null): boolean {
    return value !== null && value.length >= this.min && value.length <= this.max;
  }
}

/**
 * Validator for enforcing a minimum and maximum value.
 */
export class RangeValidator extends Validator {
  min: number;
  max: number;

  constructor(min: number, max: number, errorMessage: string) {
    super(errorMessage);
    this.min = min;
    this.max = max;
  }

  ignoreEmptyValues = true;

  validate(value: string | null): boolean {
    const numericValue = parseFloat(value!);
    return value !== null && !isNaN(numericValue) && numericValue >= this.min && numericValue <= this.max;
  }
}

/**
 * Validator for matching a value against a regular expression pattern.
 */
export class PatternValidator extends Validator {
  pattern: RegExp;

  constructor(pattern: RegExp, errorMessage: string) {
    super(errorMessage);
    this.pattern = pattern;
  }

  ignoreEmptyValues = true;

  validate(value: string | null): boolean {
    return value !== null && this.pattern.test(value);
  }
}

/**
 * Validator for ensuring a value is a valid email address.
 */
export class EmailValidator extends PatternValidator {
  constructor(errorMessage: string) {
    super(
      new RegExp(
        "([!#-'*+/-9=?A-Z^-~-]+(.[!#-'*+/-9=?A-Z^-~-]+)*|\"([]!#-[^-~ \\t]|(\\[\\t -~]))+\")@([!#-'*+/-9=?A-Z^-~-]+(.[!#-'*+/-9=?A-Z^-~-]+)*|[[\\t -Z^-~]*])"
      ),
      errorMessage
    );
  }
}
