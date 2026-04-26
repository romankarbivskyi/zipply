import { prisma } from "@/lib/db";
import {
  tinybird,
  type ClicksOverTimeOutput,
  type CountriesDataOutput,
  type DevicesDataOutput,
} from "@/lib/tinybird";
import {
  resolveApiSession,
  unauthorized,
  badRequest,
  notFound,
} from "@/lib/api-auth";
import { fillMissingDates, dateToISO8601 } from "@/lib/date-utils";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export const GET = async (req: Request, { params }: RouteContext) => {
  const session = await resolveApiSession(req);
  if (!session) return unauthorized();

  const { id } = await params;

  const link = await prisma.link.findUnique({
    where: { id, userId: session.userId },
  });
  if (!link) return notFound();

  const { searchParams } = new URL(req.url);
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  if (!from || !to) {
    return badRequest(
      "from and to date parameters are required (yyyy-MM-dd format)",
    );
  }

  const queryParams = {
    user_id: session.userId,
    from_date: dateToISO8601(from),
    to_date: dateToISO8601(to),
    link_id: id,
  };

  const [clicksOverTime, countriesData, devicesData] = await Promise.all([
    tinybird.clicksOverTime
      .query(queryParams)
      .then((res) => {
        const data = res.data.map((row: ClicksOverTimeOutput) => ({
          date: row.date,
          clicks: Number(row.clicks),
          uniqueVisitors: Number(row.unique_visitors),
        }));
        return fillMissingDates(data, from, to) as Array<{
          date: string;
          clicks: number;
          uniqueVisitors: number;
        }>;
      })
      .catch(() => []),

    tinybird.countriesData
      .query(queryParams)
      .then((res) =>
        res.data.map((row: CountriesDataOutput) => ({
          country: row.country,
          visitors: Number(row.visitors),
        })),
      )
      .catch(() => []),

    tinybird.devicesData
      .query(queryParams)
      .then((res) =>
        res.data.map((row: DevicesDataOutput) => ({
          device: (row.device || "other").toLowerCase(),
          visitors: Number(row.visitors),
        })),
      )
      .catch(() => []),
  ]);

  return Response.json({
    data: { link, from, to, clicksOverTime, countriesData, devicesData },
  });
};
