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

const AdminRoleSettings = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Admin Role</CardTitle>
        <CardDescription>
          Administrators have access to all permissions, allowing them to manage users and media.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>Card Content</p>
      </CardContent>
      <CardFooter>
        <Accordion className=" min-w-full bg-gray-300" type="single" collapsible>
          <AccordionItem value="item-1" className="p-3">
            <AccordionTrigger>
              Permissions
            </AccordionTrigger>
            <AccordionContent>
              <PermissionsList role={'admin'} />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardFooter>
    </Card>
  );
}

export default AdminRoleSettings;