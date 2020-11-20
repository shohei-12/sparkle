import React from "react";
import TextField from "@material-ui/core/TextField";

type Props = {
  fullWidth: boolean;
  label: string;
  multiline: boolean;
  required: boolean;
  rows: string;
  type: string;
  name: string;
  inputRef?: any;
  error?: boolean;
  helperText?: string | false;
  disabled?: boolean;
  placeholder?: string;
  InputLabelProps?: object;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

const TextInput: React.FC<Props> = React.memo((props) => {
  return (
    <TextField
      fullWidth={props.fullWidth}
      label={props.label}
      margin="dense"
      multiline={props.multiline}
      required={props.required}
      rows={props.rows}
      type={props.type}
      name={props.name}
      inputRef={props.inputRef}
      error={props.error}
      helperText={props.helperText}
      disabled={props.disabled}
      placeholder={props.placeholder}
      InputLabelProps={props.InputLabelProps}
      onChange={props.onChange}
    />
  );
});

export default TextInput;
