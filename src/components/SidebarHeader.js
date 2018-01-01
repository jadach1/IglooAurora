import React, {Component} from "react"
import SettingsIcon from "material-ui/svg-icons/action/settings"
import AccountIcon from "material-ui/svg-icons/action/account-circle"
import NotificationIcon from "material-ui/svg-icons/social/notifications"

class SidebarHeader extends Component {
    render() {
        return (
            <div className="sidebarHeader">
                <img
                    src="/assets/logo.svg"
                    width="60px"
                    height="60px"
                    className="logo notSelectable"
                />
                Igloo Cloud Remote
                <div className="rightSide">
                    <NotificationIcon className="icon" />
                    <AccountIcon className="icon" />
                    <SettingsIcon className="icon" />
                </div>
            </div>
        )
    }
}

export default SidebarHeader
