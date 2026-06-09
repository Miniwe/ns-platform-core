import { createZodDto } from "nestjs-zod";
import { StandardErrorSchema } from "./standard-error.schema";

export class StandardErrorDto extends createZodDto(StandardErrorSchema) {}