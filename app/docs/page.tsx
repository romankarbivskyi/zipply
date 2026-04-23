import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Key, Link as LinkIcon, BarChart2, Trash2, Edit3 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const CodeBlock = ({
  code,
  language = "json",
}: {
  code: string;
  language?: string;
}) => (
  <div className="mt-4 overflow-x-auto rounded-md border bg-zinc-950 p-4 font-mono text-sm leading-relaxed text-zinc-50">
    <div className="mb-2 text-xs font-medium tracking-wider text-zinc-400 uppercase">
      {language}
    </div>
    <pre>
      <code>{code}</code>
    </pre>
  </div>
);

const EndpointCard = ({
  method,
  path,
  title,
  description,
  icon: Icon,
  requestBody,
  responseBody,
}: {
  method: "GET" | "POST" | "PATCH" | "DELETE";
  path: string;
  title: string;
  description: string;
  icon: any;
  requestBody?: string;
  responseBody: string;
}) => {
  const methodColors = {
    GET: "bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-500 border-transparent",
    POST: "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-500 border-transparent",
    PATCH:
      "bg-orange-100 text-orange-700 dark:bg-orange-500/10 dark:text-orange-500 border-transparent",
    DELETE:
      "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-500 border-transparent",
  };

  return (
    <Card className="overflow-hidden border shadow-none">
      <CardHeader className="bg-muted/30 border-b pb-4">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div className="flex items-center gap-3">
            <div className="bg-muted rounded-md border p-2">
              <Icon className="text-primary h-4 w-4" />
            </div>
            <div>
              <CardTitle className="text-base">{title}</CardTitle>
              <p className="text-muted-foreground mt-0.5 text-sm">
                {description}
              </p>
            </div>
          </div>
          <div className="bg-background flex items-center gap-2 rounded-md border px-3 py-1.5 font-mono text-sm">
            <Badge
              variant="outline"
              className={`${methodColors[method]} rounded border-0 px-2 py-0 font-semibold`}
            >
              {method}
            </Badge>
            <span className="text-foreground">{path}</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        <div className="grid grid-cols-1 gap-8 xl:grid-cols-2">
          {requestBody && (
            <div className="space-y-2">
              <h4 className="flex items-center gap-2 text-sm font-medium">
                Request Body
              </h4>
              <CodeBlock code={requestBody} />
            </div>
          )}
          <div className={`space-y-2 ${!requestBody ? "col-span-full" : ""}`}>
            <h4 className="flex items-center gap-2 text-sm font-medium">
              Response Example
            </h4>
            <CodeBlock code={responseBody} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default function DocsPage() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  return (
    <div className="bg-background text-foreground selection:bg-primary/20 flex min-h-screen w-full flex-1 flex-col">
      <div className="bg-muted/20 w-full border-b">
        <div className="container mx-auto max-w-5xl px-4 py-12 sm:px-6">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="max-w-2xl space-y-3 text-center md:text-left">
              <Badge
                variant="secondary"
                className="rounded-full px-3 py-1 text-xs font-medium"
              >
                API Reference v1
              </Badge>
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Zipply API Documentation
              </h1>
              <p className="text-muted-foreground text-lg">
                Integrate robust link management directly into your services
                using our REST API.
              </p>
            </div>
            <div className="flex gap-3">
              <Button asChild variant="default">
                <Link href="/dashboard/api">Manage API Keys</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/dashboard">Dashboard</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-5xl space-y-16 px-4 py-12 sm:px-6">
        <section className="space-y-6">
          <div className="border-b pb-4">
            <h2 className="flex items-center gap-2 text-2xl font-semibold">
              <Key className="text-muted-foreground h-5 w-5" />
              Authentication
            </h2>
            <p className="text-muted-foreground mt-2">
              Authenticate requests using your API key in the{" "}
              <code className="bg-muted rounded border px-1.5 py-0.5 font-mono text-sm">
                Authorization
              </code>{" "}
              header.
            </p>
          </div>

          <Card className="border shadow-none">
            <CardContent className="p-6">
              <div className="space-y-4">
                <p className="text-muted-foreground text-sm">
                  All endpoints require a valid API key sent as a Bearer token.
                  Generate keys securely via your dashboard. Do not expose them
                  in client-side code.
                </p>
                <CodeBlock
                  language="bash"
                  code={`curl -X GET "${baseUrl}/api/v1/links" \\
  -H "Authorization: Bearer zipply_abc123.def456"`}
                />
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="space-y-8">
          <div className="border-b pb-4">
            <h2 className="flex items-center gap-2 text-2xl font-semibold">
              <LinkIcon className="text-muted-foreground h-5 w-5" />
              Links
            </h2>
            <p className="text-muted-foreground mt-2">
              Programmatically shorten, retrieve, update, and delete URLs.
            </p>
          </div>

          <div className="grid gap-6">
            <EndpointCard
              method="GET"
              path="/api/v1/links?page=1&search="
              title="List Links"
              description="Retrieve a paginated list of your shortened links. Supports optional search filtering."
              icon={LinkIcon}
              responseBody={`{
  "data": [
    {
      "id": "cm78xw...",
      "originalUrl": "https://example.com/very-long",
      "shortCode": "my-promo",
      "title": "Example Domain",
      "clicks": 142,
      "createdAt": "2026-04-23T08:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "totalPages": 5,
    "total": 42
  }
}`}
            />

            <EndpointCard
              method="POST"
              path="/api/v1/links"
              title="Create Link"
              description="Shorten a new URL. Provide a custom short code or leave blank to auto-generate."
              icon={Edit3}
              requestBody={`{
  "url": "https://example.com/very-long-url",
  "shortCode": "my-promo" // Optional
}`}
              responseBody={`{
  "data": {
    "id": "cm78yz...",
    "originalUrl": "https://example.com/very-long-url",
    "shortCode": "my-promo",
    "title": "Example Domain",
    "clicks": 0,
    "createdAt": "2026-04-23T08:05:00.000Z"
  }
}`}
            />

            <EndpointCard
              method="PATCH"
              path="/api/v1/links/:id"
              title="Update Link"
              description="Modify an existing link's destination URL or its short code."
              icon={Edit3}
              requestBody={`{
  "url": "https://example.com/new-destination",
  "shortCode": "new-promo"
}`}
              responseBody={`{
  "data": {
    "id": "cm78yz...",
    "originalUrl": "https://example.com/new-destination",
    "shortCode": "new-promo",
    "updatedAt": "2026-04-23T08:10:00.000Z"
  }
}`}
            />

            <EndpointCard
              method="DELETE"
              path="/api/v1/links"
              title="Delete Links"
              description="Batch delete one or more links by providing their IDs."
              icon={Trash2}
              requestBody={`{
  "ids": ["cm78yz...", "cm78ab..."]
}`}
              responseBody={`{
  "success": true
}`}
            />

            <EndpointCard
              method="GET"
              path="/api/v1/links/:id/stats?period=30d"
              title="Get Link Stats"
              description="Retrieve analytical data including clicks over time, geographic distribution, and devices."
              icon={BarChart2}
              responseBody={`{
  "data": {
    "link": { ... },
    "period": "30d",
    "clicksOverTime": [
      { "date": "2026-04-22", "clicks": 15, "uniqueVisitors": 12 },
      { "date": "2026-04-23", "clicks": 42, "uniqueVisitors": 38 }
    ],
    "countriesData": [
      { "country": "US", "visitors": 120 },
      { "country": "UK", "visitors": 45 }
    ],
    "devicesData": [
      { "device": "desktop", "visitors": 95 },
      { "device": "mobile", "visitors": 70 }
    ]
  }
}`}
            />
          </div>
        </section>
      </div>
    </div>
  );
}
