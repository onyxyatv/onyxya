import Header from "@/components/header/header";
import UserAdminSettings from "@/components/settings/userAdmin";
import GlobalSettings from "@/components/settings/globalSettings";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import RolesAdminSettings from "@/components/settings/rolesAdmin";
//import { User } from "@/components/models/user";

const Settings = () => {
  //const authUser: User | null = null; //useUser()

  return (
    <div>
      <Header />
      <section className="mt-2 m-auto max-w-7xl">
        <h2 className="text-3xl font-bold">Settings</h2>
        <Tabs defaultValue="globalSettings" className="mt-1">
          <TabsList>
            <TabsTrigger value="globalSettings">Global settings</TabsTrigger>
            {/* TODO -> admin check */}
            <TabsTrigger value="users-administration">Users Administration</TabsTrigger>
            <TabsTrigger value="roles-administration">Roles Administration</TabsTrigger>
          </TabsList>
          <TabsContent value="globalSettings">
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