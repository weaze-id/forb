# forb - Simplified Form Validation for React

**forb** is a lightweight and intuitive form validation library for React applications. Easily manage and validate forms, enhancing user experience and ensuring data accuracy with minimal effort.

## Installation

You can install the **forb** library using npm:

```sh
npm install forb --save
```

Or using yarn:

```sh
yarn add forb
```

## Usage

1. Import the necessary components and hooks:

```jsx
import {
  useForb,
  validator,
  RequiredValidator,
  EmailValidator,
  MaxLengthValidator,
  MinLengthValidator,
  RangeLengthValidator,
  RangeValidator,
  PatternValidator,
} from "forb";
```

2. Set up your form and use the `useForb` hook:

```jsx
function App() {
  const { validate, register } = useForb();
  const email = useRef("");
  const password = useRef("");

  function handleSubmit(event: FormEvent) {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    console.log("submitted");
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Email</label>
        {register({
          validator:() => validator(email.current, [
            new RequiredValidator("Required"),
            new EmailValidator("Invalid email format"),
          ]),
          render: (errorMessage) => (
            <>
              <input defaultValue={email.current} onChange={(e) => (email.current = e.target.value)} />
              {errorMessage && <>{errorMessage}</>}
            </>
          ),
        })}
      </div>
      <div>
        <label>Password</label>
        {register({
          validator: validator(password.current, [
            new RequiredValidator("Required"),
            new MinLengthValidator(8, "Minimum length is 8 characters"),
          ]),
          render: (errorMessage) => (
            <>
              <input
                type="password"
                defaultValue={password.current}
                onChange={(e) => (password.current = e.target.value)}
              />
              {errorMessage && <>{errorMessage}</>}
            </>
          ),
        })}
      </div>
      <button type="submit">Submit</button>
    </form>
  );
}
```

3. Customize your form fields with validation:

- Use the provided built-in validators (e.g., `EmailValidator`, `MaxLengthValidator`, etc.).
- Create custom validation rules by implementing the `Validator` abstract class.

## API Documentation

### `useForb`

The `useForb` hook provides the following methods:

- `validate`: Validates all registered fields and returns `true` if all validations pass, otherwise `false`.

- `register(options)`: Registers a form field for validation.

### `validator(value, rules)`

The `validator` function is used to create a validator for a specific form field.

- `value`: The value to be validated.
- `rules`: An array of validation rules to apply.

### Built-in Validators

**forb** provides the following built-in validators:

- `RequiredValidator`: Validates if the field has a non-empty value.

- `EmailValidator`: Validates email format.

- `MaxLengthValidator`: Validates the maximum length of the value.

- `MinLengthValidator`: Validates the minimum length of the value.

- `RangeLengthValidator`: Validates the range of the value's length.

- `RangeValidator`: Validates the range of numeric values.

- `PatternValidator`: Validates against a regular expression pattern.

### Custom Validators

You can create custom validation rules by implementing the `Validator` abstract class.

## Contributing

Contributions to **forb** are welcome! To contribute, please follow the guidelines in [CONTRIBUTING.md](CONTRIBUTING.md).

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
