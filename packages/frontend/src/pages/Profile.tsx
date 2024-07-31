import Header from "@/components/header/header";
import AuthContext, { AuthUser } from "@/utils/AuthContext";
import { useContext, useEffect, useState } from "react";
import { io } from 'socket.io-client';

type ActiveClient = {
  id: string;
  userId: number;
  username: string;
}

const Profile = () => {
  const authUser: AuthUser | null | undefined = useContext(AuthContext)?.authUser;
  const [data, setData] = useState<ActiveClient[]>([]);

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

    if (authUser) {
      const sendedData = {
        id: authUser.id,
        username: authUser.username
      };
      
      socket.emit('events', sendedData, (data: any) => {
        console.log(data);
        //setData(data);
      });
    }
      
    socket.on('clients', (data) => {
      setData(Object.values(data));
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
      <h4>Active clients: </h4>
      <p>
      {
        data.map((client) => {
          return (
            <div className="p-2 border-gray-400 border-2 mt-2 w-1/3">
              <h6>{client.id}</h6>
              <p>{client.userId} / {client.username}</p>
            </div>
          );
        })
      }
      </p>
    </div>
  );
};

export default Profile;