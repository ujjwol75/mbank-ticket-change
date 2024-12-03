import { TextField } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";

<DatePicker
  label="Date of Birth"
  value={formik.values.dateOfBirth}
  onChange={(newValue) => {
    formik.setFieldValue('dateOfBirth', newValue);
  }}
  renderInput={(params) => (
    <TextField
      {...params}
      error={Boolean(formik.touched.dateOfBirth && formik.errors.dateOfBirth)}
      helperText={formik.touched.dateOfBirth && formik.errors.dateOfBirth}
    />
  )}
/>
