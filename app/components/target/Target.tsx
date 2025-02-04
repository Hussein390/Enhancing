import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "@/components/ui/menubar"
import CreateTarget from "./CreateTarget"
import { useEffect, useState } from "react";

export default function EditTarget() {
  const [menuState, setMenuState] = useState<{ [key: string]: boolean }>({});
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (errorMessage || successMessage) {
      const timer = setTimeout(() => {
        setErrorMessage("");
        setSuccessMessage("");
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [errorMessage, successMessage]);
  //
  const toggleMenu = (menuKey: string) => {
    setMenuState(prev => ({
      ...prev,
      [menuKey]: !prev[menuKey], // Toggle only the clicked menu item
    }));
  };
  return (
    <div className="relative ">
      <Menubar className="">
        {(errorMessage || successMessage) && <AlertDestructive err={errorMessage} success={successMessage} />}
        <MenubarMenu>
          <MenubarTrigger className="bg-blue-600 text-white cursor-pointer">Target</MenubarTrigger>
          <MenubarContent className="p-3 mt-3 bg-white">
            <MenubarItem className="cursor-pointer " onClick={() => toggleMenu("create")}>Create Target
            </MenubarItem>
            <MenubarSeparator />
            <MenubarItem className="cursor-pointer" onClick={() => toggleMenu("delete")}>Delete</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
      {menuState['create'] && <CreateTarget setIsOpen={toggleMenu} setErrorMessage={setErrorMessage} setSuccessMessage={setSuccessMessage} />}
      {menuState['delete'] && <DeleteTarget setIsOpen={toggleMenu} setErrorMessage={setErrorMessage} setSuccessMessage={setSuccessMessage} />}
    </div>
  )
}
// # NEXTAUTH_SECRET = "9yOnOZnlx+WuTxwDZrDS2UbawGjnMfrhWqnAWhupb8Q=" # Added by`npx auth`.Read more: https://cli.authjs.dev
// # AUTH_GOOGLE_ID = 143546218430 - 0e7fp67308foscj3klmt550hftlvspg8.apps.googleusercontent.com
// # AUTH_GOOGLE_SECRET = GOCSPX - znBh7wEaloG - NorZ75bDPHUh2S0C

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import { AlertCircle } from "lucide-react";
import DeleteTarget from "./DeleteTarget";

function AlertDestructive({ err, success }: { err: string, success: string }) {
  return (
    <Alert variant={err ? "destructive" : "default"} className={`fixed top-20 left-5 z-50 w-fit bg-black rounded-xl ${success ?? 'booder border-green-500'}`}>
      <AlertCircle className="h-4 w-4" />
      <AlertTitle className={`font-bold ${err ? 'text-red-500' : 'text-green-500'}`}>
        {err ? "Error" : "Success"}
      </AlertTitle>
      <AlertDescription className={`font-semibold ${err ? 'text-red-400' : 'text-green-400'}`}>
        {err ? err : success}
      </AlertDescription>
    </Alert>
  )
}
