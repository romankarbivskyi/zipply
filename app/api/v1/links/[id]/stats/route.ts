import { prisma } from "@/lib/db";
import {
  tinybird,
  type ClicksOverTimeOutput,
  type CountriesDataOutput,
  type DevicesDataOutput,
} from "@/lib/tinybird";
import { resolveApiSession, unauthorized, badRequest, notFound } from "@/lib/api-auth";

interface RouteContext {
  params: Promise<{ id: string }>;
}

const VALID_PERIODS = ["7d", "30d", "90d"];

export const GET = async (req: Request, { params }: RouteContext) => {
  const session = await resolveApiSession(req);
  if (!session) return unauthorized();

  const { id } = await params;

  const link = await prisma.link.findUnique({ where: { id, userId: session.userId } });
  if (!link) return notFound();

  const { searchParams } = new URL(req.url);
  const period = searchParams.get("period") ?? "30d";
  if (!VALID_PERIODS.includes(period)) {
    return badRequest(`period must be one of: ${VALID_PERIODS.join(", ")}`);
  }

  const queryParams = { user_id: session.userId, period, link_id: id };

  const [clicksOverTime, countriesData, devicesData] = await Promise.all([
    tinybird.clicksOverTime
      .query(queryParams)
      .then((res) =>
        res.data.map((row: ClicksOverTimeOutput) => ({
          date: row.date,
          clicks: Number(row.clicks),
          uniqueVisitors: Number(row.unique_visitors),
        })),
      )
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

  return Response.json({ data: { link, period, clicksOverTime, countriesData, devicesData } });
};
