import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle, X } from "lucide-react";
import { useState } from "react";

interface ErrorAlertProps {
  error: Error;
}

const ErrorAlert = ({ error }: ErrorAlertProps) => {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="fixed top-4 right-4 w-1/4">
      {visible && (
        <Alert variant="destructive" className="flex space-x-3 p-4">
          <AlertCircle className="h-5 w-5 text-red-600" />
          <div className="flex-1">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error.message}</AlertDescription>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setVisible(false)}>
            <X className="h-5 w-5" />
          </Button>
        </Alert>
      )}
    </div>
  );
};

export default ErrorAlert;
