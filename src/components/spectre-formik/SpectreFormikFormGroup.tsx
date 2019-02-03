import * as React from "react";
import { hot } from "react-hot-loader";
import { FormikProps } from "formik";
import SpectreFormGroup from "../spectre/SpectreFormGroup";

interface Props extends React.ComponentProps<typeof SpectreFormGroup> {
  formik?: FormikProps<any>
  name: string
}

class SpectreFormikFormGroup extends React.PureComponent<Props> {
  render() {
    const { children, formik, name, ...nativeProps } = this.props
    const error = (formik && formik.touched[name]) ? formik.errors[name] : undefined

    return (
      <SpectreFormGroup {...(nativeProps as any)} hint={nativeProps.hint || error} error={nativeProps.error || error}>
        {(React.Children.count(children) === 1) ? React.Children.map(children, child =>
          React.cloneElement(child as React.ReactElement<any>, { name, formik })
        ) : children}
      </SpectreFormGroup>
    )
  }
}

export default hot(module)(SpectreFormikFormGroup)
