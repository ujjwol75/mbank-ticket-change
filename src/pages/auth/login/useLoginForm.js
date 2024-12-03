import { useFormik } from "formik";
import { useDispatch } from "react-redux";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { auth } from "../../../redux/actions/auth/auth";

const loginSchema = Yup.object().shape({
  email: Yup.string().email("Enter valid email address").required("Required"),
  password: Yup.string().required("Required"),
});

export const useLoginForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: loginSchema,
    enableReinitialize: true,

    onSubmit: (values) => {
      if (values.email && values.password) {
        dispatch(auth(values.email, values.password, navigate));
      }
    },
  });

  return { formik };
};
