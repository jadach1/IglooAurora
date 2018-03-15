import React from "react"
import Dialog from "material-ui/Dialog"
import FlatButton from "material-ui/FlatButton"
import RaisedButton from "material-ui/RaisedButton"
import { RadioButton, RadioButtonGroup } from "material-ui/RadioButton"
import DropDownMenu from "material-ui/DropDownMenu"
import MenuItem from "material-ui/MenuItem"

export default class TimeZoneDialog extends React.Component {
  state = {
    value: 1,
    menuDisabled: true,
  }

  handleChange = (event, index, value) => this.setState({ value })

  render() {
    const timeZoneActions = [
      <FlatButton label="Close" onClick={this.props.handleTimeDialogClose} />,
    ]

    return (
      <Dialog
        title="Change time zone"
        actions={timeZoneActions}
        open={this.props.timeZoneDialogOpen}
        onRequestClose={this.props.handleTimeDialogClose}
        className="notSelectable"
        contentStyle={{
          width: "350px",
        }}
        bodyStyle={{
          paddingBottom: "0px",
        }}
      >
        <RadioButtonGroup name="Time Zone" defaultSelected="auto">
          <RadioButton
            value="auto"
            label="Auto (GMT+01:00)"
            style={{
              marginTop: 12,
              marginBottom: 16,
            }}
            onClick={() => this.setState({ menuDisabled: true })}
            rippleStyle={{ color: "#0083ff" }}
            checkedIcon={
              <i class="material-icons" style={{ color: "#0083ff" }}>
                radio_button_checked
              </i>
            }
            uncheckedIcon={<i class="material-icons">radio_button_unchecked</i>}
          />
          <RadioButton
            value="manual"
            label="Manual"
            onClick={() => this.setState({ menuDisabled: false })}
            style={{
              marginBottom: 16,
            }}
            rippleStyle={{ color: "#0083ff" }}
            checkedIcon={
              <i class="material-icons" style={{ color: "#0083ff" }}>
                radio_button_checked
              </i>
            }
            uncheckedIcon={<i class="material-icons">radio_button_unchecked</i>}
          />
        </RadioButtonGroup>
        <DropDownMenu
          value={this.state.value}
          onChange={this.handleChange}
          disabled={this.state.menuDisabled}
          onChange={this.handleChange}
          maxHeight={250}
          style={{ width: "302px" }}
          anchorOrigin={{ horizontal: "middle", vertical: "top" }}
          targetOrigin={{ horizontal: "middle", vertical: "top" }}
        >
          <MenuItem value={1} primaryText="(GMT-11:00) Niue" />
          <MenuItem value={2} primaryText="(GMT-11:00) Pago Pago" />
          <MenuItem value={3} primaryText="(GMT-10:00) Hawaii" />
          <MenuItem value={4} primaryText="(GMT-10:00) Rarotonga" />
          <MenuItem value={5} primaryText="(GMT-10:00) Tahiti" />
          <MenuItem value={6} primaryText="(GMT-09:30) Marquesas" />
          <MenuItem value={7} primaryText="(GMT-09:00) Gambier" />
          <MenuItem value={8} primaryText="(GMT-08:00) Alaska" />
          <MenuItem value={9} primaryText="(GMT-08:00) Pitcairn" />
          <MenuItem value={10} primaryText="(GMT-07:00) Arizona" />
          <MenuItem value={11} primaryText="(GMT-07:00) Chihuahua, Mazatlan" />
          <MenuItem value={12} primaryText="(GMT-07:00) Dawson Creek" />
          <MenuItem value={13} primaryText="(GMT-07:00) Hermosillo" />
          <MenuItem value={14} primaryText="(GMT-07:00) Pacific Time" />
          <MenuItem value={15} primaryText="(GMT-07:00) Tijuana" />
          <MenuItem value={16} primaryText="(GMT-07:00) Vancouver" />
          <MenuItem value={17} primaryText="(GMT-07:00) Whitehorse" />
          <MenuItem value={18} primaryText="(GMT-06:00) Belize" />
          <MenuItem value={19} primaryText="(GMT-06:00) Mexico City" />
          <MenuItem value={20} primaryText="(GMT-06:00) Regina" />
          <MenuItem value={21} primaryText="(GMT-06:00) Tegucigalpa" />
          <MenuItem value={22} primaryText="(GMT-06:00) Costa Rica" />
          <MenuItem value={23} primaryText="(GMT-06:00) El Salvador" />
          <MenuItem value={24} primaryText="(GMT-06:00) Galapagos" />
          <MenuItem value={25} primaryText="(GMT-06:00) Guatemala" />
          <MenuItem value={26} primaryText="(GMT-06:00) Managua" />
          <MenuItem value={27} primaryText="(GMT-06:00) Mountain Time" />
          <MenuItem value={28} primaryText="(GMT-06:00) Edmonton" />
          <MenuItem value={29} primaryText="(GMT-06:00) Yellowknife" />
          <MenuItem value={30} primaryText="(GMT-05:00) America Cancun" />
          <MenuItem value={31} primaryText="(GMT-05:00) Bogota" />
          <MenuItem value={32} primaryText="(GMT-05:00) Central Time" />
          <MenuItem value={32} primaryText="(GMT-05:00) Winnipeg" />
          <MenuItem value={33} primaryText="(GMT-05:00) Easter Island" />
          <MenuItem value={34} primaryText="(GMT-05:00) Guayaquil" />
          <MenuItem value={34} primaryText="(GMT-05:00) Jamaica" />
          <MenuItem value={35} primaryText="(GMT-05:00) Lima" />
          <MenuItem value={36} primaryText="(GMT-05:00) Panama" />
          <MenuItem value={37} primaryText="(GMT-05:00) Rio Branco" />
          <MenuItem value={38} primaryText="(GMT-04:00) Barbados" />
          <MenuItem value={39} primaryText="(GMT-04:00) Boa Vista" />
          <MenuItem value={40} primaryText="(GMT-04:00) Campo Grande" />
          <MenuItem value={41} primaryText="(GMT-04:00) Caracas" />
          <MenuItem value={42} primaryText="(GMT-04:00) Cuiaba" />
          <MenuItem value={43} primaryText="(GMT-04:00) Curacao" />
          <MenuItem value={44} primaryText="(GMT-04:00) Eastern Time" />
          <MenuItem value={45} primaryText="(GMT-04:00) Iqaluit" />
          <MenuItem value={46} primaryText="(GMT-04:00) Toronto" />
          <MenuItem value={47} primaryText="(GMT-04:00) Grand Turk" />
          <MenuItem value={48} primaryText="(GMT-04:00) Guyana" />
          <MenuItem value={49} primaryText="(GMT-04:00) Havana" />
          <MenuItem value={50} primaryText="(GMT-04:00) La Paz" />
          <MenuItem value={51} primaryText="(GMT-04:00) Manaus" />
          <MenuItem value={52} primaryText="(GMT-04:00) Martinique" />
          <MenuItem value={53} primaryText="(GMT-04:00) Nassau" />
          <MenuItem value={54} primaryText="(GMT-04:00) Port of Spain" />
          <MenuItem value={55} primaryText="(GMT-04:00) Port-au-Prince" />
          <MenuItem value={56} primaryText="(GMT-04:00) Porto Velho" />
          <MenuItem value={57} primaryText="(GMT-04:00) Puerto Rico" />
          <MenuItem value={58} primaryText="(GMT-04:00) Santo Domingo" />
          <MenuItem value={59} primaryText="(GMT-03:00) Araguaina" />
          <MenuItem value={60} primaryText="(GMT-03:00) Asuncion" />
          <MenuItem value={61} primaryText="(GMT-03:00) Halifax" />
          <MenuItem value={62} primaryText="(GMT-03:00) Belem" />
          <MenuItem value={63} primaryText="(GMT-03:00) Bermuda" />
          <MenuItem value={64} primaryText="(GMT-03:00) Buenos Aires" />
          <MenuItem value={65} primaryText="(GMT-03:00) Cayenne" />
          <MenuItem value={66} primaryText="(GMT-03:00) Fortaleza" />
          <MenuItem value={67} primaryText="(GMT-03:00) Godthab" />
          <MenuItem value={68} primaryText="(GMT-03:00) Maceio" />
          <MenuItem value={69} primaryText="(GMT-03:00) Montevideo" />
          <MenuItem value={70} primaryText="(GMT-03:00) Palmer" />
          <MenuItem value={71} primaryText="(GMT-03:00) Paramaribo" />
          <MenuItem value={72} primaryText="(GMT-03:00) Punta Arenas" />
          <MenuItem value={73} primaryText="(GMT-03:00) Recife" />
          <MenuItem value={74} primaryText="(GMT-03:00) Rothera" />
          <MenuItem value={75} primaryText="(GMT-03:00) Salvador" />
          <MenuItem value={76} primaryText="(GMT-03:00) Santiago" />
          <MenuItem value={77} primaryText="(GMT-03:00) Sao Paulo" />
          <MenuItem value={78} primaryText="(GMT-03:00) Stanley" />
          <MenuItem value={79} primaryText="(GMT-03:00) Thule" />
          <MenuItem value={80} primaryText="(GMT-02:30) St. Johns" />
          <MenuItem value={81} primaryText="(GMT-02:00) Miquelon" />
          <MenuItem value={82} primaryText="(GMT-02:00) Noronha" />
          <MenuItem value={83} primaryText="(GMT-02:00) South Georgia" />
          <MenuItem value={84} primaryText="(GMT-01:00) Azores" />
          <MenuItem value={85} primaryText="(GMT-01:00) Cape Verde" />
          <MenuItem value={86} primaryText="(GMT-01:00) Scoresbysund" />
          <MenuItem value={87} primaryText="(GMT+00:00) Abidjan" />
          <MenuItem value={88} primaryText="(GMT+00:00) Accra" />
          <MenuItem value={89} primaryText="(GMT+00:00) Bissau" />
          <MenuItem value={90} primaryText="(GMT+00:00) Canary Islands" />
          <MenuItem value={91} primaryText="(GMT+00:00) Casablanca" />
          <MenuItem value={92} primaryText="(GMT+00:00) Danmarkshavn" />
          <MenuItem value={92} primaryText="(GMT+00:00) Dublin" />
          <MenuItem value={93} primaryText="(GMT+00:00) El Aaiun" />
          <MenuItem value={94} primaryText="(GMT+00:00) Faeroe" />
          <MenuItem value={95} primaryText="(GMT+00:00) Lisbon" />
          <MenuItem value={96} primaryText="(GMT+00:00) London" />
          <MenuItem value={97} primaryText="(GMT+00:00) Monrovia" />
          <MenuItem value={95} primaryText="(GMT+00:00) Reykjavik" />
          <MenuItem value={96} primaryText="UTC" />
        </DropDownMenu>
        <br />
      </Dialog>
    )
  }
}
