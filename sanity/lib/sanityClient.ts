import { createClient } from "@sanity/client";

import { apiVersion, dataset, projectId, useCdn } from "../env";

export const sanityClient = createClient({
  apiVersion,
  dataset,
  projectId,
  useCdn,
  stega: {
    enabled: false, // Optional: disable stega entirely
  },
});
