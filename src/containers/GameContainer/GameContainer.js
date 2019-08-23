import React, { Component } from 'react';
import { connect } from 'react-redux'
import './GameContainer.css'
import { Button, ButtonGroup, ProgressBar } from 'react-bootstrap'
import Game from './Game'
import { socket } from '../../index'
import {
    leaveRoom,
} from '../../socket'

const gameWidth = 1125
const gameHeight = 750

class GameContainer extends Component {
    constructor(props) {
        console.log('In-Game')
        super(props)
        this.game = new Game(gameWidth, gameHeight)
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
        let mPlayer = null
        if (this.props.gameState && this.props.gameState.players) {
            mPlayer = this.props.gameState.players[socket.id]
        }
        return <div className="body">
            <h1>Game {this.props.gameRoom.id}</h1>
            <div id="game-wrapper" style={{width: gameWidth, height: gameHeight}}>
                {mPlayer && 
                <div id="ui" style={{display: 'flex', flexDirection: 'row'}}>
                    <ButtonGroup>
                        <Button variant="outline-primary" onClick={this.onBackPress}>
                            Quit
                        </Button>
                    </ButtonGroup>
                    <ProgressBar style={{flex: 1}} striped animated
                        now={mPlayer.energy/mPlayer.max_energy * 100}
                        label={`${mPlayer.energy}/${mPlayer.max_energy}`}
                    />
                </div>}
                <div ref={this.updateGameCanvas}/>
            </div>
        </div>
    }
}

const mapStateToProps = state => ({
    gameRoom: state.gameRoom,
    gameState: state.gameState,
});

export default connect(mapStateToProps)(GameContainer);