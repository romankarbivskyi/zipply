"use client";

import { Separator } from "../ui/separator";
import { SidebarTrigger } from "../ui/sidebar";

interface HeadingProps {
  title: string;
}

const Heading = ({ title }: HeadingProps) => {
  return (
    <div className="flex items-center gap-2 border-b p-2">
      <SidebarTrigger />
      <Separator
        orientation="vertical"
        className="data-[orientation=vertical]:h-4"
      />
      <h1 className="text-base font-medium">{title}</h1>
    </div>
  );
};

export default Heading;
