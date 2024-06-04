import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { FC } from "react";
import { CirclePlus } from "lucide-react";
import { NavigationMenu } from "../ui/navigation-menu";
import { NavigationMenuItem, NavigationMenuList } from "@radix-ui/react-navigation-menu";
import UserMenu from "./userMenu";

const Header: FC = () => {
  return (
    <header className="flex bg-slate-600 p-4">
      <h1>OnyxyaTv</h1>
      <NavigationMenu className="flex items-center ml-auto mr-auto">
        <NavigationMenuList className="flex items-center ml-auto mr-auto">
          <NavigationMenuItem>
            <Link to="/home" className="mr-2"><Button variant="link">Home</Button></Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link to="/movies"><Button variant="link">Movies</Button></Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link to="/series"><Button variant="link">Series</Button></Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link to="/music"><Button variant="link">Music</Button></Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Button>
              <CirclePlus className="mr-1" /> Add a media
            </Button>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
      <div className="flex">
        <button className="mr-1">Dark mode</button>
        <UserMenu />
      </div>
    </header>
  );
};

export default Header;