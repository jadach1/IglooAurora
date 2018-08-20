import React from "react"
import Dialog from "material-ui/Dialog"
import Button from "material-ui-next/Button"
import { MuiThemeProvider, createMuiTheme } from "material-ui-next/styles"
import { graphql } from "react-apollo"
import gql from "graphql-tag"

const theme = createMuiTheme({
  palette: {
    primary: { main: "#f44336" },
  },
})

class DeleteDevice extends React.Component {
  deleteDeviceMutation = () => {
    this.props["DeleteDevice"]({
      variables: {
        id: this.props.device.id,
      },
      optimisticResponse: {
        __typename: "Mutation",
        deleteBoard: {
          id: this.props.device.id,
        },
      },
    })
    this.props.close()
  }

  render() {
    const deleteDeviceActions = [
      <MuiThemeProvider theme={theme}>
        <Button onClick={this.props.close} style={{ marginRight: "4px" }}>
          Never mind
        </Button>
        <Button
          variant="raised"
          color="primary"
          primary={true}
          buttonStyle={{ backgroundColor: "#f44336" }}
          onClick={this.deleteDeviceMutation}
        >
          Delete
        </Button>
      </MuiThemeProvider>,
    ]

    return (
      <Dialog
        title="Delete device"
        actions={deleteDeviceActions}
        open={this.props.open}
        onRequestClose={this.props.close}
        className="notSelectable defaultCursor"
        contentStyle={{
          width: "350px",
        }}
        titleClassName="notSelectable defaultCursor"
      >
        Be careful, this device will be deleted permanently.
        <br />
        <br />
        Note that by deleting a device, you will delete all of its values.
      </Dialog>
    )
  }
}

export default graphql(
  gql`
    mutation DeleteDevice($id: ID!) {
      deleteDevice(id: $id)
    }
  `,
  {
    name: "DeleteDevice",
  }
)(DeleteDevice)
