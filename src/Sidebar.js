import React, {Component} from "react"
import {graphql} from "react-apollo"
import gql from "graphql-tag"
import {List, ListItem} from "material-ui/List"
import ContentInbox from "material-ui/svg-icons/content/inbox"
import ActionGrade from "material-ui/svg-icons/action/grade"
import ContentSend from "material-ui/svg-icons/content/send"
import ContentDrafts from "material-ui/svg-icons/content/drafts"
import Divider from "material-ui/Divider"
import ActionInfo from "material-ui/svg-icons/action/info"
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider"
import CenteredSpinner from "./CenteredSpinner"

class Sidebar extends Component {
    componentDidMount() {
        const subscriptionQuery = gql`
            subscription {
                deviceCreated {
                    id
                    customName
                }
            }
        `

        this.props.userData.subscribeToMore({
            document: subscriptionQuery,
            updateQuery: (prev, {subscriptionData}) => {
                if (!subscriptionData.data) {
                    return prev
                }
                console.log(prev)
                const newDevices = [
                    ...prev.user.devices,
                    subscriptionData.data.deviceCreated,
                ]
                return {
                    user: {
                        ...prev.user,
                        devices: newDevices,
                    },
                }
            },
        })
    }

    render() {
        const {userData: {loading, error, user}, CreateFloatValue} = this.props

        if (loading) {
            return <CenteredSpinner />
        }
        if (error) {
            return <p>{error.message}</p>
        }

        return (
            <List>
                {user.devices.map(device => (
                    <ListItem
                        primaryText={device.customName}
                        leftIcon={<ActionGrade />}
                        onClick={() => this.props.selectDevice(device.id)}
                    />
                ))}
            </List>
        )
    }
}

export default graphql(
    gql`
        mutation($deviceId: ID!) {
            CreateFloatValue(
                deviceId: $deviceId
                permission: READ_ONLY
                relevance: NORMAL
                value: 5
            ) {
                id
                value
            }
        }
    `,
    {name: "CreateFloatValue"}
)(
    graphql(
        gql`
            query {
                user {
                    devices {
                        id
                        customName
                    }
                }
            }
        `,
        {name: "userData"}
    )(Sidebar)
)
