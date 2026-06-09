import z from "zod";

export const StandardErrorSchema = z.object({
  message: z
    .union([z.string(), z.array(z.string())])
    .describe('Текстовое описание ошибки или массив ошибок валидации'),
  code: z.string().describe('Унифицированный строковой код ошибки'),
  errors: z
    .record(z.string(), z.union([z.string(), z.array(z.string())]))
    .optional()
    .describe('Детализированные ошибки по полям'),
});
