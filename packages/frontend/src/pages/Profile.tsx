import Header from "@/components/header/header";
import { useEffect, useState } from "react";

const Profile = () => {
  const [test, setData] = useState('rien');

  const testSSE = () => {
    const sse = new EventSource('http://localhost:3000/users/events/test');
    sse.onmessage = ({ data }) => {
      setData(data);
      //console.log('New message', JSON.parse(data));
    }
  }

  useEffect(() => {
    testSSE();
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