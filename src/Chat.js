import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import "./Chat.css";
import StarBorderOutlinedIcon from '@material-ui/icons/StarBorderOutlined';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import Message from './Message';
import ChatInput from './ChatInput';
import axios from './axios';
import Pusher from 'pusher-js';

const pusher = new Pusher('e09578ae0363cf0d7f86', {
    cluster: 'ap2'
  });
function Chat() {
    const {roomId}=useParams();
    const [roomDetails,setRoomDetails]=useState(null);
    const [roomMessages,setRoomMessages]=useState([]);

    const getConvo=()=>{
        axios.get(`get/conversation?id=${roomId}`).then((res)=>{
            setRoomDetails(res.data[0].channelName)
            setRoomMessages(res.data[0].conversation)
        })
    }
    useEffect(()=>{
        if(roomId){
            pusher.unsubscribe("conversation")
            getConvo();
            const channel = pusher.subscribe('conversation');
            channel.bind('newMessage', function(data) {
              getConvo();
            });
        } 

    },[roomId])

    console.log(roomMessages);

    
    return (
        <div  className="chat">
            <div className="chat__header">
                <div  className="chat__headerLeft">
                    <h4 className="chat__channelName">
                        <strong>#{roomDetails}</strong><StarBorderOutlinedIcon />
                    </h4>
                </div>
                <div className="chat__headerRight">
                    <p>
                        <InfoOutlinedIcon /> Details
                    </p>
                </div>
            </div>
            <div  className="chat__messages">
                {roomMessages.map(({message,timestamp,user,userImage})=>(
                    <Message
                        message={message}
                        timestamp={timestamp}
                        user={user}
                        userImage={userImage}
                    />

                ))}
            </div>
            <ChatInput channelName={roomDetails} channelId={roomId} />
        </div>
    )
}

export default Chat