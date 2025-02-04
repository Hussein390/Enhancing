"use client"

import { SessionProvider } from "next-auth/react"
import Profile from "./profile"
import Target from "./target/Target"
import Image from "next/image";
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogHeader } from "@/components/ui/dialog";

export default function Header() {
  return (
    <header className="flex items-center justify-between pb-[6px] border-b mb-4">
      <div className="flex items-center justify-between gap-x-3">
        <h1 className="text-sm md:text-2xl text-blue-600 font-bold">Hussein</h1>
        <Dialog>
          <DialogTrigger>
            <Image src="/images/hussein.jpg" alt="Hussein Saleem" width={26} height={26} className="rounded-full" />
          </DialogTrigger>
          <DialogContent className="border-none text-white">
            <DialogHeader>
              <DialogTitle className="text-white">Hussein Saleem</DialogTitle>
              <DialogDescription>
                I made this app to help us watch our progress in targets for the long trem
              </DialogDescription>
            </DialogHeader>
            <Image src="/images/hussein.jpg" alt="Hussein Saleem" width={460} height={460} className="rounded-xl" />
          </DialogContent>
        </Dialog>
      </div>
      <Target />
      <SessionProvider >
        <Profile />
      </SessionProvider>
    </header>
  )

}