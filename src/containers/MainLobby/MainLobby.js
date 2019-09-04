import React, { Component } from 'react';
import { connect } from 'react-redux'
import { Button, ButtonGroup, Table, InputGroup, FormControl, Modal } from 'react-bootstrap'
import './MainLobby.css'
import { SET_PLAYER_NAME } from '../../redux/actions'
import {
    createGameRoom,
    refreshRooms,
    joinRoom,
} from '../../socket'

class MainLobby extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isChangingName: false
        }
    }

    componentDidMount() {
        refreshRooms()
        console.log("Main Lobby")
    }

    changePlayerName = name => {
        this.props.dispatch({ type:SET_PLAYER_NAME, playerName: name })
    }

    onHide = () => {
        this.setState({isChangingName: false})
        localStorage.setItem('playerName', this.props.playerName)
    }

    render() {
        return <div className="body">
            <h1>Lobby</h1>
            <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                <ButtonGroup>
                    <Button variant="dark" onClick={() => createGameRoom(this.props.playerName)}>Create room</Button>
                    <Button variant="dark" onClick={refreshRooms}>Refresh rooms</Button>
                    <Button variant="dark" onClick={() => this.setState({isChangingName: true})}>Change Name</Button>
                </ButtonGroup>
                <b style={{marginLeft: '20px', fontSize: 20}}>{this.props.playerName}</b>
            </div>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Players</th>
                        <th>Status</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {this.props.gameRooms.map((room, index) => {
                        return <tr key={index}>
                            <td>{room.id.slice(-5)}</td>
                            <td>{room.clients.length}/{room.max_clients}</td>
                            <td>{room.status}</td>
                            <td>
                                {room.clients.length < room.max_clients && room.status !== 'IN-GAME' &&
                                    <Button onClick={() => joinRoom(room.id, this.props.playerName)}>JOIN</Button>
                                }
                            </td>
                        </tr>
                    })}
                </tbody>
            </Table>
            <Modal
                show={this.state.isChangingName}
                onHide={this.onHide}
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>Changing Name</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <InputGroup>
                        <FormControl value={this.props.playerName} onChange={event => this.changePlayerName(event.target.value)}/>
                    </InputGroup>
                </Modal.Body>
            </Modal>
        </div>
    }
}


const mapStateToProps = state => ({
    gameRooms: state.gameRooms,
    playerName: state.playerName,
});


export default connect(mapStateToProps)(MainLobby);