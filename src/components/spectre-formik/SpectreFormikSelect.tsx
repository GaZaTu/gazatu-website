import * as React from "react";
import { FormikProps } from "formik";
import SpectreSelect from "../spectre/SpectreSelect";
import { SpectreFormikFormContext } from "./SpectreFormikForm";
import { SpectreFormikFormGroupContext } from "./SpectreFormikFormGroup";

interface Props extends React.ComponentProps<typeof SpectreSelect> { }

export default class SpectreFormikSelect extends React.PureComponent<Props> {
  render() {
    return (
      <SpectreFormikFormContext.Consumer>
        {form => (
          <SpectreFormikFormGroupContext.Consumer>
            {formGroup => (
              this.renderSelect(form && form.formik, formGroup && formGroup.name)
            )}
          </SpectreFormikFormGroupContext.Consumer>
        )}
      </SpectreFormikFormContext.Consumer>
    )
  }

  renderSelect(formik?: FormikProps<any>, name?: string) {
    const { ...nativeProps } = this.props
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
