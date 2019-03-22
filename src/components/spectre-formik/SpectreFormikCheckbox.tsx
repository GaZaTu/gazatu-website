import * as React from "react";
import { FormikProps } from "formik";
import SpectreCheckbox from "../spectre/SpectreCheckbox";

interface Props extends React.ComponentProps<typeof SpectreCheckbox> {
  formik?: FormikProps<any>
  name?: string
}

export default class SpectreFormikCheckbox extends React.PureComponent<Props> {
  render() {
    const { formik, name, ...nativeProps } = this.props
    const formikProps = (formik && name) ? {
      name: name,
      checked: formik.values[name],
      error: formik.touched[name] && formik.errors[name],
      onChange: formik.handleChange,
      onBlur: formik.handleBlur,
    } : {}

    if (formik && name) {
      if (nativeProps.required && formik.touched[name] && !formik.errors[name] && !formik.values[name]) {
        formik.setFieldError(name, "required")
      }
    }

    return (
      <SpectreCheckbox {...(nativeProps as any)} {...formikProps} />
    )
  }
}
