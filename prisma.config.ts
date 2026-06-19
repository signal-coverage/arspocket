import path from "node:path";
import { loadEnvConfig } from "@next/env";
import { defineConfig } from "prisma/config";

const projectDir = process.cwd();
loadEnvConfig(projectDir);

export default defineConfig({
  schema: path.join("prisma", "schema.prisma"),
  datasource: {
    url: process.env.DATABASE_URL as string,
  },
});
