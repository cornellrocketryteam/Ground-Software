import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface ConfirmNavigationButtonProps {
  label: string;
  confirmMessage: string;
  href: string;
  className?: string;
}

const ConfirmNavigationButton: React.FC<ConfirmNavigationButtonProps> = ({
  label,
  confirmMessage,
  href,
  className,
}) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="default"
          className={`fixed bottom-6 left-6 px-6 py-6 text-lg rounded-lg shadow-lg ${className}`}
        >
          {label}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{label}</AlertDialogTitle>
          <AlertDialogDescription>{confirmMessage}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>No</AlertDialogCancel>
          <Link href={href} passHref>
            <AlertDialogAction asChild>
              <button>Yes</button>
            </AlertDialogAction>
          </Link>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ConfirmNavigationButton;
