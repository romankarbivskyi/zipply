"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "../data-table";
import { ApiKey } from "@/lib/generated/prisma/client";
import { formatDate } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import RenameApiKeyDialog from "./rename-api-key-dialog";
import DeleteApiKeyDialog from "./delete-api-key-dialog";

const columns: ColumnDef<ApiKey>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "prefix",
    header: "Key",
    cell: ({ row }) => {
      const prefix = row.original.prefix;
      return <p>{prefix}...</p>;
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => {
      const createdAt = row.original.createdAt;
      return <p>{formatDate(createdAt)}</p>;
    },
  },
  {
    accessorKey: "action",
    header: "Action",
    cell: ({ row }) => {
      const id = row.original.id;
      const name = row.original.name;
      return (
        <div className="flex gap-2">
          <RenameApiKeyDialog id={id} name={name} />
          <DeleteApiKeyDialog id={id} />
        </div>
      );
    },
  },
];

interface ApiKeyListProps {
  data: ApiKey[];
}

const ApiKeyList = ({ data }: ApiKeyListProps) => {
  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle>
          API Keys{" "}
          <span className="text-muted-foreground">({data.length}/5)</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <DataTable columns={columns} data={data} />
      </CardContent>
    </Card>
  );
};

export default ApiKeyList;
