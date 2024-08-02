import Header from "@/components/header/header";
import { User } from "@/components/models/user";
import EditMyAccount from "@/components/settings/profile/editMyAccount";
import AuthContext from "@/utils/AuthContext";
import FrontUtilService from "@/utils/frontUtilService";
import { useContext, useEffect, useState } from "react";

type ActiveClient = {
  id: string;
  userId: number;
  username: string;
  device: string;
}

const Profile = () => {
  const [data, setData] = useState<ActiveClient[]>([]);
  const websocketClient = useContext(AuthContext)?.websocketClient;
  const [reloadStatus, setReloadStatus] = useState(true);
  const authUser = useContext(AuthContext)?.authUser;
  const [fullUser, setFullUser] = useState<User | null>(null);

  /*const testSSE = () => {
    const sse = new EventSource('http://localhost:3000/users/events/test');
    sse.onmessage = ({ data }) => {
      setData(data);
      //console.log('New message', JSON.parse(data));
    }
  }*/

  useEffect(() => {
    //testSSE();
    if (websocketClient) setData(websocketClient);
    const fetchUser = async () => {
      if (authUser) {
        const user: User = await FrontUtilService.getUserById(authUser.id);
        setFullUser(user);
      }
    };
    if (reloadStatus) {
      fetchUser();
      setReloadStatus(false);
    }
  }, [websocketClient, authUser, fullUser, setFullUser, reloadStatus]);

  return (
    <div>
      <Header />
      <section id="MyProfileContainer" className="max-w-[90vw] m-auto mt-2">
      <h2 className="text-3xl font-bold">My Profile</h2>
        {
          fullUser &&
          <EditMyAccount user={fullUser} setReloadStatus={(v: boolean) => setReloadStatus(v)} />
        }
        <section id="ActiveClientsContainer">
          <h4>Active devices: </h4>
          <div>
            {
              data.map((client) => {
                return (
                  <div className="p-2 border-gray-400 border-2 mt-2 w-1/3">
                    <h6>{client.id}</h6>
                    <p>{client.userId} / {client.username}</p>
                    <p>{client.device}</p>
                  </div>
                );
              })
            }
          </div>
        </section>
      </section>
    </div>
  );
};

export default Profile;