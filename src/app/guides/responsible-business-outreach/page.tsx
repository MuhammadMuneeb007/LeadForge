import type { Metadata } from "next";
import { GuideLayout } from "@/components/guides/GuideLayout";
import { AdSenseScript } from "@/components/ads/AdSenseScript";
import { JsonLd } from "@/components/JsonLd";
import { siteUrl } from "@/lib/site";

const title = "Responsible business outreach";
const description =
  "Verifying public details, judging relevance, telling business contacts from personal ones, honouring opt-outs, and keeping a prospect list current and minimal.";
const path = "/guides/responsible-business-outreach";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: path },
  openGraph: { title: `${title} | LeadForge`, description, url: path },
  twitter: { title: `${title} | LeadForge`, description },
};

export default function OutreachGuide() {
  return (
    <>
      <AdSenseScript />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "TechArticle",
          headline: title,
          description,
          url: `${siteUrl}${path}`,
          inLanguage: "en",
          isAccessibleForFree: true,
          about: "Responsible use of public business contact information",
        }}
      />
      <GuideLayout
        slug="responsible-business-outreach"
        heading="Using a public-data list without becoming the problem."
        intro={
          <p>
            A tool that turns a map into a contact list makes it easy to reach a
            lot of businesses quickly. Whether that is useful or corrosive
            depends entirely on choices you make after the export. This guide
            sets out the practices we would expect of anyone using LeadForge. It
            is not legal advice — requirements differ by country and often by
            state or province, and you need to check what applies to you.
          </p>
        }
      >
        <section id="what-the-data-does-not-say">
          <h2>Start from what the data does not say</h2>
          <p>
            A LeadForge result means one thing: a business of this type is
            mapped at this location, and here is what its public listing
            contains. It does not mean the business is trading, that the phone
            number reaches anyone, that the e-mail address is monitored, or that
            anyone there has any interest in what you sell.
          </p>
          <p>
            Every bad outreach campaign starts by forgetting this — treating a
            row in a file as a qualified prospect because it arrived neatly
            formatted. The completeness score measures the record, not the
            opportunity. A fully populated listing for a business that closed
            two years ago scores exactly as well as one for a thriving practice.
          </p>
        </section>

        <section id="verify-before-you-use-anything">
          <h2>Verify before you use anything</h2>
          <p>
            Verification is not a formality you can skip when the list is long.
            It is the step that decides whether your outreach is informed or
            embarrassing.
          </p>
          <ul>
            <li>
              <strong>Confirm the business exists as described.</strong> Open
              its website. Does the name match? Does the address match? Is there
              any sign the site has been maintained recently?
            </li>
            <li>
              <strong>Confirm the contact detail at its own source.</strong> A
              phone number or e-mail address published by the business itself
              beats one recorded by a third party. Where they disagree, trust
              the business.
            </li>
            <li>
              <strong>Check the record is not a duplicate</strong> of another
              row under a slightly different name, and that a branch is not
              being mistaken for a head office.
            </li>
            <li>
              <strong>Check the category is right.</strong> Map tagging is
              approximate; a business filed under &ldquo;clinic&rdquo; may do
              something quite different from what you assumed.
            </li>
          </ul>
          <p>
            Records that fail verification should be deleted, not kept
            &ldquo;just in case&rdquo;. A short verified list outperforms a long
            unverified one on every measure that matters, including how you feel
            about sending it.
          </p>
        </section>

        <section id="establish-relevance">
          <h2>Establish relevance before you make contact</h2>
          <p>
            The honest test is whether you could explain, in one sentence, why
            this specific business would want to hear from you — without using
            the word &ldquo;everyone&rdquo;. If the only answer is that they
            appeared in a radius search, the outreach is not targeted, it is
            volume.
          </p>
          <p>
            Relevance is also what makes the work efficient. Contacting 30
            businesses you have a genuine reason to approach produces better
            conversations and fewer complaints than contacting 300 chosen by
            proximity. Use the filters to get there: category, distance,
            presence of a website, opening hours that suggest an active
            business. Narrowing the list in the tool is faster than apologising
            later.
          </p>
        </section>

        <section id="no-bulk-messaging">
          <h2>Do not send indiscriminate bulk messages</h2>
          <p>
            Mass unsolicited messaging is the use LeadForge is explicitly not
            built for, and it is prohibited by the{" "}
            <a href="/terms">terms of use</a>. Beyond the rules, it fails on its
            own terms: recipients mark it as spam, sending reputation degrades,
            the messages stop being delivered at all, and the businesses that
            might genuinely have wanted to hear from you never see it.
          </p>
          <p>
            Some practical restraints: keep volumes proportionate to your actual
            capacity to follow up; do not send a second and third message to
            someone who did not respond to the first; and never disguise a bulk
            send as a personal one. If your message would be indistinguishable
            from every other message the recipient received that week, the list
            is not the problem.
          </p>
        </section>

        <section id="business-vs-personal-contacts">
          <h2>Business contacts and personal contacts are different</h2>
          <p>
            A general business line — <em>info@</em>, <em>reception@</em>, a
            switchboard number — is published so that people can reach the
            organisation. A named individual&rsquo;s work address, or a personal
            mobile that happens to appear on a small business&rsquo;s website,
            carries a stronger expectation of privacy even though both are
            technically public.
          </p>
          <p>
            In many jurisdictions the legal treatment differs too: rules that
            are relaxed for corporate contacts are considerably stricter for
            identifiable individuals, and sole traders often fall on the
            stricter side. Prefer the generic business address wherever one
            exists. If contact discovery returns several addresses, choosing the
            role-based one is nearly always both the safer and the more
            effective option.
          </p>
          <p>
            Do not use the tool to build lists about people. LeadForge is for
            finding organisations.
          </p>
        </section>

        <section id="honour-opt-outs">
          <h2>Honour opt-outs immediately and permanently</h2>
          <p>
            When someone asks not to be contacted, that request outlives the
            file it came from. Keep a suppression list, apply it before every
            send, and — this is where public-data workflows go wrong — apply it
            to <em>new</em> exports too. Because you can re-run the same radius
            search next quarter and get the same businesses back, an opt-out
            that lives only in a deleted spreadsheet will quietly stop working.
          </p>
          <p>
            Make opting out easy: a working reply address, a clear instruction,
            and no requirement to explain themselves. Where the law specifies
            how quickly you must act on a request, treat that as the deadline,
            not the target — and act immediately in practice.
          </p>
        </section>

        <section id="know-the-rules">
          <h2>Know which rules apply to you</h2>
          <p>
            Marketing and privacy law varies widely. Depending on where you are
            and where your recipients are, obligations may cover the legal basis
            for contacting someone, whether prior consent is needed for
            particular channels, what identifying information a message must
            carry, how quickly opt-outs must be honoured, what records you must
            keep, whether a do-not-call registry must be checked before
            telephoning, and what rights individuals have over the data you hold
            about them.
          </p>
          <p>
            These rules can apply to you because of where your recipient is, not
            only where you are. They also change. We cannot tell you what
            applies to your situation, and you should not rely on any tool —
            this one included — to have done that assessment for you. If your
            outreach is significant in scale or crosses borders, get advice that
            is specific to your jurisdiction and your channel.
          </p>
        </section>

        <section id="do-not-mislead">
          <h2>Do not mislead</h2>
          <p>
            Say who you are and why you are writing. Do not imply an existing
            relationship, a referral, or a prior conversation that did not
            happen. Do not suggest that appearing in a directory means the
            business requested contact. Do not disguise a sales approach as a
            survey, a compliance notice, or a customer enquiry. Use a genuine
            sender identity and a working reply path.
          </p>
          <p>
            Where you found the details is a fair question, and being able to
            answer it plainly — &ldquo;from your public listing and your
            website&rdquo; — is a good sign your approach is defensible.
          </p>
        </section>

        <section id="keep-lists-current">
          <h2>Keep lists current, and keep them small</h2>
          <p>
            A prospect list built from map data decays quickly: businesses
            close, move, rebrand, and change numbers. A list from last year is
            not a list, it is a set of guesses. Re-verify before reusing, and
            re-run the search rather than trusting an old export for anything
            time-sensitive.
          </p>
          <p>
            Alongside currency, practise minimisation. Keep only the fields you
            actually use — a phone list does not need coordinates, and a
            mail-merge does not need opening hours. Keep records only as long as
            you have a reason to. Delete campaign exports when the campaign
            ends. Less retained data means less to secure, less to keep
            accurate, and less to be wrong about.
          </p>
          <p>
            LeadForge helps here by keeping saved lists in your own browser
            rather than on a server, and by making it a single action to clear
            them from the <a href="/about">About page</a>. Once you export, the
            file is yours to look after — store it somewhere access-controlled
            rather than a shared drive everyone can read.{" "}
            <a href="/guides/exporting-business-data">
              Exporting business data
            </a>{" "}
            covers that in more detail.
          </p>
        </section>

        <section id="respect-access-controls">
          <h2>Respect access controls and technical limits</h2>
          <p>
            Contact discovery in LeadForge reads a business&rsquo;s public
            homepage and at most one linked contact or about page. It does not
            attempt to get past logins or other access controls, and neither
            should you. If a business publishes contact details only behind a
            form, that is a decision on their part — use the form.
          </p>
          <p>
            The same restraint applies to the shared services this tool depends
            on. Rate limits and result caps exist because public map and tile
            services are community infrastructure. Working around them to
            extract data in bulk takes capacity away from everyone else, and it
            is prohibited by the terms of use.
          </p>
        </section>

        <section id="pre-send-checklist">
          <h2>A short pre-send checklist</h2>
          <ul>
            <li>
              Every record verified against the business&rsquo;s own site.
            </li>
            <li>
              A one-sentence, specific reason this business would want to hear
              from you.
            </li>
            <li>Role-based contact addresses preferred over personal ones.</li>
            <li>Suppression list applied, including to newly exported rows.</li>
            <li>Sender identity accurate, opt-out path present and working.</li>
            <li>
              Volume proportionate to your ability to have a real conversation.
            </li>
            <li>
              Only the fields and records you need, stored somewhere
              appropriate.
            </li>
            <li>Your obligations checked for your jurisdiction and channel.</li>
          </ul>
        </section>
      </GuideLayout>
    </>
  );
}
