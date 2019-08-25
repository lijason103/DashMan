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

const GAME_WIDTH = 1125
const GAME_HEIGHT = 750

class GameContainer extends Component {
    constructor(props) {
        console.log('In-Game')
        super(props)

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
            let ratio = GAME_WIDTH/GAME_HEIGHT
            let gameWidth = 0
            let gameHeight = 0
            // TODO: do better dimension calculation
            if (element.offsetHeight < element.offsetWidth) {
                gameWidth = element.offsetHeight * ratio
                gameHeight = element.offsetHeight
            } else {
                gameWidth = element.offsetWidth
                gameHeight = element.offsetWidth / ratio
            }
            this.game = new Game(gameWidth, gameHeight)
            this.game.Initialize()
            this.game.InitalizeControlManager('gameCanvas')
            this.gameCanvas.appendChild(this.game.getApp().view)
        }
    }

    render() {
        let mPlayer = null
        if (this.props.gameState && this.props.gameState.players) {
            mPlayer = this.props.gameState.players[socket.id]
        }
        return <div className="fullscreen">
            {/* <h1>Game {this.props.gameRoom.id.slice(-5)}</h1> */}
            <div id="game-wrapper" style={{display: 'flex', height: '100%', flexDirection: 'column'}}>
                
                <div id="ui" style={{width: '100%'}}>
                    <ButtonGroup style={{float: 'left'}}>
                        <Button variant="outline-primary" onClick={this.onQuitGameRoom}>
                            Quit
                        </Button>
                    </ButtonGroup>
                    {mPlayer && <ProgressBar style={{flex: 1, height: '100%'}}
                        striped={mPlayer.hp > 0}
                        animated={mPlayer.hp > 0}
                        variant={mPlayer.hp > 0 ? 'info' : 'danger'}
                        now={mPlayer.hp > 0 ? mPlayer.energy/mPlayer.max_energy * 100 : 100}
                        label={mPlayer.hp > 0 ? `${mPlayer.energy}/${mPlayer.max_energy}` : 'DEAD'}
                    />}
                </div>
                <div id='gameCanvas' ref={this.updateGameCanvas} 
                    style={{
                        position: 'relative', 
                        display: 'flex', 
                        height: '100%',
                        alignItems: 'flex-start', 
                        justifyContent: 'center',
                        backgroundColor: '#f2fbff'
                    }}
                />
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