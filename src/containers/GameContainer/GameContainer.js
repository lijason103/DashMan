import React, { Component } from 'react';
import { connect } from 'react-redux'
import './GameContainer.css'
import { Button, ButtonGroup, ProgressBar, Modal } from 'react-bootstrap'
import Game from './Game'
import { socket } from '../../index'
import {
    leaveRoom,
} from '../../socket'
import {
    SET_GAME_ROOM,
    SET_GAME_STATE,
    SET_GAME_OVER_STATE,
} from '../../redux/actions'

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

    onQuitGameRoom = () => {
        leaveRoom()
        this.props.dispatch({ type:SET_GAME_ROOM, gameRoom: null })
    }

    onQuitGame = () => {
        this.props.dispatch({ type:SET_GAME_OVER_STATE, gameOverState: null })
        this.props.dispatch({ type:SET_GAME_STATE, gameState: null })
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
                
                <div id="ui" style={{display: 'flex', flexDirection: 'row'}}>
                    <ButtonGroup>
                        <Button variant="outline-primary" onClick={this.onQuitGameRoom}>
                            Quit
                        </Button>
                    </ButtonGroup>
                    {mPlayer && <ProgressBar style={{flex: 1}} striped animated
                        now={mPlayer.energy/mPlayer.max_energy * 100}
                        label={`${mPlayer.energy}/${mPlayer.max_energy}`}
                    />}
                </div>
                <div ref={this.updateGameCanvas}/>
            </div>
            <Modal show={this.props.gameOverState ? true:false} onHide={this.onQuitGame}>
                <Modal.Header closeButton>
                    <Modal.Title>And the winner is...</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <p>{this.props.gameOverState ? this.props.gameOverState.winner : ''}!!!</p>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="primary" onClick={this.onQuitGame}>Return</Button>
                </Modal.Footer>
            </Modal >
        </div>
    }
}

const mapStateToProps = state => ({
    gameRoom: state.gameRoom,
    gameState: state.gameState,
    gameOverState: state.gameOverState,
});

export default connect(mapStateToProps)(GameContainer);