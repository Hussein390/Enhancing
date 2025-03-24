"use client"
import { Input } from '@/components/ui/input';
import { Skeleton } from "@/components/ui/skeleton"

import React, { useEffect, useRef, useState } from 'react'
import { DataYears } from '../provider';
type year = {
  id: string,
  years: number,
  name: string,
  months: [];
}
type month = {
  id: string;
  MonthName: string;
  yearsId: string | null;
  days: [];
}

export default function GetYears() {
  const [years, setYears] = useState<year[] | null>(null);
  const [months, setMonths] = useState<month[]>([]);
  const [isYears, setIsYears] = useState(false);
  const [isMonths, setIsMonths] = useState(false);
  const { days, setDays } = DataYears();
  //

  const [isBoxOpen, setIsBoxOpen] = useState(Array(days.length).fill(false));
  let sccessed: number = 0;
  let failed: number = 0;

  ///
  let StoreYear: string | null = null;
  let StoreMonth: string | null = null;
  let StoreYearId: string | null = null;
  let StoreYearName: string | null = null;
  let StoreMonthId: string | null = null;

  if (typeof window !== 'undefined') {
    StoreYear = localStorage.getItem('year');
    StoreMonth = localStorage.getItem('month');
    StoreYearId = localStorage.getItem('yearId');
    StoreMonthId = localStorage.getItem('monthId');
    StoreYearName = localStorage.getItem('yearName')
  }

  async function GetDataOnload() {
    try {
      const res = await fetch(`/api/createTarget?id=${encodeURIComponent(StoreYearId!)}`, {
        method: 'GET',
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        console.error("Failed to fetch years:", res.statusText);
        return;
      }

      const data: year = await res.json();
      const month: month[] | undefined = data.months.filter((month: month) => month.id === StoreMonthId);
      setDays(month![0].days)
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error.message);
      } else {
        console.error("An unknown error occurred");
      }
    }
  }
  async function GetData(name: string) {
    try {
      const res = await fetch(`/api/createTarget?name=${encodeURIComponent(name)}`, {
        method: 'GET', // No body for GET requests
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        console.error("Failed to fetch years:", res.statusText);
        return;
      }

      const data: year[] = await res.json();
      setYears(data)
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    GetDataOnload();
  }, [])



  function GetYears(item: { years: number, id: string, name: string, months: [] }) {
    setMonths(item.months)
    setIsMonths(prev => !prev);
    document.getElementById('year')!.textContent = String(item.years);
    localStorage.setItem('year', String(item.years));
    localStorage.setItem('yearId', String(item.id));
    localStorage.setItem('yearName', String(item.name));
  }
  async function GetMonths(item: { id: string, MonthName: string, days: [] }) {
    setIsMonths(prev => !prev)
    setDays(item.days)
    document.getElementById('month')!.textContent = item.MonthName;
    localStorage.setItem('month', item.MonthName)
    localStorage.setItem('monthId', item.id)
  }

  /// days
  async function UpdateDay({ dayId, isTrue, postion }: { dayId: string, isTrue: boolean, postion: number }) {
    const res = await fetch("/api/createTarget", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        dayId,
        isTrue,
        postion
      }),
    });
    await res.json()
  }
  function box(index: number) {
    const newIsBoxOpen = [...isBoxOpen];
    newIsBoxOpen[index] = !newIsBoxOpen[index];
    setIsBoxOpen(newIsBoxOpen);
  }
  function getResults(e: string, dayId: string, id: number, postion: number) {
    const result = document.getElementById(`${id}`);
    const GoodDay = { dayId, isTrue: true, postion }
    const BadDay = { dayId, isTrue: false, postion }
    if (e === 'm') {
      result!.textContent = 'M';
      result?.classList.remove('text-green-500');
      result?.classList.add('text-red-500');
      UpdateDay(BadDay)
    }
    else if (e === 'p') {
      result!.textContent = 'P';
      result?.classList.remove('text-red-500');
      result?.classList.add('text-green-500');
      UpdateDay(GoodDay)
    }
    document.getElementById(`div-${id}`)?.classList.add('pointer-events-none');
  }


  days.forEach(item => {
    if (item.isTrue) sccessed++;
    else if (item.isTrue === false) failed++;
  })
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (cardRef.current && !cardRef.current.contains(event.target as Node)) {
        setIsMonths(false);
        setIsYears(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  return (
    <div>
      <div className=" w-[200px] mx-auto mt-4">
        <div className="flex justify-between">
          <span className="text-green-500 font-semibold">Sccessed: {sccessed ?? 0}</span>
          <span className="text-red-500 font-semibold">Failed: {failed ?? 0}</span>
        </div>

        <div className="mt-2">
          <span className="bg-green-500 h-1 block rounded-md" style={{ width: (sccessed / 30) * 100 }}></span>
          <span className="bg-red-500 h-1 block mt-2 rounded-md" style={{ width: (failed / 30) * 100 }}></span>
        </div>
      </div>
      <div ref={cardRef} className="flex items-center w-fit mx-auto gap-x-2 -z-50">
        <div className="relative bg-white w-[200px] border border-black cursor-pointer p-3 rounded mx-auto my-5 flex justify-between items-center" onClick={() => setIsYears(prev => !prev)}>
          <div className="flex gap-x-1 font-semibold"><p id="month">{StoreMonth ?? "February"}</p> . <p id="year">{StoreYear ?? '2025'}</p></div>
          <span className="font-bold text-xl">↓</span>
          <div className={`${isYears ? 'flex' : 'hidden'} bg-white absolute top-14 z-30 left-0 w-full  flex-col gap-y-2 border`}>
            <Input type="text" placeholder='Search...' onClick={e => e.stopPropagation()} onChange={e => GetData(e.target.value)} className='' />

            {
              years ? years.map(item => (
                <button key={item.id} className="p-2 flex items-center justify-between hover:bg-blue-500 bg-slate-300 hover:text-white" onClick={() => GetYears(item)}><span className='text-sm'>{item.years}</span> <span className='text-sm'>{item.name}</span></button>
              ))
                :
                <Skeleton key={1} className="w-full h-[40px]  p-2">No Results found</Skeleton>

            }
          </div>
        </div>
        <p className="font-semibold p-1 rounded ">{StoreYearName || "No Fap"}</p>
        <div className={`${isMonths ? 'flex' : 'hidden'} w-[200px] mx-auto  bg-white absolute top-[230px] z-30 left-[90px] flex-col gap-y-2 border p-2 rounded`}>
          {months.map(item => (

            <button key={item.id} className="px-2 py-1 rounded text-sm hover:bg-blue-500 bg-slate-300 hover:text-white" onClick={() => GetMonths(item)}>{item.MonthName}</button>
          ))}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-5 gap-2 text-center">
        {Array.from({ length: days.length }, (_, i) => i + 1).map((item, index) => {
          const day = days.find(item => item.postion === index);
          return (
            < div id={`div-${item}`} key={item} onClick={() => box(item)} className={`${day?.isTrue == true ? 'pointer-events-none' : day?.isTrue == false ? 'pointer-events-none' : ''} cursor-pointer relative`}>
              <h1>{item}</h1>
              <button id={`${item}`} className={`${day?.isTrue ? 'text-green-500' : 'text-red-500'} border bg-transparent size-8 border-black`}>
                {day?.isTrue === true ? 'P' : day?.isTrue === false ? 'M' : ''}
              </button>
              <div className={`${isBoxOpen[item] ? 'flex' : 'hidden'} absolute top-0 left-0 gap-x-1`}>
                <button className="bg-green-400 text-white text-sm p-1 px-2 rounded" onClick={() => getResults('p', day!.id, item, index)}>P</button>
                <button className="bg-red-400 text-white text-sm p-1 px-2 rounded" onClick={() => getResults('m', day!.id, item, index)}>M</button>
              </div>
            </div>
          )
        })}

      </div>
    </div>
  )
}
