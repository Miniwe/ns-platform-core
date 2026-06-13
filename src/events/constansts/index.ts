import z from "zod";

export const BaseEventsSchema = z.enum(['DEFAULT']);
export type BaseEvents = z.infer<typeof BaseEventsSchema>;
export const BaseEvents = BaseEventsSchema.enum;
