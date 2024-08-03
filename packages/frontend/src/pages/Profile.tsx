import Header from "@/components/header/header";
import { User } from "@/components/models/user";
import EditMyAccount from "@/components/settings/profile/editMyAccount";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
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
  const deviceId: string | undefined = useContext(AuthContext)?.deviceId;

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
        <section id="ActiveClientsContainer" className="mt-2">
          <h3 className="text-xl font-bold">Active devices</h3>
          <div className="devices-container flex flex-row space-x-4">
            {
              data.map((client) => {
                return (
                  <Card className="w-80">
                    <CardHeader>
                      <CardTitle className="text-lg">
                        {client.device}
                      </CardTitle>
                      <CardDescription>Device Id : {client.id}</CardDescription>
                    </CardHeader>
                    <CardFooter className="justify-between">
                      {
                        (deviceId && deviceId === client.id) && 
                        <Badge>Current device</Badge>
                      }
                      <Button variant="destructive">Disconnect</Button>
                    </CardFooter>
                  </Card>
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