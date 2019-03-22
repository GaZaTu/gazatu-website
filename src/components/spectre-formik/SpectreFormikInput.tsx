import * as React from "react";
import { FormikProps } from "formik";
import SpectreInput from "../spectre/SpectreInput";
import { SpectreFormikFormContext } from "./SpectreFormikForm";
import { SpectreFormikFormGroupContext } from "./SpectreFormikFormGroup";

interface Props extends React.ComponentProps<typeof SpectreInput> { }

export default class SpectreFormikInput extends React.PureComponent<Props> {
  render() {
    return (
      <SpectreFormikFormContext.Consumer>
        {form => (
          <SpectreFormikFormGroupContext.Consumer>
            {formGroup => (
              this.renderInput(form && form.formik, formGroup && formGroup.name)
            )}
          </SpectreFormikFormGroupContext.Consumer>
        )}
      </SpectreFormikFormContext.Consumer>
    )
  }

  renderInput(formik?: FormikProps<any>, name?: string) {
    const { ...nativeProps } = this.props
    const formikProps = (formik && name) ? {
      name: name,
      value: formik.values[name],
      error: formik.touched[name] && formik.errors[name],
      success: formik.touched[name] && !formik.errors[name],
      loading: nativeProps.loading || formik.isSubmitting,
      onChange: formik.handleChange,
      onBlur: formik.handleBlur,
    } : {}

    if (formik && name) {
      if (nativeProps.required && formik.touched[name] && !formik.errors[name] && !formik.values[name]) {
        formik.setFieldError(name, "required")
      }
    }

    return (
      <SpectreInput {...(nativeProps as any)} {...formikProps} />
    )
  }
}
