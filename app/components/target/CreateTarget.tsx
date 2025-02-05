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
import { DataYears } from "../provider";

type CreateTargetProps = {
  setIsOpen: (value: string) => void;
  setErrorMessage: (value: string) => void;
  setSuccessMessage: (value: string) => void;
};
type month = {
  id: string;
  MonthName: string;
  yearsId: string | null;
  days: [];
}
export default function CreateTarget({ setIsOpen, setErrorMessage, setSuccessMessage }: CreateTargetProps) {

  const [TargetName, setTargetName] = useState('');
  const { setDays } = DataYears()
  // 
  const cardRef = useRef<HTMLDivElement>(null);
  const year = new Date().getFullYear();

  // 
  async function Target(e: FormEvent) {
    e.preventDefault();

    if (!TargetName) return;

    setIsOpen('create');
    setErrorMessage('');
    setSuccessMessage('');
    try {
      const response = await fetch("/api/createTarget", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: TargetName,
          years: year,
        }),
      });

      // Check if the request failed
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Something went wrong");
      }
      const currentMonth = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(new Date());


      try {
        const res = await fetch(`/api/createTarget?name=${encodeURIComponent(TargetName)}`, {
          method: 'GET', // No body for GET requests
          headers: { "Content-Type": "application/json" },
        });

        if (!res.ok) {
          console.error("Failed to fetch years:", res.statusText);
          return;
        }

        const data = await res.json();
        const month = await data[0].months.filter((month: month) => month.MonthName === currentMonth);
        setDays(month[0].days)
        localStorage.setItem('month', month[0].MonthName)
        localStorage.setItem('monthId', month[0].id)
        localStorage.setItem('year', data[0].years);
        localStorage.setItem('yearId', data[0].id);
        localStorage.setItem('yearName', data[0].name);
      } catch (err) {
        console.log(err)
      }

      setSuccessMessage(TargetName + " created successfully ")
      setTargetName("");
    } catch (error: unknown) {
      setErrorMessage('');
      if (error instanceof Error) {
        setErrorMessage("we already have this name: " + TargetName);
        console.error(error.message);
      } else {
        console.error("An unknown error occurred");
      }
    }
  }


  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (cardRef.current && !cardRef.current.contains(event.target as Node)) {
        setIsOpen('create');
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  return (
    <div className="relative z-40">

      <Card ref={cardRef} className="fixed top-52 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white w-[250px] md:w-[350px]">
        <CardHeader>
          <CardTitle>Create Target</CardTitle>
          <CardDescription>Do Your best to make Progress</CardDescription>
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
            <Button className="bg-slate-100 hover:bg-slate-200" type="submit">Create Target</Button>
          </CardFooter>
        </form>
      </Card>

    </div >
  );
}

