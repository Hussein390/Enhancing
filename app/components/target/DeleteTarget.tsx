"use client";

import React, { FormEvent, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/ui/input";

type CreateTargetProps = {
  setIsOpen: (value: string) => void;
  setErrorMessage: (value: string) => void;
  setSuccessMessage: (value: string) => void;
};

export default function DeleteTarget({ setIsOpen, setErrorMessage, setSuccessMessage }: CreateTargetProps) {

  const [TargetName, setTargetName] = useState('');
  // 

  // 
  async function Target(e: FormEvent) {
    e.preventDefault();

    if (!TargetName) return;

    setIsOpen('delete');
    setErrorMessage('');
    setSuccessMessage('');
    try {
      const response = await fetch(`/api/createTarget?name=${TargetName}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      // Check if the request failed
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Something went wrong");
      }

      setSuccessMessage(TargetName + " deleted successfully")
      setTargetName("");

    } catch (error: unknown) {
      setErrorMessage('')
      if (error instanceof Error) {
        setErrorMessage(TargetName + " is not exists")
        console.error(error.message);
      } else {
        console.error("An unknown error occurred");
      }
    }
  }
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (cardRef.current && !cardRef.current.contains(event.target as Node)) {
        setIsOpen('delete');
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setIsOpen]);
  return (
    <div className="relative z-40 ">

      <Card ref={cardRef} className="fixed top-52 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white w-[250px] md:w-[350px]">
        <CardHeader>
          <CardTitle>Delete Target</CardTitle>
          <CardDescription >Are you sure you want to delete a target</CardDescription>
        </CardHeader>
        <form onSubmit={Target}>
          <CardContent>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">Name</Label>
                <Input min={7} value={TargetName} onChange={e => setTargetName(e.target.value)} id="name" placeholder="Target Name" />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="bg-slate-100 hover:bg-slate-200" type="submit">Delete Target</Button>
          </CardFooter>
        </form>
      </Card>

    </div >
  );
}

