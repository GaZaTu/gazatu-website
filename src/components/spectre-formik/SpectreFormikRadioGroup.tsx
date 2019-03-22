import * as React from "react";
import { FormikProps } from "formik";
import SpectreRadioGroup from "../spectre/SpectreRadioGroup";
import { SpectreFormikFormContext } from "./SpectreFormikForm";
import { SpectreFormikFormGroupContext } from "./SpectreFormikFormGroup";

interface Props extends React.ComponentProps<typeof SpectreRadioGroup> {
  required?: boolean
}

export default class SpectreFormikRadioGroup extends React.PureComponent<Props> {
  render() {
    return (
      <SpectreFormikFormContext.Consumer>
        {form => (
          <SpectreFormikFormGroupContext.Consumer>
            {formGroup => (
              this.renderRadioGroup(form && form.formik, formGroup && formGroup.name)
            )}
          </SpectreFormikFormGroupContext.Consumer>
        )}
      </SpectreFormikFormContext.Consumer>
    )
  }

  renderRadioGroup(formik?: FormikProps<any>, name?: string) {
    const { required, ...nativeProps } = this.props
    const formikProps = (formik && name) ? {
      name: name,
      value: formik.values[name],
      error: formik.touched[name] && formik.errors[name],
      onChange: formik.handleChange,
      onBlur: formik.handleBlur,
    } : {}

    if (formik && name) {
      if (required && formik.touched[name] && !formik.errors[name] && !formik.values[name]) {
        formik.setFieldError(name, "required")
      }
    }

    return (
      <SpectreRadioGroup {...(nativeProps as any)} {...formikProps} />
    )
  }
}
