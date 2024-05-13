import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

export const basePath = dirname(fileURLToPath(import.meta.url));

export const staticBasePath = join(basePath, "../", "/public");

export const projectRootPath = join(basePath, "../");
