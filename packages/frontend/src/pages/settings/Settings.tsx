import Header from "@/components/header/header";
import UserAdminSettings from "@/components/settings/userAdmin";
import GlobalSettings from "@/components/settings/globalSettings";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import RolesAdminSettings from "@/components/settings/rolesAdmin";
import { Location, NavigateFunction, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
//import { User } from "@/components/models/user";

const Settings = () => {
  //const authUser: User | null = null; //useUser()
  const navigate: NavigateFunction = useNavigate();
  const location: Location<any> = useLocation();
  const currentTab = location.pathname.split('/').pop();

  useEffect(() => {
    if (currentTab === 'settings') navigate('/settings/global-settings');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTab]);

  const handleSelectTab = (tab: string) => {
    navigate(`/settings/${tab}`, { replace: true });
  }

  return (
    <div>
      <Header />
      <section className="mt-2 m-auto max-w-7xl">
        <h2 className="text-3xl font-bold">Settings</h2>
        <Tabs value={currentTab} defaultValue="global-settings" onValueChange={handleSelectTab} className="mt-1">
          <TabsList>
            <TabsTrigger value="global-settings">Global settings</TabsTrigger>
            {/* TODO -> admin check */}
            <TabsTrigger value="users-administration">Users Administration</TabsTrigger>
            <TabsTrigger value="roles-administration">Roles Administration</TabsTrigger>
          </TabsList>
          <TabsContent value="global-settings">
            <GlobalSettings />
          </TabsContent>
          {
            //(authUser === null || authUser.role !== 'admin') &&
            <TabsContent value="users-administration">
              <UserAdminSettings />
            </TabsContent>
          }
          <TabsContent value="roles-administration">
            <RolesAdminSettings />
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
};

export default Settings;