import * as React from "react";
import { FormikProps } from "formik";
import SpectreButton from "../spectre/SpectreButton";

interface Props extends React.ComponentProps<typeof SpectreButton> {
  formik: FormikProps<any>
}

export default class SpectreFormikButton extends React.PureComponent<Props> {
  render() {
    const { formik, ...nativeProps } = this.props
    const loading = nativeProps.loading || formik.isSubmitting
    const disabled = nativeProps.disabled || (nativeProps.type === "submit" && !formik.isValid)

    return (
      <SpectreButton {...(nativeProps as any)} loading={loading} disabled={disabled} />
    )
  }
}
