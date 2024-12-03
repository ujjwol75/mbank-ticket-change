import React from "react";
import { ErrorMessage } from "formik";
import {
  Grid,
  TextField,
  Checkbox,
  FormControlLabel,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  ListItemText,
  FormHelperText,
} from "@mui/material";
import DynamicSelection from "./DynamicSelection";
import { DatePicker } from "@mui/x-date-pickers";

const RenderForm = ({ fields, formik, allowances, options }) => {
  const renderField = ({
    label,
    name,
    type,
    row,
    options,
    required,
    path,
    selectionType,
  }) => {
    const { values, errors, touched, handleChange, handleBlur, setFieldValue } = formik;

    switch (type) {
      case "text":
      case "email":
      case "password":
        return (
          <TextField
            name={name}
            label={label}
            type={type}
            multiline={Boolean(row)}
            rows={row}
            fullWidth
            value={values[name]}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched[name] && Boolean(errors[name])}
            helperText={touched[name] && errors[name]}
            required={required}
          />
        );

      case "checkbox":
        return (
          <FormControlLabel
            control={
              <Checkbox
                name={name}
                color="primary"
                checked={Boolean(values[name])}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            }
            label={label}
          />
        );

      case "select":
        return (
          <FormControl sx={{ width: "100%" }}>
            <InputLabel>{label}</InputLabel>
            <Select
              name={name}
              label={label}
              fullWidth
              value={values[name]}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched[name] && Boolean(errors[name])}
              helperText={touched[name] && errors[name]}
            >
              <MenuItem value="">None</MenuItem>
              {options &&
                options.map((option, index) => (
                  <MenuItem key={index} value={option.id}>
                    {option.value}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        );

      case "multiSelect":
        return (
          <FormControl fullWidth error={touched[name] && Boolean(errors[name])}>
            <InputLabel>{label}</InputLabel>
            <Select
              multiple
              name={name}
              label={label}
              value={values[name] || []}  // Use an array for selected IDs
              onChange={(event) => setFieldValue(name, event.target.value)}  // Update the selected IDs in Formik
              onBlur={handleBlur}
              renderValue={(selected) => {
                if (Array.isArray(allowances) && allowances.length > 0) {
                  return selected
                    .map((value) => {
                      const allowance = allowances.find((a) => a.id === value);
                      return allowance ? allowance.name : "";  // Use 'name' to display in the select
                    })
                    .join(", ");
                }
                return "";  // Display empty if no allowances are selected
              }}
            >
              {allowances && allowances.length > 0 ? (
                allowances.map((allowance) => (
                  <MenuItem key={allowance.id} value={allowance.id}>
                    <Checkbox checked={values[name]?.includes(allowance.id)} />
                    <ListItemText primary={allowance.name} />
                  </MenuItem>
                ))
              ) : (
                <MenuItem value="">No allowances available</MenuItem>
              )}
            </Select>
            {touched[name] && errors[name] && (
              <FormHelperText>{errors[name]}</FormHelperText>
            )}
          </FormControl>
        );

      // case "multiSelect":
      //   return (
      //     <FormControl fullWidth error={touched[name] && Boolean(errors[name])}>
      //       <InputLabel>{label}</InputLabel>
      //       <Select
      //         multiple
      //         name={name}
      //         label={label}
      //         value={values[name] || []}  // Default to an empty array if no allowances are selected
      //         onChange={(event) => setFieldValue(name, event.target.value)}  // Handle multi-select changes
      //         onBlur={handleBlur}
      //         renderValue={(selected) => {
      //           // If allowances are available, map selected values to allowance names
      //           if (Array.isArray(allowances) && allowances.length > 0) {
      //             return selected
      //               .map((value) => {
      //                 const allowance = allowances.find((a) => a.id === value);
      //                 return allowance ? allowance.name : "";  // Use 'name' instead of 'type'
      //               })
      //               .join(", ");
      //           }
      //           return "";  // Return empty string if allowances aren't available
      //         }}
      //       >
      //         {/* Render MenuItems for each allowance */}
      //         {allowances && allowances.length > 0 ? (
      //           allowances.map((allowance) => (
      //             <MenuItem key={allowance.id} value={allowance.id}>
      //               <Checkbox checked={values[name]?.includes(allowance.id)} />
      //               <ListItemText primary={allowance.name} />  {/* Use 'name' instead of 'type' */}
      //             </MenuItem>
      //           ))
      //         ) : (
      //           <MenuItem value="">Loading...</MenuItem>
      //         )}
      //       </Select>
      //       {touched[name] && errors[name] && (
      //         <FormHelperText>{errors[name]}</FormHelperText>
      //       )}
      //     </FormControl>
      //   );

      case "datePicker":
        return (
          <DatePicker
            label={label}
            value={values[name] ? new Date(values[name]) : null}
            onChange={(newValue) => {
              setFieldValue(name, newValue);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                error={touched[name] && Boolean(errors[name])}
                helperText={touched[name] && errors[name]}
                fullWidth
                margin="normal"
                onBlur={handleBlur}
              />
            )}
          />
        );

      case "dymaicDropDown":
        console.log("dynamic dropdown:", values[name])
        return (
          <DynamicSelection
            label={label}
            value={values[name]}
            formik={formik}
            path={path}
            onBlur={handleBlur}
            required={required}
            name={name}
            selectionType={selectionType}
          />
        );

      default:
        return null;
    }
  };

  return (
    <Grid container spacing={2}>
      {fields?.map((fieldConfig) => (
        <Grid item xs={fieldConfig.col} key={fieldConfig.name}>
          {renderField(fieldConfig)}
        </Grid>
      ))}
    </Grid>
  );
};

export default React.memo(RenderForm);
