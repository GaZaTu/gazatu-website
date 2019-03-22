import * as React from "react";
import { FormikProps } from "formik";
import SpectreForm from "../spectre/SpectreForm";

interface Props extends React.ComponentProps<typeof SpectreForm> {
  formik: FormikProps<any>
}

export default class SpectreFormikForm extends React.PureComponent<Props> {
  render() {
    const { children, formik, ...nativeProps } = this.props

    return (
      <SpectreFormikFormContext.Provider value={{ formik }}>
        <SpectreForm {...(nativeProps as any)} onReset={formik.handleReset} onSubmit={formik.handleSubmit}>
          {children}
          {/* {formik.error && (<p className="form-input-hint text-error">{formik.error}</p>)} */}
        </SpectreForm>
      </SpectreFormikFormContext.Provider>
    )
  }
}

interface Context {
  formik: FormikProps<any>
}

export const SpectreFormikFormContext = React.createContext<Context | undefined>(undefined)
