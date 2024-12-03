import { Autocomplete, CircularProgress, TextField } from "@mui/material";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDropDown } from "../redux/actions/dropdown/fetchDropDown";

const DynamicSelection = ({
  formik,
  label,
  value,
  path,
  onBlur,
  name,
  required,
  selectionType = "id",
}) => {
  const [open, setOpen] = React.useState(false);

  const dropDownList = useSelector((state) => state?.dropDown?.dropDownList);
  const isLoading = useSelector((state) => state?.dropDown?.loading);
  const dispatch = useDispatch();

  useEffect(() => {
    if (path) {
      dispatch(fetchDropDown(path));
    }
  }, [path, dispatch]);

  const options = dropDownList?.map((d) => ({
    label: d?.name || '', // Ensure label is a string
    value: d?.id
  }));
  console.log("options", options)
  console.log("second options:",options?.find((d) => d.value === value) )

  return (
    <Autocomplete
      options={options}
      open={open}
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      getOptionLabel={(option) => option.label || ''} // Ensure label is always a string
      value={value && options?.find((d) => d.value === value) || null} // Ensure value is an object
      onBlur={onBlur}
      onChange={(e, selectedOption) => {
        formik.setFieldValue(name, selectedOption ? selectedOption.value : '');
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <React.Fragment>
                {isLoading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </React.Fragment>
            ),
          }}
          error={formik?.touched[name] && Boolean(formik?.errors[name])}
          helperText={formik?.touched[name] && formik.errors[name]}
          required={required}
        />
      )}
    />
  );
};

export default React.memo(DynamicSelection);
