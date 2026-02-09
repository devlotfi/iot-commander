/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  TextField,
  Label,
  Input,
  FieldError,
  type TextFieldProps,
  type LabelProps,
  type InputProps,
  type FieldErrorProps,
} from "@heroui/react";

interface ValidatedTextFieldProps {
  formik: any;
  name: string;
  textFieldProps?: TextFieldProps;
  labelProps?: LabelProps;
  inputProps?: InputProps;
  fieldErrorProps?: FieldErrorProps;
}

export default function ValidatedTextField({
  formik,
  name,
  textFieldProps,
  labelProps,
  inputProps,
  fieldErrorProps,
}: ValidatedTextFieldProps) {
  return (
    <TextField variant="secondary" fullWidth name={name} {...textFieldProps}>
      <Label {...labelProps}></Label>
      <Input
        name={name}
        value={formik.values[name]}
        onBlur={formik.handleBlur}
        onChange={formik.handleChange}
        {...inputProps}
      />
      {formik.errors[name] && formik.touched[name] && (
        <FieldError {...fieldErrorProps}>{formik.errors[name]}</FieldError>
      )}
    </TextField>
  );
}
