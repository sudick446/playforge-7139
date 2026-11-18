import { ORPCError } from "@orpc/server";
import { z } from "zod";
import { eq, desc } from "drizzle-orm";
import { base } from "../__core/app";
import { auth } from "../auth";
import { db } from "../database";
import { scores } from "../database/schema";
const authed = base.use(async ({ context, next }) => {
  const session = await auth.api.getSession({ headers: context.headers });
  if (!session) throw new ORPCError("UNAUTHORIZED");
  return next({ context: { user: session.user } });
});
export const player = {
  profile: authed.handler(async ({ context }) => ({
    user: context.user,
    scores: await db
      .select()
      .from(scores)
      .where(eq(scores.userId, context.user.id))
      .orderBy(desc(scores.id))
      .limit(30),
  })),
  save: authed
    .input(
      z.object({
        game: z.enum(["Snake", "Memory", "Tic-Tac-Toe"]),
        value: z.number().int().min(0).max(100000),
      }),
    )
    .handler(async ({ context, input }) => {
      await db
        .insert(scores)
        .values({ ...input, userId: context.user.id, createdAt: new Date().toISOString() });
      return { saved: true };
    }),
};
