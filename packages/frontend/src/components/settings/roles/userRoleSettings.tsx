import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import PermissionsList from "./permissionsList";

const UserRoleSettings = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>User Role</CardTitle>
        <CardDescription>
          Users can use the application's features without managing it by default
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>
          TODO
        </p>
      </CardContent>
      <CardFooter>
        <Accordion className=" min-w-full bg-gray-300" type="single" collapsible>
          <AccordionItem value="item-1" className="p-3">
            <AccordionTrigger>
              Permissions
            </AccordionTrigger>
            <AccordionContent>
              <PermissionsList role={'user'} />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardFooter>
    </Card>
  );
}

export default UserRoleSettings;