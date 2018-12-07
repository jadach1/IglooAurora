import React from "react"
import { graphql } from "react-apollo"
import gql from "graphql-tag"
import Button from "@material-ui/core/Button"
import Dialog from "@material-ui/core/Dialog"
import DialogTitle from "@material-ui/core/DialogTitle"
import DialogActions from "@material-ui/core/DialogActions"
import Grow from "@material-ui/core/Grow"
import Slide from "@material-ui/core/Slide"
import RadioGroup from "@material-ui/core/RadioGroup"
import Radio from "@material-ui/core/Radio"
import FormControlLabel from "@material-ui/core/FormControlLabel"

const MOBILE_WIDTH = 600

function Transition(props) {
  return window.innerWidth > MOBILE_WIDTH ? (
    <Grow {...props} />
  ) : (
    <Slide direction="up" {...props} />
  )
}

class ChangeBoard extends React.Component {
  state = { newBoard: this.props.device.board.id }

  changeBoard = value => {
    this.props["ChangeBoard"]({
      variables: {
        id: this.props.device.id,
        boardId: value,
      },
      optimisticResponse: {
        __typename: "Mutation",
        device: {
          __typename: this.props.device.__typename,
          id: this.props.device.id,
          boardId: value,
        },
      },
    })
  }

  render() {
    return (
      <Dialog
        open={this.props.open}
        onClose={this.props.close}
        TransitionComponent={Transition}
        fullScreen={window.innerWidth < MOBILE_WIDTH}
        className="notSelectable defaultCursor"
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle disableTypography>Change board</DialogTitle>
        <RadioGroup
          onChange={(event, value) => {
            this.setState({ newBoard: value })
            this.changeBoard(value)
          }}
          value={this.state.newBoard || this.props.device.board.id}
          style={{ paddingLeft: "24px", paddingRight: "24px" }}
        >
          {this.props.boards &&
            this.props.boards
              .sort(function(a, b) {
                return a.myRole === "ONWER"
                  ? b.myRole === "OWNER"
                    ? 0
                    : -1
                  : b.myRole === "OWNER"
                  ? 1
                  : 0
              })
              .map(board => (
                <FormControlLabel
                  control={<Radio color="primary" />}
                  value={board.id}
                  label={board.name}
                  disabled={board.myRole !== "OWNER"}
                />
              ))}
        </RadioGroup>
        <DialogActions>
          <Button onClick={this.props.close}>Close</Button>
        </DialogActions>
      </Dialog>
    )
  }
}

export default graphql(
  gql`
    mutation ChangeBoard($id: ID!, $boardId: ID!) {
      moveDevice(deviceId: $id, newBoardId: $boardId) {
        id
      }
    }
  `,
  {
    name: "ChangeBoard",
  }
)(ChangeBoard)
