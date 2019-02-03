import * as React from "react";
import { hot } from "react-hot-loader";
import { FormikProps } from "formik";
import SpectreSelect from "../spectre/SpectreSelect";

interface Props extends React.ComponentProps<typeof SpectreSelect> {
  formik: FormikProps<any>
  name?: string
}

class SpectreFormikSelect extends React.PureComponent<Props> {
  render() {
    const { formik, name, ...nativeProps } = this.props
    const formikProps = (formik && name) ? {
      name: name,
      value: formik.values[name],
      error: formik.touched[name] && formik.errors[name],
      success: formik.touched[name] && !formik.errors[name],
      onChange: formik.handleChange,
      onBlur: formik.handleBlur,
    } : {}

    if (formik && name) {
      if (nativeProps.required && formik.touched[name] && !formik.errors[name] && !formik.values[name]) {
        formik.setFieldError(name, "required")
      }
    }

    return (
      <SpectreSelect {...(nativeProps as any)} {...formikProps} />
    )
  }
}

export default hot(module)(SpectreFormikSelect)
