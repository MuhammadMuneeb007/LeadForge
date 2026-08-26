import type { Metadata } from "next";
import { LeadForgeApp } from "@/components/LeadForgeApp";
import { JsonLd } from "@/components/JsonLd";
import { githubUrl, siteDescription, siteName, siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: siteName,
          url: siteUrl,
          description: siteDescription,
          applicationCategory: "BusinessApplication",
          operatingSystem: "Web browser",
          isAccessibleForFree: true,
          license: "https://opensource.org/licenses/MIT",
          codeRepository: githubUrl,
          inLanguage: "en",
        }}
      />
      <LeadForgeApp />
    </>
  );
}
