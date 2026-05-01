/**
 * currentDateTime.ts
 * ------------------
 * Tool: Get current date and time (market-safe reference clock)
 *
 * Provides the current system date and time
 *
 * Answers questions like:
 *   - "What is today's date?"
 *   - "What time is it right now?"
 *   - "What day is it?"
 *
 * Data source:
 *   System runtime clock (Node.js / server environment)
 *
 * Notes:
 *   - Uses America/New_York to align with U.S. market conventions
 *   - Prevents inconsistent timezone outputs across deployments
 *   - Intended as a deterministic "truth source" for time-based agent queries
 *   - New York
 *     EST (Eastern Standard Time) – UTC-5 (Winter)
 *     EDT (Eastern Daylight Time) – UTC-4 (Spring/Summer)
 *   - California
 *     PST (Pacific Standard Time) – UTC-8 (Winter)
 *     PDT (Pacific Daylight Time) – UTC-7 (Spring/Summer)
 */

import { createTool } from "@mastra/core/tools";
import { z } from "zod";

export const currentDateTime = createTool({
  id: "current-date-time",
  description: "Returns the current date and time",

  inputSchema: z.object({}),

  outputSchema: z.object({
    date: z.string(),
    time: z.string(),
  }),

  execute: async () => {
    const now = new Date();

    const date = now.toLocaleDateString("en-US", {
        timeZone: "America/New_York",
        year: "numeric",
        month: "long",
        day: "numeric",
      });

    const time = now.toLocaleTimeString("en-US", {
        timeZone: "America/New_York",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });

    const tz = new Intl.DateTimeFormat("en-US", {
        timeZone: "America/New_York",
        timeZoneName: "short",
    })
      .formatToParts(now)
      .find(part => part.type === "timeZoneName")
      ?.value ?? "";

    return {
      date,
      time: `${time} ${tz}`
    };
  },
});