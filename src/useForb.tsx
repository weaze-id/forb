import EventEmitter from "eventemitter3";
import React from "react";
import { useRef, useEffect, useState } from "react";

/**
 * Hook for managing validation and rendering of forb fields.
 * @returns An object containing functions for validation and registration.
 */
export function useForb() {
  // Maintain a reference to the validity status and control event emitter
  const _isValid = useRef(true);
  const _control = useRef(new EventEmitter());

  // Set up cleanup for event listener on unmount
  useEffect(() => {
    const control = _control.current;
    return () => {
      control.removeAllListeners();
    };
  }, []);

  /**
   * Validate the field and emit validation event.
   * @returns The current validity status.
   */
  function validate(): boolean {
    _isValid.current = true;
    _control.current.emit("validate");

    return _isValid.current;
  }

  /**
   * Register a forb field with its validation function and rendering logic.
   * @param validator - A function that validates the field and returns an error message or null.
   * @param render - A function that renders the field with the provided error message.
   * @returns The JSX element representing the forb field.
   */
  function register({
    validator,
    render,
  }: {
    validator: () => string | null;
    render: (errorMessage: string | null) => JSX.Element;
  }): JSX.Element {
    const onValidate = () => {
      const result = validator();
      if (result && _isValid.current) {
        _isValid.current = false;
      }
      return result;
    };

    return <_ForbField control={_control.current} validator={onValidate} render={render} />;
  }

  return { validate, register };
}

/**
 * Component for rendering a forb field with validation and error message handling.
 * @param control - The event emitter used for validation event handling.
 * @param validator - A function that validates the field and returns an error message or null.
 * @param render - A function that renders the field with the provided error message.
 * @returns The rendered JSX element representing the forb field.
 */
function _ForbField({
  control,
  validator,
  render,
}: {
  control: EventEmitter;
  validator: () => string | null;
  render: (errorMessage: string | null) => JSX.Element;
}) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Set up validation event listener and cleanup
  useEffect(() => {
    const onValidate = () => {
      setErrorMessage(validator());
    };

    control.on("validate", onValidate);
    return () => {
      control.removeListener("validate", onValidate);
    };
  }, [control, validator]);

  // Render the field with the provided error message
  return render(errorMessage);
}
