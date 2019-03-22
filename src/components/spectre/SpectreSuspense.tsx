import * as React from "react";

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>

const SpectreSuspense = (props: Omit<React.SuspenseProps, "fallback">) => (
  <React.Suspense {...props} fallback={<div className="loading loading-lg" />} />
)

export default SpectreSuspense
