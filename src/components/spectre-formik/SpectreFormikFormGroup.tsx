import * as React from "react";
import SpectreFormGroup from "../spectre/SpectreFormGroup";
import { SpectreFormikFormContext } from "./SpectreFormikForm";
import { FormikProps } from "formik";

interface Props extends React.ComponentProps<typeof SpectreFormGroup> {
  name: string
}

export default class SpectreFormikFormGroup extends React.PureComponent<Props> {
  render() {
    return (
      <SpectreFormikFormContext.Consumer>
        {form => (
          this.renderContent(form && form.formik)
        )}
      </SpectreFormikFormContext.Consumer>
    )
  }

  renderContent(formik?: FormikProps<any>) {
    const { children, name, ...nativeProps } = this.props
    const error = (formik && formik.touched[name]) ? formik.errors[name] : undefined

    return (
      <SpectreFormikFormGroupContext.Provider value={{ name }}>
        <SpectreFormGroup {...(nativeProps as any)} hint={nativeProps.hint || error} error={nativeProps.error || error}>
          {children}
        </SpectreFormGroup>
      </SpectreFormikFormGroupContext.Provider>
    )
  }
}

interface Context {
  name: string
}

export const SpectreFormikFormGroupContext = React.createContext<Context | undefined>(undefined)
