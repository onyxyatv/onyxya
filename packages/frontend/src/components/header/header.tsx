import AuthContext from "@/utils/AuthContext";
import { NavigationMenuList, NavigationMenuItem } from "@radix-ui/react-navigation-menu";
import { FunctionComponent, useContext } from "react";
import { NavigationMenu } from "../ui/navigation-menu";
import UserMenu from "./userMenu";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";  // Assurez-vous que ce chemin est correct pour votre projet
import { Moon, Sun } from "lucide-react";
import { useTranslation } from "react-i18next";

const Header: FunctionComponent = () => {
  const perms = useContext(AuthContext)?.authUser?.permissions;
  const [ t ] = useTranslation();

  const columns = [
    {
      name: t("header.home"),
      link: "/home",
    },
    {
      name: t("header.movie"),
      link: "/movie",
    },
    {
      name: t("header.series"),
      link: "/series",
    },
    {
      name: t("header.music"),
      link: "/music",
    },
    {
      name: t("header.media"),
      link: "/media",
      perm: "admin_read_media",
    },
  ];

  const filteredColumns = columns.filter((column) => {
    if (!column.perm) return true;
    if (perms?.includes(column.perm)) return true;
    return false;
  });
  

  return (
    <header className="flex bg-slate-600 p-4">
      <h1>OnyxyaTv</h1>
      <NavigationMenu className="flex items-center ml-auto mr-auto">
        <NavigationMenuList className="flex items-center ml-auto mr-auto">
          {filteredColumns.map((column) => (
            <NavigationMenuItem key={column.link}>
              <Link to={column.link} className="mr-2">
                <Button variant="link">{column.name}</Button>
              </Link>
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>
      <div className="flex">
        <button className="mr-2">
          <Moon />
          <Sun />
        </button>
        <UserMenu />
      </div>
    </header>
  );
};

export default Header;
