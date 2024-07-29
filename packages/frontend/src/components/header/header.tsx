import AuthContext from "@/utils/AuthContext";
import { NavigationMenuList, NavigationMenuItem } from "@radix-ui/react-navigation-menu";
import { FunctionComponent, useContext } from "react";
import { NavigationMenu } from "../ui/navigation-menu";
import UserMenu from "./userMenu";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";  // Assurez-vous que ce chemin est correct pour votre projet
import { Moon, Sun } from "lucide-react";

const Header: FunctionComponent = () => {
  const userRole = useContext(AuthContext)?.authUser?.role.name;

  const columns = [
    {
      name: "Home",
      link: "/home",
      role: "user",
    },
    {
      name: "Movies",
      link: "/movies",
      role: "user",
    },
    {
      name: "Series",
      link: "/series",
      role: "user",
    },
    {
      name: "Music",
      link: "/music",
      role: "user",
    },
    {
      name: "Media",
      link: "/media",
      role: "admin",
    },
  ];

  const filteredColumns = userRole === "admin" 
    ? columns 
    : columns.filter(column => column.role === "user");

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
