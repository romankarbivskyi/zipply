"use client";

import { IconCheck, IconCopy } from "@tabler/icons-react";
import { useState } from "react";
import { Button, buttonVariants } from "./ui/button";
import { VariantProps } from "class-variance-authority";

type CopyButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    text: string;
  };

export const CopyButton = ({ text, ...props }: CopyButtonProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Button onClick={handleCopy} {...props} title="Copy short URL">
      {copied ? (
        <>
          <IconCheck className="size-3.5" />
        </>
      ) : (
        <>
          <IconCopy className="size-3.5" />
        </>
      )}
    </Button>
  );
};
