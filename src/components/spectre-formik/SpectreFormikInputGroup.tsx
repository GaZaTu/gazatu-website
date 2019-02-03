import * as React from "react";
import { hot } from "react-hot-loader";
import SpectreInputGroup from "../spectre/SpectreInputGroup";
import SpectreFormikInput from "./SpectreFormikInput";
import SpectreFormikSelect from "./SpectreFormikSelect";

interface Props extends React.ComponentProps<typeof SpectreInputGroup> { }

class SpectreFormikInputGroup extends React.PureComponent<Props> {
  render() {
    return (
      <SpectreInputGroup {...(this.props as any)} getPropsForChild={this.getPropsForChild} />
    )
  }

  getPropsForChild = (elem: React.ReactElement<any>, prototype: any) => {
    const { size } = this.props

    if (prototype instanceof SpectreFormikInput) {
      return {
        inputSize: size,
      }
    } else if (prototype instanceof SpectreFormikSelect) {
      return {
        inputSize: size,
      }
    } else {
      return null
    }
  }
}

export default hot(module)(SpectreFormikInputGroup)
