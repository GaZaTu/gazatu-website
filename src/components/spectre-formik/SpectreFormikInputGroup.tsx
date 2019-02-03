import * as React from "react";
import { hot } from "react-hot-loader";
import SpectreInputGroup from "../spectre/SpectreInputGroup";
import SpectreFormikInput from "./SpectreFormikInput";
import SpectreFormikSelect from "./SpectreFormikSelect";
import { reactNodeIsComponent } from "../../utils";

interface Props extends React.ComponentProps<typeof SpectreInputGroup> { }

class SpectreFormikInputGroup extends React.PureComponent<Props> {
  render() {
    return (
      <SpectreInputGroup {...(this.props as any)} getPropsForChild={this.getPropsForChild} />
    )
  }

  getPropsForChild = (node: React.ReactNode) => {
    const { size } = this.props

    if (reactNodeIsComponent(node, SpectreFormikInput)) {
      return {
        inputSize: size,
      }
    } else if (reactNodeIsComponent(node, SpectreFormikSelect)) {
      return {
        inputSize: size,
      }
    } else {
      return null
    }
  }
}

export default hot(module)(SpectreFormikInputGroup)
