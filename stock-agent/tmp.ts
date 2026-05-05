import { createWorkflow, createStep } from "@mastra/core/workflows";
import { z } from "zod";
import { stockWorkflow } from "./stockWorkflow";
import { Mastra } from "@mastra/core";

const stepCompare = createStep({
  id: "compare",

  inputSchema: z.object({
    symbols: z.array(z.string()),
  }),

  outputSchema: z.object({
    ranked: z.array(
      z.object({
        symbol: z.string(),
        percentFromATH: z.string().optional(),
      })
    ),
  }),

  execute: async ({ inputData }) => {
    const mastra = new Mastra({
      workflows: { stockWorkflow },
    });

    const results = await Promise.all(
      // Dynamic input of stock symbols
      inputData.symbols.map(async (symbol) => {
        const run = await mastra
          .getWorkflow("stockWorkflow")
          .createRun();

        const result = await run.start({
          inputData: { symbol },
        });

        return result.result;
      })
    );

    const ranked = results
      .map((r: any) => ({
        symbol: r.symbol,
        percentFromATH: r.percentFromATH,
        raw: parseFloat(r.percentFromATH?.split("%")[0] || "999"),
      }))
      .sort((a, b) => a.raw - b.raw);

    return { ranked };
  },
});

export const compareStocksWorkflow = createWorkflow({
  id: "compare-stocks",
  inputSchema: z.object({
    symbols: z.array(z.string()),
  }),
  outputSchema: z.object({
    ranked: z.array(
      z.object({
        symbol: z.string(),
        percentFromATH: z.string().optional(),
      })
    ),
  }),
})
  .then(stepCompare)
  .commit();