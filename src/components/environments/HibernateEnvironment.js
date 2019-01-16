import React from "react"
import Dialog from "@material-ui/core/Dialog"
import DialogActions from "@material-ui/core/DialogActions"
import DialogTitle from "@material-ui/core/DialogTitle"
import Button from "@material-ui/core/Button"
import Grow from "@material-ui/core/Grow"
import Slide from "@material-ui/core/Slide"
import { graphql } from "react-apollo"
import gql from "graphql-tag"
import withMobileDialog from "@material-ui/core/withMobileDialog"

function GrowTransition(props) {
  return <Grow {...props} />
}

function SlideTransition(props) {
  return <Slide direction="up" {...props} />
}

class HibernateEnvironment extends React.Component {
  hibernateEnvironmentMutation = () => {
    this.props["HibernateEnvironment"]({
      variables: {
        id: this.props.environment.id,
      },
      optimisticResponse: {
        __typename: "Mutation",
        deleteEnvironment: {
          id: this.props.environment.id,
        },
      },
    })
    this.props.close()
  }

  render() {
    return (
      <Dialog
        open={this.props.open}
        onClose={this.props.close}
        TransitionComponent={
          this.props.fullScreen ? SlideTransition : GrowTransition
        }
        fullScreen={this.props.fullScreen}
        disableBackdropClick={this.props.fullScreen}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle disableTypography>Hibernate environment</DialogTitle>
        <font
          style={{ paddingLeft: "24px", paddingRight: "24px", height: "100%" }}
        >
          Be careful, you won't be able to access{" "}
          {this.props.environment && this.props.environment.name} until you
          restore it.
        </font>
        <DialogActions>
          <Button onClick={this.props.close}>Never mind</Button>
          <Button
            variant="contained"
            color="primary"
            onClick={this.deleteEnvironmentMutation}
            style={{ margin: "0 4px" }}
          >
            Hibernate
          </Button>
        </DialogActions>
      </Dialog>
    )
  }
}

export default graphql(
  gql`
    mutation HibernateEnvironment($id: ID!) {
      hibernateEnvironment(id: $id)
    }
  `,
  {
    name: "HibernateEnvironment",
  }
)(withMobileDialog({ breakpoint: "xs" })(HibernateEnvironment))
