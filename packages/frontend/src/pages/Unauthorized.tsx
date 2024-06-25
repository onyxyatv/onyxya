import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

const Unauthorized: React.FC = () => {
  return (
    <div className="m-auto w-1/3 mt-10 flex flex-col justify-center align-middle">
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Access Denied</AlertTitle>
        <AlertDescription>
          You do not have permission to view this page.
        </AlertDescription>
      </Alert>
      <Button variant="outline" className="mt-2 ml-auto mr-auto w-1/3">
        <Link to='/home'>
          Go to Home
        </Link>
      </Button>
    </div>
  );
};

export default Unauthorized;
