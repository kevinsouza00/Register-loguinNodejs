const z = require("zod");

const comicSchema = z.object({
  name: z.string(),
  issue: z.number(),
  publisher: z.string(),
  release_year: z.number(),
});

module.exports = comicSchema;
