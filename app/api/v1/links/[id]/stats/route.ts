import { prisma } from "@/lib/db";
import {
  resolveApiSession,
  unauthorized,
  badRequest,
  notFound,
} from "@/lib/api-auth";
import { dateToISO8601 } from "@/lib/date-utils";
import {
  queryClicksOverTime,
  queryCountriesData,
  queryDevicesData,
  queryBrowsersData,
  queryOSData,
} from "@/data/analytics";

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
    userId: session.userId,
    fromDate: dateToISO8601(from),
    toDate: dateToISO8601(to),
    linkId: id,
  };

  const [clicksOverTime, countriesData, devicesData, browsersData, osData] =
    await Promise.all([
      queryClicksOverTime(queryParams),
      queryCountriesData(queryParams),
      queryDevicesData(queryParams),
      queryBrowsersData(queryParams),
      queryOSData(queryParams),
    ]);

  return Response.json({
    data: {
      link,
      from,
      to,
      clicksOverTime,
      countriesData,
      devicesData,
      browsersData,
      osData,
    },
  });
};
