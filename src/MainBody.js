import React, {Component} from "react"
import Tile from "./Tile"
import FlatButton from "material-ui/FlatButton"
import PropTypes from "prop-types"
import {graphql} from "react-apollo"
import gql from "graphql-tag"
import CircularProgress from "material-ui/CircularProgress"

class MainBody extends Component {
    constructor() {
        super()
        this.state = {
            showHidden: false,
        }
    }

    render() {
        const {loading, error, device} = this.props.deviceData

        if (loading) {
            return <CircularProgress />
        }
        if (error) {
            return <p>{error.message}</p>
        }

        const values = device.values
        let visibleTiles = values.filter(value => value.relevance === "NORMAL")

        let hiddenTiles = values.filter(value => value.relevance === "HIDDEN")

        const renderTile = value => {
            if (value.__typename === "BooleanValue") {
                return (
                    <Tile
                        value={value.boolValue}
                        hidden={value.relevance === "NORMAL"}
                        title="implement value.title"
                        className="large"
                    />
                )
            } else {
                return ""
            }
        }
        visibleTiles = visibleTiles.map(renderTile)
        hiddenTiles = hiddenTiles.map(renderTile)

        return (
            <div className="mainBody">
                <div className="itemsList">{visibleTiles}</div>
                <FlatButton
                    onClick={() =>
                        this.setState(oldState => ({
                            showHidden: !oldState.showHidden,
                        }))
                    }
                    label={this.state.showHidden ? "Show less" : "Show more"}
                    fullWidth={true}
                    className="divider"
                />
                <div className="itemsList hiddenItems">
                    {this.state.showHidden ? hiddenTiles : ""}
                </div>
            </div>
        )
    }
}

MainBody.propTypes = {
    deviceId: PropTypes.string.isRequired,
}

export default graphql(
    gql`
        query($id: ID!) {
            device(id: $id) {
                id
                values {
                    id
                    permission
                    relevance
                    valueDetails
                    ... on FloatValue {
                        floatValue: value
                        precision
                        boundaries
                    }
                    ... on StringValue {
                        stringValue: value
                        maxChars
                    }
                    ... on BooleanValue {
                        boolValue: value
                    }
                    ... on ColourValue {
                        colourValue: value
                    }
                }
            }
        }
    `,
    {name: "deviceData", options: ({deviceId}) => ({variables: {id: deviceId}})}
)(MainBody)
