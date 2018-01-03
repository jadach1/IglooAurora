import React, {Component} from "react"
import Tile from "./tiles/Tile"
import CenteredSpinner from "./CenteredSpinner"
import FlatButton from "material-ui/FlatButton"
import PropTypes from "prop-types"
import {graphql} from "react-apollo"
import gql from "graphql-tag"

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
            return <CenteredSpinner />
        }
        if (error) {
            return <p>{error.message}</p>
        }

        const values = device.values
        let visibleTiles = values.filter(value => value.relevance === "VISIBLE")

        let hiddenTiles = values.filter(value => value.relevance === "HIDDEN")

        const renderTile = value => {
            if (
                value.__typename === "BooleanValue" &&
                value.permission === "READ_ONLY"
            ) {
                return (
                    <Tile
                        value={value.boolValue}
                        hidden={value.relevance === "NORMAL"}
                        title={value.customName}
                        className={value.tileSize.toLowerCase()}
                    />
                )
            } else {
                return ""
            }
        }
        visibleTiles = visibleTiles.map(renderTile)
        hiddenTiles = hiddenTiles.map(renderTile)

        let hiddenTilesUI = ""

        if (hiddenTiles.length !== 0) {
            hiddenTilesUI = [
                <FlatButton
                    onClick={() =>
                        this.setState(oldState => ({
                            showHidden: !oldState.showHidden,
                        }))
                    }
                    label={this.state.showHidden ? "Show less" : "Show more"}
                    fullWidth={true}
                    className="divider"
                />,
                <div className="itemsList hiddenItems">
                    {this.state.showHidden ? hiddenTiles : ""}
                </div>,
            ]
        }

        let noItemsUI = ""
        if (hiddenTiles.length + visibleTiles.length === 0) {
            noItemsUI = (
                <div
                    style={{
                        width: "100%",
                        textAlign: "center",
                        marginTop: "15px",
                    }}
                >
                    This device has no values :(
                </div>
            )
        }

        return (
            <div className="mainBody">
                {noItemsUI}
                <div className="itemsList">{visibleTiles}</div>
                {hiddenTilesUI}
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
                    tileSize
                    customName
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
