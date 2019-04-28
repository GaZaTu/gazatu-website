import * as React from "react";
import { FormikProps } from "formik";
import SpectreForm from "../spectre/SpectreForm";
import { ProtoOf } from "../../utils";

export function provide<Self extends React.Component>() {
  return <T extends Self, K extends keyof T>
    (proto: ProtoOf<T>, key: K, descriptor: TypedPropertyDescriptor<(...args: any[]) => any>) => {
    const method = descriptor.value!
    const render = proto.render

    const renderSingleProvider = (self: T, Provider: React.ProviderExoticComponent<React.ProviderProps<any>> | undefined, remaining: { context: React.Context<any>, value: any }[], value: any) => {
      if (Provider) {
        return (
          <Provider value={value}>
            {renderSingleProvider(self, remaining[0].context.Provider, remaining.slice(1), remaining[0].value)}
          </Provider>
        )
      } else {
        return render.apply(self)
      }
    }

    proto.render = function (this: T) {
      const providers = method.apply(this) as { context: React.Context<any>, value: any }[]

      return renderSingleProvider(this, providers[0].context.Provider, providers.slice(1), providers[0].value)
    }
  }
}

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

  // @provide()
  // provide() {
  //   return [
  //     {
  //       context: SpectreFormikFormContext,
  //       value: {
  //         formik: this.props.formik,
  //       },
  //     },
  //   ]
  // }
}

interface Context {
  formik: FormikProps<any>
}

export const SpectreFormikFormContext = React.createContext<Context | undefined>(undefined)
