import React from "react"
import Dialog from "material-ui/Dialog"
import Button from "material-ui-next/Button"
import { Step, Stepper, StepButton, StepContent } from "material-ui/Stepper"
import TextField from "material-ui/TextField"
import { MuiThemeProvider, createMuiTheme } from "material-ui-next/styles"

const theme = createMuiTheme({
  palette: {
    primary: { main: "#0083ff" },
  },
})

const twoFactorDialogContentStyle = {
  width: "420px",
}

const StepActions = ({ step, handleNext, handlePrev }) => (
  <MuiThemeProvider theme={theme}>
    <div style={{ margin: "12px 0" }}>
      <Button
        variant="raised"
        color="primary"
        buttonStyle={{ backgroundColor: "#0083ff" }}
        disableTouchRipple={true}
        disableFocusRipple={true}
        primary={true}
        onClick={handleNext}
        style={{ marginRight: 12 }}
      >
        Next
      </Button>
      {step > 0 && (
        <Button
          disableTouchRipple={true}
          disableFocusRipple={true}
          onClick={handlePrev}
        >
          Back
        </Button>
      )}
    </div>
  </MuiThemeProvider>
)

export default class TwoFactorDialog extends React.Component {
  state = { stepIndex: 0 }
  handleNext = () => {
    this.setState(({ stepIndex }) => ({
      stepIndex: stepIndex < 4 ? stepIndex + 1 : stepIndex,
    }))
  }

  handlePrev = () => {
    this.setState(({ stepIndex }) => ({
      stepIndex: stepIndex > 0 ? stepIndex - 1 : stepIndex,
    }))
  }

  render() {
    return (
      <Dialog
        title="Enable two-factor authentication"
        actions={[
          <Button onClick={this.props.handleTwoFactorDialogClose}>
            Close
          </Button>,
        ]}
        open={this.props.isOpen}
        contentStyle={twoFactorDialogContentStyle}
        onRequestClose={this.props.handleTwoFactorDialogClose}
        className="notSelectable"
        bodyStyle={{ padding: "8px" }}
      >
        <div
          style={{
            height: 400,
            margin: "auto",
          }}
        >
          <Stepper activeStep={this.state.stepIndex} orientation="vertical">
            <Step>
              <StepButton onClick={() => this.setState({ stepIndex: 0 })}>
                Type in your password
              </StepButton>
              <StepContent>
                <TextField
                  floatingLabelShrinkStyle={{ color: "#0083ff" }}
                  underlineFocusStyle={{ borderColor: "#0083ff" }}
                  floatingLabelText="Password"
                  type="password"
                  style={{ width: "100%" }}
                />
                {
                  <StepActions
                    step={0}
                    handlePrev={this.handlePrev}
                    handleNext={this.handleNext}
                  />
                }
              </StepContent>
            </Step>
            <Step>
              <StepButton onClick={() => this.setState({ stepIndex: 1 })}>
                Save your recovery codes
              </StepButton>
              <StepContent>
                <br />
                aaaaa-11111
                <br />
                <br />
                <Button icon={<i className="material-icons">file_download</i>}>
                  Save
                </Button>
                <Button icon={<i className="material-icons">content_copy</i>}>
                  Copy
                </Button>
                <Button icon={<i className="material-icons">print</i>}>
                  Print
                </Button>
                {
                  <StepActions
                    step={1}
                    handlePrev={this.handlePrev}
                    handleNext={this.handleNext}
                  />
                }
              </StepContent>
            </Step>
            <Step>
              <StepButton onClick={() => this.setState({ stepIndex: 2 })}>
                Get the app
              </StepButton>
              <StepContent>
                {
                  <StepActions
                    step={2}
                    handlePrev={this.handlePrev}
                    handleNext={this.handleNext}
                  />
                }
              </StepContent>
            </Step>
            <Step>
              <StepButton onClick={() => this.setState({ stepIndex: 3 })}>
                Scan the barcode on your app
              </StepButton>
              <StepContent>
                {
                  <StepActions
                    step={3}
                    handlePrev={this.handlePrev}
                    handleNext={this.handleNext}
                  />
                }
              </StepContent>
            </Step>
            <Step>
              <StepButton onClick={() => this.setState({ stepIndex: 4 })}>
                Enter the six-digit code
              </StepButton>
              <StepContent>
                {
                  <StepActions
                    step={4}
                    handlePrev={this.handlePrev}
                    handleNext={this.handleNext}
                  />
                }
              </StepContent>
            </Step>
          </Stepper>
        </div>
      </Dialog>
    )
  }
}
