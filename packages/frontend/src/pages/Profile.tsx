import Header from "@/components/header/header";
import { useEffect, useState } from "react";
import { io } from 'socket.io-client';

const Profile = () => {
  const [test, setData] = useState('rien');

  const testSSE = () => {
    const sse = new EventSource('http://localhost:3000/users/events/test');
    sse.onmessage = ({ data }) => {
      setData(data);
      //console.log('New message', JSON.parse(data));
    }
  }

  const testWebSocket = () => {
    const socket = io("ws://localhost:3002/userEvents", {
      withCredentials: false,
    });

    socket.emit('events', { name: 'Nest' }, (data: any) => {
      console.log(data);
      setData(data.name);
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from WebSocket server');
    });
  }

  useEffect(() => {
    //testSSE();
    testWebSocket();
  }, []);

  return (
    <div>
      <Header />
      {
        test
      }
    </div>
  );
};

export default Profile;