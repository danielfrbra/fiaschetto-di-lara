import type { APIRoute } from "astro";
import { loadEvents, toIcs, type Ev } from "../../lib/events";
import { eventPath } from "../../i18n";
export async function getStaticPaths() {
  return (await loadEvents()).map((e) => ({ params: { slug: e.slug }, props: { e } }));
}
export const GET: APIRoute = ({ props, site }) => {
  const e = props.e as Ev;
  const url = new URL(eventPath("it", e.slug), site).toString();
  return new Response(toIcs(e, url), { headers: { "Content-Type": "text/calendar; charset=utf-8" } });
};
