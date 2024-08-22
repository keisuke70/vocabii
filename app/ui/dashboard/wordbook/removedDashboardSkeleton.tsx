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
import { FaCirclePlay, FaStar, FaChevronDown } from "react-icons/fa6";
const RemovedDashboardSkeleton: React.FC = () => {
  const placeholders = Array(8).fill(0);

  return (
    <div className="overflow-x-auto">
      <Table className="min-w-full border-collapse border border-gray-300">
        <TableHeader>
          <TableRow className="grid grid-cols-10 border-b border-gray-300">
            <TableHead className="border-r col-span-1 md:col-span-1 border-gray-300 px-1 md:px-4">
              <div className="flex justify-center items-center h-full min-w-[30px] md:text-base text-xs whitespace-normal break-all">
                Select
              </div>
            </TableHead>
            <TableHead className="border-r col-span-2 border-gray-300 px-1 md:px-4">
              <div className="flex justify-center items-center h-full min-w-[40px] md:text-base text-xs whitespace-normal break-all">
                Word
              </div>
            </TableHead>
            <TableHead className="border-r col-span-2 border-gray-300 px-1 md:px-4">
              <div className="flex justify-center items-center h-full min-w-[40px] md:text-base text-xs whitespace-normal break-all">
                Pron.
                <FaCirclePlay className="ml-1 p-1 md:p-0.5 text-xl text-blue-500" />
              </div>
            </TableHead>
            <TableHead className="border-r col-span-2 border-gray-300 px-1 md:px-4">
              <div className="flex justify-center items-center h-full min-w-[40px] md:text-base text-xs whitespace-normal break-all">
                Restore
              </div>
            </TableHead>
            <TableHead className="col-span-3">
              <div className="flex justify-center items-center h-full min-w-[70px] text-xs md:text-base whitespace-normal break-word">
                Key Meanings
              </div>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {placeholders.map((_, index) => (
            <React.Fragment key={index}>
              <TableRow className="grid grid-cols-10 cursor-pointer hover:bg-blue-50/50 border-b border-gray-300">
                <TableCell className="p-2 text-xs col-span-1 border-r border-gray-300 whitespace-normal break-all">
                  <div className="flex justify-center items-center h-full">
                    <div className="animate-pulse bg-gray-200 rounded h-6 w-6"></div>
                  </div>
                </TableCell>
                <TableCell className="p-2 text-xs col-span-2 md:text-base border-r font-medium border-gray-300 whitespace-normal break-all">
                  <div className="flex justify-center items-center h-full min-w-[20px]">
                    <div className="py-4 animate-pulse bg-gray-200 rounded h-6 w-24"></div>
                  </div>
                </TableCell>
                <TableCell className="p-2 text-xs col-span-2 md:text-base border-r border-gray-300 whitespace-normal break-all">
                  <div className="flex justify-center items-center h-full min-w-[26px]">
                    <div className="py-4 animate-pulse bg-gray-200 rounded h-6 w-24"></div>
                  </div>
                </TableCell>
                <TableCell className="p-1 md:px-8 text-xs col-span-2 md:text-base border-r border-gray-300 relative whitespace-normal break-all">
                  <div className="flex justify-center items-center h-full">
                    <div className="py-4 animate-pulse bg-gray-200 rounded h-6 w-24"></div>
                    <FaChevronDown className="absolute left-1 bottom-0 transform -translate-y-1/2 opacity-0 group-hover:opacity-30 transition-opacity" />
                  </div>
                </TableCell>

                <TableCell className="p-2 col-span-3 whitespace-normal break-word">
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

export default RemovedDashboardSkeleton;
