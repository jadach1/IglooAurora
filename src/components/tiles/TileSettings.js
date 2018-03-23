import React from "react"
import Dialog from "material-ui/Dialog"
import Button from "material-ui-next/Button"
import { Tabs, Tab } from "material-ui/Tabs"
import FontIcon from "material-ui/FontIcon"
import SwipeableViews from "react-swipeable-views"

export default class TileSettings extends React.Component {
  state = {
    slideIndex: 0,
    value: 1,
  }

  handleChange = value => {
    this.setState({
      slideIndex: value,
    })
  }
  render() {
    return (
      <Dialog
        actions={[
          <Button label="Close" onClick={this.props.handleClose} />,
        ]}
        modal={false}
        open={this.props.isOpen}
        onRequestClose={this.props.handleClose}
        className="notSelectable"
        contentStyle={{ width: "520px" }}
        bodyStyle={{ padding: "0" }}
      >
        <Tabs
          inkBarStyle={{
            background: "ff4081 ",
            height: "3px",
            marginTop: "-3px",
          }}
          onChange={this.handleChange}
          value={this.state.slideIndex}
        >
          <Tab
            icon={<FontIcon className="material-icons">dashboard</FontIcon>}
            label="Interface"
            buttonStyle={{ backgroundColor: "#0057cb" }}
            value={0}
          />
          <Tab
            icon={<i class="material-icons">import_export</i>}
            label="Data"
            buttonStyle={{ backgroundColor: "#0057cb" }}
            value={1}
          />
        </Tabs>
        <SwipeableViews
          index={this.state.slideIndex}
          onChangeIndex={this.handleChange}
          enableMouseEvents
          style={{
            overflowY: "auto",
            height: "500px",
          }}
        >
          {this.props.interface}
          {this.props.data}
        </SwipeableViews>
      </Dialog>
    )
  }
}
