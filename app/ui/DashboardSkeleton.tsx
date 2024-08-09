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

const DashboardSkeleton: React.FC = () => {
  const placeholders = Array(5).fill(0); // Array to generate 5 placeholder rows

  return (
    <div className="overflow-x-auto">
      <Table className="min-w-full border-collapse border border-gray-300">
        <TableHeader>
          <TableRow className="grid grid-cols-5 border-b border-gray-300">
            <TableHead className="border-r border-gray-300">
              <div className="flex justify-center items-center h-full min-w-[60px]">
                Word
              </div>
            </TableHead>
            <TableHead className="border-r border-gray-300">
              <div className="flex justify-center items-center h-full min-w-[60px]">
                Pronunciation
              </div>
            </TableHead>
            <TableHead className="border-r border-gray-300">
              <div className="flex justify-center items-center h-full min-w-[90px]">
                Play Pronunciation
              </div>
            </TableHead>
            <TableHead>
              <div className="flex justify-center items-center h-full min-w-[100px]">
                Key Meanings
              </div>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {placeholders.map((_, index) => (
            <React.Fragment key={index}>
              <TableRow className="grid grid-cols-5 cursor-pointer hover:bg-gray-100 border-b border-gray-300">
                <TableCell className="text-base border-r font-medium border-gray-300">
                  <div className="flex justify-center items-center h-full min-w-[70px]">
                    <div className="py-4 animate-pulse bg-gray-200 rounded h-6 w-24"></div>
                  </div>
                </TableCell>
                <TableCell className="text-base border-r border-gray-300">
                  <div className="flex justify-center items-center h-full min-w-[60px]">
                    <div className="py-4 animate-pulse bg-gray-200 rounded h-6 w-24"></div>
                  </div>
                </TableCell>
                <TableCell className="border-r border-gray-300">
                  <div className="flex justify-center items-center h-full min-w-[90px]">
                    <Button className="rounded-full bg-gray-200 animate-pulse h-8 w-24" disabled></Button>
                  </div>
                </TableCell>
                <TableCell className="py-1 col-span-2">
                  <ul className="list-disc list-inside pl-5 text-lg min-w-[100px]">
                    <li className="animate-pulse bg-gray-200 rounded h-6 w-24"></li>
                    <li className="animate-pulse bg-gray-200 rounded h-6 w-24 mt-2"></li>
                  </ul>
                </TableCell>
              </TableRow>
              <TableRow className="grid grid-cols-1 bg-gray-50">
                <TableCell colSpan={4} className="py-3 px-3">
                  <div className="animate-pulse bg-gray-200 rounded h-20 w-full"></div>
                </TableCell>
              </TableRow>
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default DashboardSkeleton;
