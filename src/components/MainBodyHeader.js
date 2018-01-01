import React, {Component} from "react"
import {graphql} from "react-apollo"
import gql from "graphql-tag"
import ActionGrade from "material-ui/svg-icons/action/grade"
import ActionHistory from "material-ui/svg-icons/action/history"

class MainBodyHeader extends Component {
    constructor() {
        super()
    }

    render() {
        const {loading, error, device} = this.props.data
        if (loading) {
            return <div className="mainBodyHeader" />
        }

        if (error) {
            console.error(error)
            return <div className="mainBodyHeader" />
        }

        return (
            <div className="mainBodyHeader">
                {device.icon ? (
                    <img className="deviceIconBig" src={device.icon} />
                ) : (
                    <ActionGrade />
                )}
                {device.customName}
                <div className="rightSide">
                    <ActionHistory />
                </div>
            </div>
        )
    }
}

export default graphql(
    gql`
        query($id: ID!) {
            device(id: $id) {
                id
                customName
                icon
            }
        }
    `,
    {
        options: ({deviceId}) => ({
            variables: {
                id: deviceId,
            },
        }),
    }
)(MainBodyHeader)
