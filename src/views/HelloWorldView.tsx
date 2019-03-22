import * as React from "react";
import { RouteComponentProps } from "react-router";
import SpectreInputGroup from "../components/spectre/SpectreInputGroup";
import SpectreInput from "../components/spectre/SpectreInput";
import SpectreButton from "../components/spectre/SpectreButton";
import SpectreSelect from "../components/spectre/SpectreSelect";
import SpectreFormGroup from "../components/spectre/SpectreFormGroup";
import SpectreCheckbox from "../components/spectre/SpectreCheckbox";
import SpectreRadioGroup from "../components/spectre/SpectreRadioGroup";
import SpectreDivider from "../components/spectre/SpectreDivider";
import SpectreIcon from "../components/spectre/SpectreIcon";

interface RouteParams { }

interface Props extends RouteComponentProps<RouteParams> { }

interface State {
  value: string
  bool: boolean
}

export default class HelloWorldView extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      value: "",
      bool: false,
    }
  }

  render() {
    return (
      <div>
        <h3 className="s-title">Test</h3>
        <SpectreInput inputSize="sm" success={true} value={this.state.value} onChange={ev => this.setState({ value: ev.target.value })} />
        <SpectreInput inputSize="md" error={true} value={this.state.value} onChange={ev => this.setState({ value: ev.target.value })} />
        <SpectreInput inputSize="lg" loading={true} />
        <SpectreInput icon="cross" value={this.state.value} onChange={ev => this.setState({ value: ev.target.value })} onIconClick={() => this.setState({ value: "" })} />
        <SpectreInputGroup size="sm">
          <span>test</span>
          <SpectreInput />
          <SpectreSelect value={this.state.value} onChange={ev => this.setState({ value: ev.target.value })}>
            <option>.xls</option>
            <option>.csv</option>
            <option>.xml</option>
          </SpectreSelect>
          <SpectreButton>test</SpectreButton>
        </SpectreInputGroup>
        <SpectreInputGroup size="sm">
          <SpectreSelect value={this.state.value} onChange={ev => this.setState({ value: ev.target.value })}>
            <option>.xls</option>
            <option>.csv</option>
            <option>.xml</option>
          </SpectreSelect>
          <span className="input-group-icon" onClick={() => this.setState({ value: "" })}>
            <SpectreIcon icon="cross" />
          </span>
        </SpectreInputGroup>
        <form className="form-horizontal">
          <fieldset>
            <SpectreFormGroup label="test" hint="invalid input" error={true} size="lg">
              <SpectreInput />
            </SpectreFormGroup>
          </fieldset>
          <SpectreDivider className="text-center" text="test" />
          <fieldset>
            <SpectreFormGroup label="test" error={true} hint="invalid input" horizontal={true}>
              <SpectreRadioGroup value={this.state.value} onChange={ev => this.setState({ value: ev.target.value })}>
                <SpectreCheckbox label="test 1" type="radio" value=".xls" />
                <SpectreCheckbox label="test 2" type="radio" value=".csv" />
                <SpectreCheckbox label="test 3" type="radio" value=".xml" />
              </SpectreRadioGroup>
            </SpectreFormGroup>
          </fieldset>
          {/* <fieldset>
            <SpectreFormGroup error={true} hint="invalid input" horizontal={true}>
              <div className="col-3 col-sm-12">label</div>
              <div className="col-6 col-sm-12">
                <SpectreInput />
              </div>
              <div className="col-3 col-sm-12">hint</div>
            </SpectreFormGroup>
          </fieldset> */}
        </form>
        <SpectreCheckbox label="test" checked={this.state.bool} onChange={ev => this.setState({ bool: ev.target.checked })} />
        <SpectreCheckbox label="test2" />
        <SpectreCheckbox type="switch" checked={this.state.bool} onChange={ev => this.setState({ bool: ev.target.checked })} />
        <SpectreInput inputSize="sm" success={true} value={this.state.value} onChange={ev => this.setState({ value: ev.target.value })} />
        <SpectreInput inputSize="md" error={true} value={this.state.value} onChange={ev => this.setState({ value: ev.target.value })} />
        <SpectreInput inputSize="lg" loading={true} />
        <SpectreInput icon="cross" value={this.state.value} onChange={ev => this.setState({ value: ev.target.value })} onIconClick={() => this.setState({ value: "" })} />
        <SpectreInput inputSize="sm" success={true} value={this.state.value} onChange={ev => this.setState({ value: ev.target.value })} />
        <SpectreInput inputSize="md" error={true} value={this.state.value} onChange={ev => this.setState({ value: ev.target.value })} />
        <SpectreInput inputSize="lg" loading={true} />
        <SpectreInput icon="cross" value={this.state.value} onChange={ev => this.setState({ value: ev.target.value })} onIconClick={() => this.setState({ value: "" })} />
      </div>
    )
  }
}
