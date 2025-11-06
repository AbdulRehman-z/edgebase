import { authClient } from "@/lib/auth-client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { ArrowUpIcon } from "lucide-react";

type UpgradeModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const UpgradeModal = ({ open, onOpenChange }: UpgradeModalProps) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Upgrade to Pro</AlertDialogTitle>
          <AlertDialogDescription>
            You can upgrade to Pro for $49.99/month. This will give you access to all
            features.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() =>
              authClient.checkout({
                slug: "Edgebase-Pro",
              })
            }
          >
            <ArrowUpIcon />
            Upgrade now
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
