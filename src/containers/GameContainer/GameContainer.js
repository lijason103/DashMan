import React, { Component } from 'react';
import { connect } from 'react-redux'
import './GameContainer.css'
import { Button, ButtonGroup, Modal } from 'react-bootstrap'
import ReactResizeDetector from 'react-resize-detector'
import Game from './Game'
import {
    leaveRoom,
} from '../../socket'
import {
    SET_GAME_ROOM,
    SET_GAME_OVER_STATE,
} from '../../redux/actions'

class GameContainer extends Component {
    constructor(props) {
        console.log('In-Game')
        super(props)

        this.gameCanvas = null
        this.modalTimer = null
    }

    componentWillUnmount() {
        if (this.game) {
            this.game.removeAllListeners()
        }
        if (this.modalTimer) {
            clearTimeout(this.modalTimer)
        }
    }

    onQuitGameRoom = () => {
        leaveRoom()
        this.props.dispatch({ type:SET_GAME_ROOM, gameRoom: null })
    }

    onQuitGame = () => {
        this.props.dispatch({ type:SET_GAME_OVER_STATE, gameOverState: null })
    }

    onFullScreenPress = () => {
        document.documentElement.requestFullscreen()
    }

    updateGameCanvas = element => {
        this.gameCanvas = element
        if(this.gameCanvas && this.gameCanvas.children.length<=0) {
            this.game = new Game(this.gameCanvas.offsetWidth, this.gameCanvas.offsetHeight)
            this.game.Initialize()
            this.game.InitalizeControlManager('gameCanvas')
            this.gameCanvas.appendChild(this.game.getApp().view)
        }
    }

    onResize = (width, height) => {
        if (this.gameCanvas) {
            this.game.resize(this.gameCanvas.offsetWidth, this.gameCanvas.offsetHeight)
        }
    }

    render() {
        return <div className="fullscreen">
            <ReactResizeDetector handleWidth handleHeight onResize={this.onResize} />
            <div id="game-wrapper" style={{display: 'flex', height: '100%', flexDirection: 'column'}}>
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
                <ButtonGroup style={{position: 'absolute', top: '5px', left: '5px'}}>
                    <Button variant="dark" size="sm" onClick={this.onQuitGameRoom}>
                        Quit
                    </Button>
                    {window.innerWidth > window.innerHeight && 
                    <Button variant="dark" size="sm" onClick={this.onFullScreenPress}>
                        FS
                    </Button>}
                </ButtonGroup>
            </div>
            <Modal 
                centered
                show={this.props.gameOverState ? true:false} 
                onHide={this.onQuitGame}
                onShow={() => {
                    this.modalTimer = setTimeout(() => {
                        this.onQuitGame()
                    }, 3000)
                }}
            >
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
    gameOverState: state.gameOverState,
});

export default connect(mapStateToProps)(GameContainer);