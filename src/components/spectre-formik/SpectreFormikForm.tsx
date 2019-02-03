import * as React from "react";
import { hot } from "react-hot-loader";
import { FormikProps } from "formik";
import SpectreForm from "../spectre/SpectreForm";
import SpectreFormikFormGroup from "./SpectreFormikFormGroup";
import { reactNodeIsComponent } from "../../utils";

interface Props extends React.ComponentProps<typeof SpectreForm> {
  formik: FormikProps<any>
}

class SpectreFormikForm extends React.PureComponent<Props> {
  render() {
    const { children, formik, ...nativeProps } = this.props

    return (
      <SpectreForm {...(nativeProps as any)} onReset={formik.handleReset} onSubmit={formik.handleSubmit} getPropsForChild={this.getPropsForChild}>
        {children}
        {/* {formik.error && (<p className="form-input-hint text-error">{formik.error}</p>)} */}
      </SpectreForm>
    )
  }

  getPropsForChild = (node: React.ReactNode) => {
    if (reactNodeIsComponent(node, SpectreFormikFormGroup)) {
      return {
        horizontal: this.props.horizontal,
        formik: this.props.formik,
      }
    } else {
      return null
    }
  }
}

export default hot(module)(SpectreFormikForm)
