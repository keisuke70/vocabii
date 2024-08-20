"use client";

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { FaCirclePlay } from "react-icons/fa6";

const removedDashboardSkeleton: React.FC = () => {
  const placeholders = Array(8).fill(0); // Array to generate 5 placeholder rows

  return (
    <div className="overflow-x-auto">
      <Table className="min-w-full border-collapse border border-gray-300">
        <TableHeader>
          <TableRow className="grid grid-cols-9 md:grid-cols-5 border-b border-gray-300">
            <TableHead className="border-r col-span-2 md:col-span-1 border-gray-300">
              <div className="flex justify-center items-center h-full min-w-[40px] md:text-base text-xs whitespace-normal break-all">
                Word
              </div>
            </TableHead>
            <TableHead className="border-r col-span-2 md:col-span-1 border-gray-300">
              <div className="flex justify-center items-center h-full min-w-[40px] md:text-base text-xs whitespace-normal break-all">
                Pron.
                <FaCirclePlay className="ml-1 p-1 md:p-0.5 text-xl text-blue-500" />
              </div>
              
            </TableHead>
            <TableHead className="border-r col-span-2 md:col-span-1 border-gray-300">
              <div className="flex justify-center items-center h-full min-w-[40px] md:text-base text-xs whitespace-normal break-word">
                Restore
              </div>
            </TableHead>
            <TableHead className="col-span-3 md:col-span-2">
              <div className="flex justify-center items-center h-full min-w-[70px] text-xs md:text-base whitespace-normal break-word">
                Key Meanings
              </div>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {placeholders.map((_, index) => (
            <React.Fragment key={index}>
              <TableRow className="grid grid-cols-9 md:grid-cols-5 cursor-pointer hover:bg-blue-50/50 border-b border-gray-300">
                <TableCell className="text-xs col-span-2 md:col-span-1 md:text-base border-r font-medium border-gray-300 whitespace-normal break-all">
                  <div className="flex justify-center items-center h-full min-w-[20px]">
                    <div className="py-4 animate-pulse bg-gray-200 rounded h-6 w-24"></div>
                  </div>
                </TableCell>
                <TableCell className="text-xs col-span-2 md:col-span-1 md:text-base border-r border-gray-300 whitespace-normal break-all">
                  <div className="flex justify-center items-center h-full min-w-[26px]">
                    <div className="py-4 animate-pulse bg-gray-200 rounded h-6 w-24"></div>
                  </div>
                </TableCell>
                <TableCell className="border-r col-span-2 md:col-span-1 border-gray-300">
                  <div className="flex justify-center items-center h-full min-w-[20px] whitespace-normal break-all">
                    <Button
                      className="rounded-full bg-gray-200 animate-pulse h-8 w-24"
                      disabled
                    ></Button>
                  </div>
                </TableCell>
                <TableCell className="p-2 col-span-3 md:col-span-2 whitespace-normal break-word">
                  <ul className="list-disc list-inside sm:pl-5 md:text-lg text-xs">
                    <li className="animate-pulse bg-gray-200 rounded h-6 w-24"></li>
                    <li className="animate-pulse bg-gray-200 rounded h-6 w-24 mt-2"></li>
                  </ul>
                </TableCell>
              </TableRow>
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default removedDashboardSkeleton;
