import React, { Component } from 'react';
import { connect } from 'react-redux'
import './GameContainer.css'
import { Button, ButtonGroup } from 'react-bootstrap'
import Game from './Game'
import {
    leaveRoom,
} from '../../socket'

class GameContainer extends Component {
    constructor(props) {
        console.log('In-Game')
        super(props)
        this.game = new Game()
        this.game.Initialize()
        this.gameCanvas = null
    }

    componentWillUnmount() {
        this.game.removeAllListeners()
    }

    onBackPress = () => {
        leaveRoom()
        // TODO: set game room to be null
    }

    updateGameCanvas = element => {
        this.gameCanvas = element
        if(this.gameCanvas && this.gameCanvas.children.length<=0) {
            this.gameCanvas.appendChild(this.game.getApp().view)
        }
    }

    render() {
        return <div className="body">
            <h1>Game {this.props.gameRoom.id}</h1>
            <div>
                <ButtonGroup style={{position: 'absolute'}}>
                    <Button variant="outline-primary" onClick={this.onBackPress}>
                        Quit
                    </Button>
                </ButtonGroup>
                <div ref={this.updateGameCanvas}/>
            </div>
        </div>
    }
}

const mapStateToProps = state => ({
    gameRoom: state.gameRoom
});

export default connect(mapStateToProps)(GameContainer);