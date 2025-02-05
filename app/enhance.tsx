'use client'
import { DataProvider } from "./components/provider";
import GetYears from "./components/target/GetYears";
export default function Enhance() {

  return (
    <DataProvider>
      <div className="relative container md:w-[380px] mx-auto p-3 select-none">
        <h1 className="text-4xl  text-center font-semibold">This is <span className="text-blue-500">{new Date().getFullYear()}</span> Dude</h1>
        <p className="text-slate-400 text-center mt-1">Do not wish it was easier, wish you were better </p>
        <p className="text-slate-400 text-center mt-1">It is time to enhance, does not it!</p>
        <GetYears />
      </div >
    </DataProvider>
  );
}
