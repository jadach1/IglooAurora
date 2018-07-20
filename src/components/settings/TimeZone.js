import React from "react"
import Dialog from "material-ui/Dialog"
import Button from "material-ui-next/Button"
import { RadioButton, RadioButtonGroup } from "material-ui/RadioButton"
import DropDownMenu from "material-ui/DropDownMenu"
import MenuItem from "material-ui/MenuItem"
import Icon from "material-ui-next/Icon"
import { graphql } from "react-apollo"
import gql from "graphql-tag"

var moment = require("moment-timezone")

let changeTimezone = () => {}

class TimeZoneDialog extends React.Component {
  state = {
    value: moment.tz.guess().split("/")[1]
      ? "(UTC" +
        moment.tz(moment.tz.guess()).format("Z") +
        ") " +
        moment.tz
          .guess()
          .split("/")[1]
          .replace(/_/g, " ")
      : "",
    menuDisabled: true,
    timeZone: null,
    timezoneMode: "auto",
  }

  handleChange = (event, index, value) => {
    this.setState({
      value,
      timeZone: value.split("UTC")[1].split(")")[0],
    })

    changeTimezone(value)
  }

  render() {
    const {
      userData: { user },
    } = this.props

    const timeZoneActions = [
      <Button onClick={this.props.handleTimeDialogClose}>Close</Button>,
    ]

    let timeZone

    if (user) {
      changeTimezone = timezone =>
        this.props.ChangeTimeZone({
          variables: {
            timezone,
          },
          optimisticResponse: {
            __typename: "Mutation",
            user: {
              id: user.id,
              timezone,
              __typename: "User",
            },
          },
        })

      timeZone = user.timezone
    }

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
        titleClassName="notSelectable defaultCursor"
      >
        <RadioButtonGroup name="Time Zone" value={this.state.timezoneMode}>
          <RadioButton
            value="auto"
            label={
              "Auto: (UTC" +
              moment.tz(moment.tz.guess()).format("Z") +
              ") " +
              moment.tz.guess().split("/")[1]
            }
            style={{
              marginTop: 12,
              marginBottom: 16,
            }}
            onClick={() => {
              this.setState({ menuDisabled: true, timezoneMode: "auto" })
              changeTimezone(
                "(UTC" +
                  moment.tz(moment.tz.guess()).format("Z") +
                  ") " +
                  moment.tz.guess().split("/")[1]
              )
            }}
            rippleStyle={{ color: "#0083ff" }}
            checkedIcon={
              <Icon style={{ color: "#0083ff" }}>radio_button_checked</Icon>
            }
            uncheckedIcon={<Icon>radio_button_unchecked</Icon>}
          />
          <RadioButton
            value="manual"
            label="Manual"
            onClick={() =>
              this.setState({ menuDisabled: false, timezoneMode: "auto" })
            }
            style={{
              marginBottom: 16,
            }}
            rippleStyle={{ color: "#0083ff" }}
            checkedIcon={
              <Icon style={{ color: "#0083ff" }}>radio_button_checked</Icon>
            }
            uncheckedIcon={<Icon>radio_button_unchecked</Icon>}
          />
        </RadioButtonGroup>
        <DropDownMenu
          value={timeZone}
          onChange={this.handleChange}
          disabled={this.state.menuDisabled}
          maxHeight={250}
          style={{ width: "302px" }}
          anchorOrigin={{ horizontal: "middle", vertical: "top" }}
          targetOrigin={{ horizontal: "middle", vertical: "top" }}
        >
          <MenuItem
            value="(UTC-11:00) Midway"
            primaryText="(UTC-11:00) Midway"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC-11:00) Niue"
            primaryText="(UTC-11:00) Niue"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC-11:00) Pago Pago"
            primaryText="(UTC-11:00) Pago Pago"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC-11:00) Samoa"
            primaryText="(UTC-11:00) Samoa"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC-10:00) Hawaii"
            primaryText="(UTC-10:00) Hawaii"
            className="notSelectable"
          />

          <MenuItem
            value="(UTC-10:00) Johnston"
            primaryText="(UTC-10:00) Johnston"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC-10:00) Raratonga"
            primaryText="(UTC-10:00) Raratonga"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC-10:00) Tahiti"
            primaryText="(UTC-10:00) Tahiti"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC-09:30) Marquesas"
            primaryText="(UTC-09:30) Marquesas"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC-09:00) Adak"
            primaryText="(UTC-09:00) Adak"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC-09:00) Aleutian"
            primaryText="(UTC-09:00) Aleutian"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC-09:00) Atka"
            primaryText="(UTC-09:00) Atka"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC-09:00) Gambier"
            primaryText="(UTC-09:00) Gambier"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC-08:00) Alaska"
            primaryText="(UTC-08:00) Alaska"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC-08:00) Metlakatla"
            primaryText="(UTC-08:00) Metlakatla"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC-08:00) Nome"
            primaryText="(UTC-08:00) None"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC-08:00) Pitcairn"
            primaryText="(UTC-08:00) Pitcairn"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC-08:00) Sitka"
            primaryText="(UTC-08:00) Sitka"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC-08:00) Yakutat"
            primaryText="(UTC-08:00) Yakutat"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC-07:00) Baja Norte"
            primaryText="(UTC-07:00) Baja Norte"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC-07:00) Creston"
            primaryText="(UTC-07:00) Creston"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC-07:00) Dawson Creek"
            primaryText="(UTC-07:00) Dawson Creek"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC-07:00) Ensenada"
            primaryText="(UTC-07:00) Ensenada"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC-07:00) Fort Nelson"
            primaryText="(UTC-07:00) Fort Nelson"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC-07:00) Hermosillo"
            primaryText="(UTC-07:00) Hermosillo"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC-07:00) Pacific Time"
            primaryText="(UTC-07:00) Pacific Time"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC-07:00) Santa Isabel"
            primaryText="(UTC-07:00) Santa Isabel"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC-07:00) Tijuana"
            primaryText="(UTC-07:00) Tijuana"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC-07:00) Vancouver"
            primaryText="(UTC-07:00) Vancouver"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC-07:00) Whitehorse"
            primaryText="(UTC-07:00) Whitehorse"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC-06:00) Baja Sur"
            primaryText="(UTC-06:00) Baja Sur"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC-06:00) Belize"
            primaryText="(UTC-06:00) Belize"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC-06:00) Cambridge Bay"
            primaryText="(UTC-06:00) Cambridge Bay"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC-06:00) Chihuahua"
            primaryText="(UTC-06:00) Chihuahua"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC-06:00) Costa Rica"
            primaryText="(UTC-06:00) Costa Rica"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC-06:00) Easter Island"
            primaryText="(UTC-06:00) Easter Island"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC-06:00) Edmonton"
            primaryText="(UTC-06:00) Edmonton"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC-06:00) El Salvador"
            primaryText="(UTC-06:00) El Salvador"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC-06:00) Galapagos"
            primaryText="(UTC-06:00) Galapagos"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC-06:00) Guatemala"
            primaryText="(UTC-06:00) Guatemala"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC-06:00) Inuvik"
            primaryText="(UTC-06:00) Inuvik"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC-06:00) Managua"
            primaryText="(UTC-06:00) Managua"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC-06:00) Mazatlan"
            primaryText="(UTC-06:00) Mazatlan"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC-06:00) Mountain Time"
            primaryText="(UTC-06:00) Mountain Time"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC-06:00) Ojinaga"
            primaryText="(UTC-06:00) Ojinaga"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC-06:00) Regina"
            primaryText="(UTC-06:00) Regina"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC-06:00) Shiprock"
            primaryText="(UTC-06:00) Shiprock"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC-06:00) Swift Current"
            primaryText="(UTC-06:00) Swift Current"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC-06:00) Tegucigalpa"
            primaryText="(UTC-06:00) Tegucigalpa"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC-06:00) Yellowknife"
            primaryText="(UTC-06:00) Yellowknife"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC-05:00) Acre"
            primaryText="(UTC-05:00) Acre"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC-05:00) Bahia Banderas"
            primaryText="(UTC-05:00) Bahia Banderas"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC-05:00) Bogota"
            primaryText="(UTC-05:00) Bogota"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC-05:00) Cancun"
            primaryText="(UTC-05:00) Cancun"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC-05:00) Cayman"
            primaryText="(UTC-05:00) Cayman"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC-05:00) Central Time"
            primaryText="(UTC-05:00) Central Time"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC-05:00) Coral Harbour"
            primaryText="(UTC-05:00) Coral Harbour"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC-05:00) Eirunepe"
            primaryText="(UTC-05:00) Eirunepe"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC-05:00) Guayaquil"
            primaryText="(UTC-05:00) Guayaquil"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC-05:00) Jamaica"
            primaryText="(UTC-05:00) Jamaica"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC-05:00) Lima"
            primaryText="(UTC-05:00) Lima"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC-05:00) Metamoros"
            primaryText="(UTC-05:00) Metamoros"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC-05:00) Menominee"
            primaryText="(UTC-05:00) Jamaica"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC-05:00) Merida"
            primaryText="(UTC-05:00) Merida"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC-05:00) Mexico City"
            primaryText="(UTC-05:00) Maxico City"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC-05:00) Monterrey"
            primaryText="(UTC-05:00) Monterrey"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC-05:00) Panama"
            primaryText="(UTC-05:00) Panama"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC-05:00) Porto Acre"
            primaryText="(UTC-05:00) Porto Acre"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC-05:00) Rainy River"
            primaryText="(UTC-05:00) Rainy River"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC-05:00) Rankin Inlet"
            primaryText="(UTC-05:00) Rankit Inlet"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC-05:00) Resolute"
            primaryText="(UTC-05:00) Resolute"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC-05:00) Rio Branco"
            primaryText="(UTC-05:00) Rio Branco"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC-05:00) Winnipeg"
            primaryText="(UTC-05:00) Winnipeg"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC-04:00) Anguilla"
            primaryText="(UTC-04:00) Anguilla"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC-04:00) Antigua"
            primaryText="(UTC-04:00) Antigua"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC-04:00) Aruba"
            primaryText="(UTC-04:00) Aruba"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC-04:00) Asuncion"
            primaryText="(UTC-04:00) Asuncion"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC-04:00) Barbados"
            primaryText="(UTC-04:00) Barbados"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC-04:00) Blanc-Sablon"
            primaryText="(UTC-04:00) Blanc-Sablo"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC-04:00) Boa Vista"
            primaryText="(UTC-04:00) Boa Vista"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC-04:00) Campo Grande"
            primaryText="(UTC-04:00) Campo Grande"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC-04:00) Caracas"
            primaryText="(UTC-04:00) Caracas"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC-04:00) Cuiaba"
            primaryText="(UTC-04:00) Cuiaba"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC-04:00) Curacao"
            primaryText="(UTC-04:00) Curacao"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC-04:00) Dominica"
            primaryText="(UTC-04:00) Dominica"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC-04:00) Eastern Time"
            primaryText="(UTC-04:00) Eastern Time"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC-04:00) Grand Turk"
            primaryText="(UTC-04:00) Grand Turk"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC-04:00) Grenada"
            primaryText="(UTC-04:00) Grenada"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC-04:00) Guadeloupe"
            primaryText="(UTC-04:00) Guadeloupe"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC-04:00) Guyana"
            primaryText="(UTC-04:00) Guyana"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC-04:00) Havana"
            primaryText="(UTC-04:00) Havana"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC-04:00) Iqaluit"
            primaryText="(UTC-04:00) Iqaluit"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC-04:00) Kralendijk"
            primaryText="(UTC-04:00) Kralendijk"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC-04:00) La Paz"
            primaryText="(UTC-04:00) La Paz"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC-04:00) Louisville"
            primaryText="(UTC-04:00) Louisville"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC-04:00) Lower Princes"
            primaryText="(UTC-04:00) Lower Pinces"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC-04:00) Manaus"
            primaryText="(UTC-04:00) Manaus"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC-04:00) Marigot"
            primaryText="(UTC-04:00) Marigot"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC-04:00) Martinique"
            primaryText="(UTC-04:00) Martinique"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC-04:00) Montreal"
            primaryText="(UTC-04:00) Montreal"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC-04:00) Montserrat"
            primaryText="(UTC-04:00) Montserrat"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC-04:00) Nassau"
            primaryText="(UTC-04:00) Nassau"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC-04:00) Nipigon"
            primaryText="(UTC-04:00) Nipigon"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC-04:00) Pangnirtung"
            primaryText="(UTC-04:00) Pangnirtung"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC-04:00) Port of Spain"
            primaryText="(UTC-04:00) Port of Spain"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC-04:00) Port-au-Prince"
            primaryText="(UTC-04:00) Port-au-Prince"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC-04:00) Porto Velho"
            primaryText="(UTC-04:00) Porto Velho"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC-04:00) Puerto Rico"
            primaryText="(UTC-04:00) Puerto Rico"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC-04:00) Santiago"
            primaryText="(UTC-04:00) Santiago"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC-04:00) Santo Domingo"
            primaryText="(UTC-04:00) Santo Domingo"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC-04:00) St Barthelemy"
            primaryText="(UTC-04:00) St Barthelemy"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC-04:00) St Kitts"
            primaryText="(UTC-04:00) St Kitts"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC-04:00) St Lucia"
            primaryText="(UTC-04:00) St Lucia"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC-04:00) St Thomas"
            primaryText="(UTC-04:00) St Thomas"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC-04:00) St Vincent"
            primaryText="(UTC-04:00) St Vincent"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC-04:00) Thunder Bay"
            primaryText="(UTC-04:00) Thunder Bay"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC-04:00) Toronto"
            primaryText="(UTC-04:00) Toronto"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC-04:00) Tortola"
            primaryText="(UTC-04:00) Tortola"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC-04:00) Virgin"
            primaryText="(UTC-04:00) Virgin"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC-03:00) Araguaina"
            primaryText="(UTC-03:00) Araguaina"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC-03:00) Argentina"
            primaryText="(UTC-03:00) Argentina"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC-03:00) Atlantic Time"
            primaryText="(UTC-03:00) Atlantic Time"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC-03:00) Bahia"
            primaryText="(UTC-03:00) Bahia"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC-03:00) Belem"
            primaryText="(UTC-03:00) Belem"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC-03:00) Bermuda"
            primaryText="(UTC-03:00) Bermuda"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC-03:00) Buenos Aires"
            primaryText="(UTC-03:00) Buenos Aires"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC-03:00) Catamarca"
            primaryText="(UTC-03:00) Catamarca"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC-03:00) Cayenne"
            primaryText="(UTC-03:00) Cayenne"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC-03:00) Fortaleza"
            primaryText="(UTC-03:00) Fortaleza"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC-03:00) Glace Bay"
            primaryText="(UTC-03:00) Glace Bay"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC-03:00) Goose Bay"
            primaryText="(UTC-03:00) Goose Bay"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC-03:00) Halifax"
            primaryText="(UTC-03:00) Halifax"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC-03:00) Jujuy"
            primaryText="(UTC-03:00) Jujuy"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC-03:00) Maceio"
            primaryText="(UTC-03:00) Maceio"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC-03:00) Mendoza"
            primaryText="(UTC-03:00) Mendoza"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC-03:00) Moncton"
            primaryText="(UTC-03:00) Moncton"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC-03:00) Montevideo"
            primaryText="(UTC-03:00) Montevideo"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC-03:00) Palmer"
            primaryText="(UTC-03:00) Palmer"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC-03:00) Paramaribo"
            primaryText="(UTC-03:00) Paramaribo"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC-03:00) Punta Arenas"
            primaryText="(UTC-03:00) Punta Arenas"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC-03:00) Recife"
            primaryText="(UTC-03:00) Recife"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC-03:00) Rosario"
            primaryText="(UTC-03:00) Rosario"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC-03:00) Rothera"
            primaryText="(UTC-03:00) Rothera"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC-03:00) Santarem"
            primaryText="(UTC-03:00) Santarem"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC-03:00) Sao Paulo"
            primaryText="(UTC-03:00) Sao Paulo"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC-03:00) Stanley"
            primaryText="(UTC-03:00) Stanley"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC-03:00) Thule"
            primaryText="(UTC-03:00) Thule"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC-02:30) Newfoundland"
            primaryText="(UTC-02:30) Newfoundland"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC-02:30) St Johns"
            primaryText="(UTC-02:30) St Johns"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC-02:00) Godthab"
            primaryText="(UTC-02:00) Godthab"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC-02:00) Miquelon"
            primaryText="(UTC-02:00) Miquelon"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC-02:00) Noronha"
            primaryText="(UTC-02:00) Noronha"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC-02:00) South Georgia"
            primaryText="(UTC-02:00) South Georgia"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC-01:00) Cape Verde"
            primaryText="(UTC-01:00) Cape Verde"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC-01:00) Cape Verde"
            primaryText="(UTC-01:00) Cape Verde"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC+00:00) Abidjan"
            primaryText="(UTC+00:00) Abidjan"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC+00:00) Accra"
            primaryText="(UTC+00:00) Accra"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC+00:00) Azores"
            primaryText="(UTC+00:00) Azores"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC+00:00) Bamako"
            primaryText="(UTC+00:00) Bamako"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC+00:00) Banjul"
            primaryText="(UTC+00:00) Banjul"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC+00:00) Bissau"
            primaryText="(UTC+00:00) Bissau"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC+00:00) Conakry"
            primaryText="(UTC+00:00) Conakry"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC+00:00) Dakar"
            primaryText="(UTC+00:00) Dakar"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC+00:00) Danmarkshavn"
            primaryText="(UTC+00:00) Danmarkshavn"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC+00:00) Freetown"
            primaryText="(UTC+00:00) Freetown"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC+00:00) Greenwich"
            primaryText="(UTC+00:00) Greenwich"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC+00:00) Lome"
            primaryText="(UTC+00:00) Lome"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC+00:00) Monrovia"
            primaryText="(UTC+00:00) Monrovia"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC+00:00) Nouakchott"
            primaryText="(UTC+00:00) Nouakchott"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC+00:00) Ouagadougou"
            primaryText="(UTC+00:00) Ouagadougou"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC+00:00) Reykjavik"
            primaryText="(UTC+00:00) Reykjavik"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC+00:00) Scoresbysund"
            primaryText="(UTC+00:00) Scoresbysund"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC+00:00) St Helena"
            primaryText="(UTC+00:00) St Helena"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC+00:00) Timbuktu"
            primaryText="(UTC+00:00) Timbuktu"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC+01:00) Algiers"
            primaryText="(UTC+01:00) Algiers"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC+01:00) Bangui"
            primaryText="(UTC+01:00) Bangui"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC+01:00) Belfast"
            primaryText="(UTC+01:00) Belfast"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC+01:00) Brazzaville"
            primaryText="(UTC+01:00) Brazzaville"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC+01:00) Canary"
            primaryText="(UTC+01:00) Canary"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC+01:00) Casablanca"
            primaryText="(UTC+01:00) Casablanca"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC+01:00) Douala"
            primaryText="(UTC+01:00) Douala"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC+01:00) Dublin"
            primaryText="(UTC+01:00) Dublin"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC+01:00) El Aaiun"
            primaryText="(UTC+01:00) El Aaiun"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC+01:00) Faeroe"
            primaryText="(UTC+01:00) Faeroe"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC+01:00) Guernsey"
            primaryText="(UTC+01:00) Guernsey"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC+01:00) Faeroe"
            primaryText="(UTC+01:00) Faeroe"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC+01:00) Guernsey"
            primaryText="(UTC+01:00) Guernsey"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC+01:00) Isle of Man"
            primaryText="(UTC+01:00) Isle of Man"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC+01:00) Jersey"
            primaryText="(UTC+01:00) Jersey"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC+01:00) Kinshasa"
            primaryText="(UTC+01:00) Kinshasa"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC+01:00) Lagos"
            primaryText="(UTC+01:00) Lagos"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC+01:00) Libreville"
            primaryText="(UTC+01:00) Libreville"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC+01:00) Lisbon"
            primaryText="(UTC+01:00) Lagos"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC+01:00) London"
            primaryText="(UTC+01:00) London"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC+01:00) Luanda"
            primaryText="(UTC+01:00) Luanda"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC+01:00) Madeira"
            primaryText="(UTC+01:00) Madeira"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC+01:00) Malabo"
            primaryText="(UTC+01:00) Malabo"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC+01:00) Ndjamena"
            primaryText="(UTC+01:00) Ndjamena"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC+01:00) Niamey"
            primaryText="(UTC+01:00) Niamey"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC+01:00) Porto-Novo"
            primaryText="(UTC+01:00) Porto-Novo"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC+01:00) Sao Tome"
            primaryText="(UTC+01:00) Sao Tome"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC+01:00) Tunis"
            primaryText="(UTC+01:00) Tunis"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC+02:00) Amsterdam"
            primaryText="(UTC+02:00) Amsterdam"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC+02:00) Andorra"
            primaryText="(UTC+02:00) Andorra"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC+02:00) Belgrade"
            primaryText="(UTC+02:00) Belgrade"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC+02:00) Berlin"
            primaryText="(UTC+02:00) Berlin"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC+02:00) Biantyre"
            primaryText="(UTC+02:00) Biantyre"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC+02:00) Bratislava"
            primaryText="(UTC+02:00) Bratislava"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC+02:00) Brussels"
            primaryText="(UTC+02:00) Brussels"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC+02:00) Budapest"
            primaryText="(UTC+02:00) Budapest"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC+02:00) Bujumbura"
            primaryText="(UTC+02:00) Bujumbura"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC+02:00) Busingen"
            primaryText="(UTC+02:00) Busingen"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC+02:00) Cairo"
            primaryText="(UTC+02:00) Cairo"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC+02:00) Ceuta"
            primaryText="(UTC+02:00) Ceuta"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC+02:00) Copenhagen"
            primaryText="(UTC+02:00) Copenhagen"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC+02:00) Gaborone"
            primaryText="(UTC+02:00) Gaborone"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC+02:00) Gibraltar"
            primaryText="(UTC+02:00) Gibraltar"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC+02:00) Harare"
            primaryText="(UTC+02:00) Harare"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC+02:00) Jan Mayen"
            primaryText="(UTC+02:00) Jan Mayen"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC+02:00) Johannesburg"
            primaryText="(UTC+02:00) Johannesburg"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC+02:00) Kaliningrad"
            primaryText="(UTC+02:00) Kaliningrad"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC+02:00) Khartoum"
            primaryText="(UTC+02:00) Khartoum"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC+02:00) Kigali"
            primaryText="(UTC+02:00) Kigali"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC+02:00) Ljubljana"
            primaryText="(UTC+02:00) Ljubljana"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC+02:00) Longyearbyen"
            primaryText="(UTC+02:00) Longyearbyen"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC+02:00) Lubumbashi"
            primaryText="(UTC+02:00) Lubumbashi"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC+02:00) Lusaka"
            primaryText="(UTC+02:00) Lusaka"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC+02:00) Luxembourg"
            primaryText="(UTC+02:00) Luxembourg"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC+02:00) Madrid"
            primaryText="(UTC+02:00) Madrid"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC+02:00) Malta"
            primaryText="(UTC+02:00) Malta"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC+02:00) Maputo"
            primaryText="(UTC+02:00) Maputo"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC+02:00) Maseru"
            primaryText="(UTC+02:00) Maseru"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC+02:00) Mbabane"
            primaryText="(UTC+02:00) Mbabane"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC+02:00) Monaco"
            primaryText="(UTC+02:00) Monaco"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC+02:00) Oslo"
            primaryText="(UTC+02:00) Oslo"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC+02:00) Paris"
            primaryText="(UTC+02:00) Paris"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC+02:00) Podgorica"
            primaryText="(UTC+02:00) Podgorica"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC+02:00) Prague"
            primaryText="(UTC+02:00) Prague"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC+02:00) Rome"
            primaryText="(UTC+02:00) Rome"
            className="notSelectable"
          />
            <MenuItem
            value="(UTC+02:00) San Marino"
            primaryText="(UTC+02:00) San Marino"
            className="notSelectable"
          />
            <MenuItem
            value="(UTC+02:00) Sarajevo"
            primaryText="(UTC+02:00) Sarajevo"
            className="notSelectable"
          />
            <MenuItem
            value="(UTC+02:00) Skopje"
            primaryText="(UTC+02:00) Skopje"
            className="notSelectable"
          />
            <MenuItem
            value="(UTC+02:00) Stockholm"
            primaryText="(UTC+02:00) Stockholm"
            className="notSelectable"
          />
            <MenuItem
            value="(UTC+02:00) Tirane"
            primaryText="(UTC+02:00) Tirane"
            className="notSelectable"
          />
            <MenuItem
            value="(UTC+02:00) Tripoli"
            primaryText="(UTC+02:00) Tripoli"
            className="notSelectable"
          />
            <MenuItem
            value="(UTC+02:00) Vaduz"
            primaryText="(UTC+02:00) Vaduz"
            className="notSelectable"
          />
            <MenuItem
            value="(UTC+02:00) Vatican"
            primaryText="(UTC+02:00) Vatican"
            className="notSelectable"
          />
            <MenuItem
            value="(UTC+02:00) Vienna"
            primaryText="(UTC+02:00) Vienna"
            className="notSelectable"
          />
            <MenuItem
            value="(UTC+02:00) Warsaw"
            primaryText="(UTC+02:00) Warsaw"
            className="notSelectable"
          />
            <MenuItem
            value="(UTC+02:00) Windhoek"
            primaryText="(UTC+02:00) Windhoek"
            className="notSelectable"
          />
            <MenuItem
            value="(UTC+02:00) Zagreb"
            primaryText="(UTC+02:00) Zagreb"
            className="notSelectable"
          />
            <MenuItem
            value="(UTC+02:00) Zurich"
            primaryText="(UTC+02:00) Zurich"
            className="notSelectable"
          />
            <MenuItem
            value="(UTC+03:00) Addis Ababa"
            primaryText="(UTC+03:00) Addis Ababa"
            className="notSelectable"
          />
            <MenuItem
            value="(UTC+03:00) Aden"
            primaryText="(UTC+03:00) Aden"
            className="notSelectable"
          />
            <MenuItem
            value="(UTC+03:00) Amman"
            primaryText="(UTC+03:00) Amman"
            className="notSelectable"
          />
            <MenuItem
            value="(UTC+03:00) Antananarivo"
            primaryText="(UTC+03:00) Antananarivo"
            className="notSelectable"
          />
            <MenuItem
            value="(UTC+03:00) Asmara"
            primaryText="(UTC+03:00) Asmara"
            className="notSelectable"
          />
            <MenuItem
            value="(UTC+03:00) Athens"
            primaryText="(UTC+03:00) Athens"
            className="notSelectable"
          />
               <MenuItem
            value="(UTC+03:00) Baghdad"
            primaryText="(UTC+03:00) Baghdad"
            className="notSelectable"
          />
            <MenuItem
            value="(UTC+03:00) Bahrain"
            primaryText="(UTC+03:00) Bahrain"
            className="notSelectable"
          />
            <MenuItem
            value="(UTC+03:00) Beirut"
            primaryText="(UTC+03:00) Beirut"
            className="notSelectable"
          />
            <MenuItem
            value="(UTC+03:00) Bucharest"
            primaryText="(UTC+03:00) Bucharest"
            className="notSelectable"
          />
            <MenuItem
            value="(UTC+03:00) Chisinau"
            primaryText="(UTC+03:00) Chisinau"
            className="notSelectable"
          />
            <MenuItem
            value="(UTC+03:00) Comoro"
            primaryText="(UTC+03:00) Comoro"
            className="notSelectable"
          />
            <MenuItem
            value="(UTC+03:00) Damascus"
            primaryText="(UTC+03:00) Damascus"
            className="notSelectable"
          />
            <MenuItem
            value="(UTC+03:00) Dar es Salaam"
            primaryText="(UTC+03:00) Dar es Salaam"
            className="notSelectable"
          />
              <MenuItem
            value="(UTC+03:00) Djibouti"
            primaryText="(UTC+03:00) Djibouti"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC+03:00) Famagusta"
            primaryText="(UTC+03:00) Famagusta"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC+03:00) Gaza"
            primaryText="(UTC+03:00) Gaza"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC+03:00) Hebron"
            primaryText="(UTC+03:00) Hebron"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC+03:00) Helsinki"
            primaryText="(UTC+03:00) Helsinki"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC+03:00) Instanbul"
            primaryText="(UTC+03:00) Instanbul"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC+03:00) Jerusalem"
            primaryText="(UTC+03:00) Jerusalem"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC+03:00) Juba"
            primaryText="(UTC+03:00) Juba"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC+03:00) Kampala"
            primaryText="(UTC+03:00) Kampala"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC+03:00) Kiev"
            primaryText="(UTC+03:00) Kiev"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC+03:00) Kirov"
            primaryText="(UTC+03:00) Kirov"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC+03:00) Kuwait"
            primaryText="(UTC+03:00) Kuwait"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC+03:00) Mariehamn"
            primaryText="(UTC+03:00) Mariehamn"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC+03:00) Mayotte"
            primaryText="(UTC+03:00) Mayotte"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC+03:00) Minsk"
            primaryText="(UTC+03:00) Minsk"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC+03:00) Mogadishu"
            primaryText="(UTC+03:00) Mogadishu"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC+03:00) Moscow"
            primaryText="(UTC+03:00) Moscow"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC+03:00) Nairobi"
            primaryText="(UTC+03:00) Nairobi"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC+03:00) Nicosia"
            primaryText="(UTC+03:00) Nicosia"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC+03:00) Qatar"
            primaryText="(UTC+03:00) Qatar"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC+03:00) Riga"
            primaryText="(UTC+03:00) Riga"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC+03:00) Riyadh"
            primaryText="(UTC+03:00) Riyadh"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC+03:00) Simferopol"
            primaryText="(UTC+03:00) Simferopol"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC+03:00) Sofia"
            primaryText="(UTC+03:00) Sofia"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC+03:00) Syowa"
            primaryText="(UTC+03:00) Syowa"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC+03:00) Tallinn"
            primaryText="(UTC+03:00) Tallinn"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC+03:00) Tel Aviv"
            primaryText="(UTC+03:00) Tel Aviv"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC+03:00) Tiraspol"
            primaryText="(UTC+03:00) Tiraspol"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC+03:00) Uzhgorod"
            primaryText="(UTC+03:00) Uzhgorod"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC+03:00) Vilnius"
            primaryText="(UTC+03:00) Vilnius"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC+03:00) Volvograd"
            primaryText="(UTC+03:00) Volvograd"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC+03:00) Zaporozhye"
            primaryText="(UTC+03:00) Zaporozhye"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC+04:00) Astrakhan"
            primaryText="(UTC+04:00) Astrakhan"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC+04:00) Baku"
            primaryText="(UTC+04:00) Baku"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC+04:00) Dubai"
            primaryText="(UTC+04:00) Dubai"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC+04:00) Mahe"
            primaryText="(UTC+04:00) Mahe"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC+04:00) Mauritius"
            primaryText="(UTC+04:00) Mauritius"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC+04:00) Muscat"
            primaryText="(UTC+04:00) Muscat"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC+04:00) Reunion"
            primaryText="(UTC+04:00) Reunion"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC+04:00) Samara"
            primaryText="(UTC+04:00) Samara"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC+04:00) Saratov"
            primaryText="(UTC+04:00) Saratov"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC+04:00) Tbilisi"
            primaryText="(UTC+04:00) Tbilisi"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC+04:00) Ulyanovsk"
            primaryText="(UTC+04:00) Ulyanovsk"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC+04:00) Yerevan"
            primaryText="(UTC+04:00) Yerevan"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC+04:30) Kabul"
            primaryText="(UTC+04:30) Kabul"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC+04:30) Tehran"
            primaryText="(UTC+04:30) Tehran"
            className="notSelectable"
          />
           <MenuItem
            value="(UTC+05:00) Aqtobe"
            primaryText="(UTC+05:00) Aqtobe"
            className="notSelectable"
          />
            <MenuItem
            value="(UTC+05:00) Ashgabat"
            primaryText="(UTC+05:00) Ashgabat"
            className="notSelectable"
          />
           <MenuItem
            value="(UTC+05:00) Atyrau"
            primaryText="(UTC+05:00) Atyrau"
            className="notSelectable"
          />
           <MenuItem
            value="(UTC+05:00) Dushanbe"
            primaryText="(UTC+05:00) Dushanbe"
            className="notSelectable"
          />
           <MenuItem
            value="(UTC+05:00) Karachi"
            primaryText="(UTC+05:00) Karachi"
            className="notSelectable"
          />
           <MenuItem
            value="(UTC+05:00) Kerguelen"
            primaryText="(UTC+05:00) Kerguelen"
            className="notSelectable"
          />
           <MenuItem
            value="(UTC+05:00) Maldives"
            primaryText="(UTC+05:00) Maldives"
            className="notSelectable"
          />
           <MenuItem
            value="(UTC+05:00) Mawson"
            primaryText="(UTC+05:00) Mawson"
            className="notSelectable"
          />
           <MenuItem
            value="(UTC+05:00) Oral"
            primaryText="(UTC+05:00) Oral"
            className="notSelectable"
          />
           <MenuItem
            value="(UTC+05:00) Samarkand"
            primaryText="(UTC+05:00) Samarkand"
            className="notSelectable"
          />
           <MenuItem
            value="(UTC+05:00) Tashkent"
            primaryText="(UTC+05:00) Tashkent"
            className="notSelectable"
          />
           <MenuItem
            value="(UTC+05:00) Yekaterinburg"
            primaryText="(UTC+05:00) Yekaterinburg"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC+05:30) Calcutta"
            primaryText="(UTC+05:30) Calcutta"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC+05:30) Colombo"
            primaryText="(UTC+05:30) Colombo"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC+05:45) Kathmandu"
            primaryText="(UTC+05:45) Kathmandu"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC+06:00) Almaty"
            primaryText="(UTC+06:00) Almaty"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC+06:00) Bishkek"
            primaryText="(UTC+06:00) Bishkek"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC+06:00) Chagos"
            primaryText="(UTC+06:00) Chagos"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC+06:00) Dacca"
            primaryText="(UTC+06:00) Dacca"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC+06:00) Kashgar"
            primaryText="(UTC+06:00) Kashgar"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC+06:00) Omsk"
            primaryText="(UTC+06:00) Omsk"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC+06:00) Qyzylorda"
            primaryText="(UTC+06:00) Qyzylorda"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC+06:00) Thimbu"
            primaryText="(UTC+06:00) Thimbu"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC+06:00) Urumqi"
            primaryText="(UTC+06:00) Urumqi"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC+06:00) Vostok"
            primaryText="(UTC+06:00) Vostok"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC+06:30) Cocos"
            primaryText="(UTC+06:30) Cocos"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC+06:30) Rangoon"
            primaryText="(UTC+06:30) Rangoon"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC+06:30) Yangon"
            primaryText="(UTC+06:30) Yangon"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC+07:00) Bangkok"
            primaryText="(UTC+07:00) Bangkok"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC+07:00) Barnaul"
            primaryText="(UTC+07:00) Barnaul"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC+07:00) Christmas"
            primaryText="(UTC+07:00) Christmas"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC+07:00) Davis"
            primaryText="(UTC+07:00) Davis"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC+07:00) Ho Chi Minh"
            primaryText="(UTC+07:00) Ho Chi Minh"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC+07:00) Hovd"
            primaryText="(UTC+07:00) Hovd"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC+07:00) Jakarta"
            primaryText="(UTC+07:00) Jakarta"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC+07:00) Krasnoyarsk"
            primaryText="(UTC+07:00) Krasnoyarsk"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC+07:00) Novokuznetsk"
            primaryText="(UTC+07:00) Novokuznetsk"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC+07:00) Novosibirsk"
            primaryText="(UTC+07:00) Novosibirsk"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC+07:00) Phnom Penh"
            primaryText="(UTC+07:00) Phnom Penh"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC+07:00) Pontianak"
            primaryText="(UTC+07:00) Pontianak"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC+07:00) Saigon"
            primaryText="(UTC+07:00) Saigon"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC+07:00) Tomsk"
            primaryText="(UTC+07:00) Tomsk"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC+07:00) Vientiane"
            primaryText="(UTC+07:00) Vientiane"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC+08:00) Brunei"
            primaryText="(UTC+08:00) Brunei"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC+08:00) Casey"
            primaryText="(UTC+08:00) Casey"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC+08:00) Choibalsan"
            primaryText="(UTC+08:00) Choibalsan"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC+08:00) Chongqing"
            primaryText="(UTC+08:00) Chongqing"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC+08:00) Harbin"
            primaryText="(UTC+08:00) Harbin"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC+08:00) Hong Kong"
            primaryText="(UTC+08:00) Hong Kong"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC+08:00) Irkutsk"
            primaryText="(UTC+08:00) Irkutsk"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC+08:00) Kuala Lumpur"
            primaryText="(UTC+08:00) Kuala Lumpur"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC+08:00) Kuching"
            primaryText="(UTC+08:00) Kuching"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC+08:00) Macau"
            primaryText="(UTC+08:00) Macau"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC+08:00) Makassar"
            primaryText="(UTC+08:00) Makassar"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC+08:00) Manila"
            primaryText="(UTC+08:00) Manila"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC+08:00) Perth"
            primaryText="(UTC+08:00) Perth"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC+08:00) Shanghai"
            primaryText="(UTC+08:00) Shanghai"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC+08:00) Singapore"
            primaryText="(UTC+08:00) Singapore"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC+08:00) Taipei"
            primaryText="(UTC+08:00) Taipei"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC+08:00) Ujung Pandang"
            primaryText="(UTC+08:00) Ujung Pandang"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC+08:00) Ulaan Bator"
            primaryText="(UTC+08:00) Ulan Bator"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC+08:45) Eucla"
            primaryText="(UTC+08:45) Eucla"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC+09:00) Chita"
            primaryText="(UTC+09:00) Chita"
            className="notSelectable"
          />
           <MenuItem
            value="(UTC+09:00) Dili"
            primaryText="(UTC+09:00) Dili"
            className="notSelectable"
          />
           <MenuItem
            value="(UTC+09:00) Jayapura"
            primaryText="(UTC+09:00) Jayapura"
            className="notSelectable"
          />
           <MenuItem
            value="(UTC+09:00) Khandyga"
            primaryText="(UTC+09:00) Khandyga"
            className="notSelectable"
          />
           <MenuItem
            value="(UTC+09:00) Palau"
            primaryText="(UTC+09:00) Palau"
            className="notSelectable"
          />
           <MenuItem
            value="(UTC+09:00) Pyongyang"
            primaryText="(UTC+09:00) Pyongyang"
            className="notSelectable"
          />
           <MenuItem
            value="(UTC+09:00) Seoul"
            primaryText="(UTC+09:00) Seoul"
            className="notSelectable"
          />
           <MenuItem
            value="(UTC+09:00) Tokyo"
            primaryText="(UTC+09:00) Tokyo"
            className="notSelectable"
          />
           <MenuItem
            value="(UTC+09:00) Yakutsk"
            primaryText="(UTC+09:00) Yakutsk"
            className="notSelectable"
          />
           <MenuItem
            value="(UTC+09:30) Adelaide"
            primaryText="(UTC+09:30) Adelaide"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC+09:30) Broken Hill"
            primaryText="(UTC+09:30) Broken Hill"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC+09:30) Darwin"
            primaryText="(UTC+09:30) Darwin"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC+09:30) Yancowinna"
            primaryText="(UTC+09:30) Yancowinna"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC+10:00) Brisbane"
            primaryText="(UTC+10:00) Brisbane"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC+10:00) Canberra"
            primaryText="(UTC+10:00) Canberra"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC+10:00) Chuuk"
            primaryText="(UTC+10:00) Chuuk"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC+10:00) Currie"
            primaryText="(UTC+10:00) Currie"
            className="notSelectable"
          />
           <MenuItem
            value="(UTC+10:00) Guam"
            primaryText="(UTC+10:00) Guam"
            className="notSelectable"
          />                 
          <MenuItem
            value="(UTC+10:00) Port Moresby"
            primaryText="(UTC+10:00) Port Moresby"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC+10:00) Saipan"
            primaryText="(UTC+10:00) Saipan"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC+10:00) Truk"
            primaryText="(UTC+10:00) Truk"
            className="notSelectable"
          />         
          <MenuItem
            value="(UTC+10:00) Ust-Nera"
            primaryText="(UTC+10:00) Ust-Nera"
            className="notSelectable"
          />        
          <MenuItem
            value="(UTC+10:00) Victoria"
            primaryText="(UTC+10:00) Victoria"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC+10:00) Vladivostok"
            primaryText="(UTC+10:00) Vladivostok"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC+10:00) Yap"
            primaryText="(UTC+10:00) Yap"
            className="notSelectable"
          />
           <MenuItem
            value="(UTC+10:30) Lord Howe"
            primaryText="(UTC+10:30) Lord Howe"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC+11:00) Bougainville"
            primaryText="(UTC+11:00) Bougainville"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC+11:00) Efate"
            primaryText="(UTC+11:00) Efate"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC+11:00) Guadalcanal"
            primaryText="(UTC+11:00) Guadalcanal"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC+11:00) Kosrae"
            primaryText="(UTC+11:00) Kosrae"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC+11:00) Macquarie"
            primaryText="(UTC+11:00) Macquarie"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC+11:00) Magadan"
            primaryText="(UTC+11:00) Magadan"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC+11:00) Norfolk"
            primaryText="(UTC+11:00) Norfolk"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC+11:00) Noumea"
            primaryText="(UTC+11:00) Noumea"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC+11:00) Pohnpei"
            primaryText="(UTC+11:00) Pohnpei"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC+11:00) Ponape"
            primaryText="(UTC+11:00) Ponape"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC+11:00) Sakhalin"
            primaryText="(UTC+11:00) Sakhalin"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC+11:00) Srednekolymsk"
            primaryText="(UTC+11:00) Srednekolymsk"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC+12:00) Anadyr"
            primaryText="(UTC+12:00) Anadyr"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC+12:00) Auckland"
            primaryText="(UTC+12:00) Auckland"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC+12:00) Fiji"
            primaryText="(UTC+12:00) Fiji"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC+12:00) Funafuti"
            primaryText="(UTC+12:00) Funafuti"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC+12:00) Kamchatka"
            primaryText="(UTC+12:00) Kamchatka"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC+12:00) Kwajalein"
            primaryText="(UTC+12:00) Kwajalein"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC+12:00) Majuro"
            primaryText="(UTC+12:00) Majuro"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC+12:00) McMurdo"
            primaryText="(UTC+12:00) McMurdo"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC+12:00) Nauru"
            primaryText="(UTC+12:00) Nauru"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC+12:00) Tarawa"
            primaryText="(UTC+12:00) Tarawa"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC+12:00) Wake"
            primaryText="(UTC+12:00) Wake"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC+12:00) Wallis"
            primaryText="(UTC+12:00) Wallis"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC+12:45) Chatham"
            primaryText="(UTC+12:45) Chatham"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC+13:00) Apia"
            primaryText="(UTC+13:00) Apia"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC+13:00) Enderbury"
            primaryText="(UTC+13:00) Enderbury"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC+13:00) Fakaofo"
            primaryText="(UTC+13:00) Fakaofo"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC+13:00) Tongatapu"
            primaryText="(UTC+13:00) Tongatapu"
            className="notSelectable"
          />
          <MenuItem
            value="(UTC+14:00) Kiritimati"
            primaryText="(UTC+14:00) Kiritimati"
            className="notSelectable"
          />
        </DropDownMenu>
        <br />
      </Dialog>
    )
  }
}

export default graphql(
  gql`
    query {
      user {
        id
        timezone
      }
    }
  `,
  { name: "userData" }
)(
  graphql(
    gql`
      mutation ChangeTimeZone($timezone: String) {
        user(timezone: $timezone) {
          id
          timezone
        }
      }
    `,
    {
      name: "ChangeTimeZone",
    }
  )(TimeZoneDialog)
)
