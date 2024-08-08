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
  const placeholders = Array(6).fill(0); // Array to generate 5 placeholder rows

  return (
    <div className="overflow-x-auto">
      <Table className="min-w-full border-collapse border border-gray-300">
        <TableHeader>
          <TableRow
            className="grid grid-cols-5 border-b border-gray-300"
            style={{ gridTemplateColumns: "1fr 1fr 1fr 2fr" }}
          >
            <TableHead className="py-2 px-4 border-r border-gray-300 text-left">
              <div className="flex justify-center items-center">Word</div>
            </TableHead>
            <TableHead className="py-2 px-4 border-r border-gray-300 text-left">
              <div className="flex justify-center items-center">Pronunciation</div>
            </TableHead>
            <TableHead className="py-2 px-4 border-r border-gray-300 text-left">
              <div className="flex justify-center items-center">Play Pronunciation</div>
            </TableHead>
            <TableHead className="py-2 px-4 text-left align-middle">
              <div className="pl-4">Key Meanings</div>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {placeholders.map((_, index) => (
            <React.Fragment key={index}>
              <TableRow className="grid grid-cols-5 cursor-pointer hover:bg-gray-100 border-b border-gray-300">
                <TableCell className="text-base border-r font-medium border-gray-300 align-middle">
                  <div className="flex justify-center items-center h-full py-4">
                    <div className="py-4 animate-pulse bg-gray-200 rounded h-6 w-24"></div>
                  </div>
                </TableCell>
                <TableCell className="text-base border-r border-gray-300 align-middle">
                  <div className="flex justify-center items-center h-full py-4">
                    <div className="py-4 animate-pulse bg-gray-200 rounded h-6 w-24"></div>
                  </div>
                </TableCell>
                <TableCell className="border-r border-gray-300">
                  <div className="py-4 flex justify-center">
                    <Button className="rounded-full bg-gray-200 animate-pulse h-8 w-24"></Button>
                  </div>
                </TableCell>
                <TableCell className="py-1 px-4 align-middle">
                  <ul className="list-disc list-inside pl-5 text-lg">
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

export default DashboardSkeleton;
