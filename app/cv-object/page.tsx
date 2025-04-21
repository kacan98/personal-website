import React from "react";
import { getCvSettings } from "@/sanity/sanity-utils";

async function Page() {
  const cvSettings = await getCvSettings();
  return <div>{JSON.stringify(cvSettings)}</div>;
}

export default Page;
