import React, { useState } from 'react';
import { v4 as uuidV4 } from 'uuid';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();

    const [roomId, setRoomId] = useState('');
    const [username, setUsername] = useState('');

    const createNewRoom = (e) => {
        e.preventDefault();
        const id = uuidV4();
        setRoomId(id);
        toast.success('New room created successfully!');
    };

    const joinRoom = () => {
        if (!roomId || !username) {
            toast.error('Both Room ID and Username are required.');
            return;
        }

        // Redirect to the editor with roomId and username in state
        navigate(`/editor/${roomId}`, {
            state: {
                username,
            },
        });
    };

    const handleInputEnter = (e) => {
        if (e.code === 'Enter') {
            joinRoom();
        }
    };

    return (
        <div className="homePageWrapper">
            <div className="formWrapper">
                <h1 className="mainLabel">Join a Room</h1>
                <div className="inputGroup">
                    <input
                        type="text"
                        className="inputBox"
                        placeholder="Enter Room ID"
                        value={roomId}
                        onChange={(e) => setRoomId(e.target.value)}
                        onKeyUp={handleInputEnter}
                    />
                    <input
                        type="text"
                        className="inputBox"
                        placeholder="Enter Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        onKeyUp={handleInputEnter}
                    />
                    <button className="btn joinBtn" onClick={joinRoom}>
                        Join Room
                    </button>
                    <span className="createInfo">
                        Don't have an invite? &nbsp;
                        <a
                            onClick={createNewRoom}
                            href="#"
                            className="createNewBtn"
                        >
                            Create New Room
                        </a>
                    </span>
                </div>
            </div>
            
        </div>
    );
};

export default Home;
