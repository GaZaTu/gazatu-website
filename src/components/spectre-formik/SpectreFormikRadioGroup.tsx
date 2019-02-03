import * as React from "react";
import { hot } from "react-hot-loader";
import { FormikProps } from "formik";
import SpectreRadioGroup from "../spectre/SpectreRadioGroup";

interface Props extends React.ComponentProps<typeof SpectreRadioGroup> {
  formik?: FormikProps<any>
  name?: string
}

class SpectreFormikRadioGroup extends React.PureComponent<Props> {
  render() {
    const { formik, name, ...nativeProps } = this.props
    const formikProps = (formik && name) ? {
      name: name,
      value: formik.values[name],
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
      <SpectreRadioGroup {...(nativeProps as any)} {...formikProps} />
    )
  }
}

export default hot(module)(SpectreFormikRadioGroup)
