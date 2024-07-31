import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { CircleUser, LogOut, Settings } from "lucide-react";
import { FunctionComponent, useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "@/utils/AuthContext";
import { useTranslation } from "react-i18next";

const UserMenu: FunctionComponent = () => {
  const { logout } = useContext(AuthContext) || {};
  const authUserName: string | undefined = useContext(AuthContext)?.authUser?.username;
  const { t } = useTranslation();

  const handleLogout = () => {
    if (logout) {
      logout();
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="mr-2">
        <Avatar>
          <AvatarFallback className="bg-blue-950 text-xl text-white font-bold">
            {authUserName && authUserName[0].toUpperCase()}
            {!authUserName && "U"}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="mr-8">
        <DropdownMenuLabel>{t("userMenu.myAccount")}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <CircleUser className="mr-1 h-5" />
          <Link to="/profile">{t("userMenu.profile")}</Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Settings className="mr-1 h-5" href="/settings" to="/settings" />{" "}
          <Link to="/settings">{t("userMenu.parameters")}</Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="mr-1 h-5" /> {t("userMenu.disconnect")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
