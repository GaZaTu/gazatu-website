import * as React from "react";
import { FormikProps } from "formik";
import SpectreRadioGroup from "../spectre/SpectreRadioGroup";
import { SpectreFormikFormContext } from "./SpectreFormikForm";
import { SpectreFormikFormGroupContext } from "./SpectreFormikFormGroup";
import { ProtoOf } from "../../utils";

export function consume<Self extends React.Component>(contexts: React.Context<any>[]) {
  return <T extends Self, K extends keyof T>
    (proto: ProtoOf<T>, key: K, descriptor: TypedPropertyDescriptor<(...args: any[]) => any>) => {
    const method = descriptor.value!

    const renderSingleConsumer = (self: T, Consumer: React.ExoticComponent<React.ConsumerProps<any>> | undefined, remaining: React.Context<any>[], values: any[]) => {
      if (Consumer) {
        return (
          <Consumer>
            {value => renderSingleConsumer(self, remaining[0].Consumer, remaining.slice(1), [...values, value])}
          </Consumer>
        )
      } else {
        return method.apply(self, values)
      }
    }

    proto.render = function (this: T) {
      return renderSingleConsumer(this, contexts[0].Consumer, contexts.slice(1), [])
    }
  }
}

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

  // @consume([
  //   SpectreFormikFormContext,
  //   SpectreFormikFormGroupContext,
  // ])
  // consume(
  //   form?: FormContext,
  //   formGroup?: FormGroupContext,
  // ) {

  // }

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
