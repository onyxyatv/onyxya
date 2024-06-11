import Header from "@/components/header/header";
import AdminSettings from "@/components/settings/admin";
import GlobalSettings from "@/components/settings/globalSettings";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const Settings = () => {
  return (
    <div>
      <Header />
      <section className="mt-2 m-auto max-w-7xl">
        <h2 className="text-3xl font-bold">Settings</h2>
        <Tabs defaultValue="globalSettings" className="mt-1">
          <TabsList>
            <TabsTrigger value="globalSettings">Global settings</TabsTrigger>
            <TabsTrigger value="administration">Administration</TabsTrigger>
            <TabsTrigger value="support">Support</TabsTrigger>
          </TabsList>
          <TabsContent value="globalSettings">
            <GlobalSettings />
          </TabsContent>
          <TabsContent value="administration">
            <AdminSettings />
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
};

export default Settings;