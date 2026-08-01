"use client";

import { PiluLogo } from "@/components/branding/logo";
import { useLocale } from "@/components/i18n/locale-provider";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export function PrivacyPolicyContent() {
  const { t } = useLocale();
  const p = t((d) => d.legal.privacyPolicy);

  return (
    <div className="legal-page">
      <div className="legal-page__header">
        <PiluLogo size="small" />
        <Link href="/" className="article-reader__back">
          <ArrowLeft size={16} aria-hidden="true" /> {p.backToPilu}
        </Link>
      </div>

      <article className="article-reader legal-page__content">
        <header>
          <span>{p.eyebrow}</span>
          <h1>{p.pageTitle}</h1>
          <p>
            <strong>{p.effectiveDateLabel}</strong> {p.effectiveDateValue}
            <br />
            <strong>{p.lastUpdatedLabel}</strong> {p.lastUpdatedValue}
          </p>
        </header>

        <p className="legal-page__intro">{p.introPara1}</p>
        <p className="legal-page__intro">{p.introPara2}</p>

        <section className="article-content-section">
          <h2>{p.s1.heading}</h2>
          <p>{p.s1.body}</p>
        </section>

        <section className="article-content-section">
          <h2>{p.s2.heading}</h2>
          <p><strong>{p.s2.sub1Heading}</strong></p>
          <ul>{p.s2.sub1Items.map((item) => <li key={item}>{item}</li>)}</ul>
          <p><strong>{p.s2.sub2Heading}</strong></p>
          <ul>{p.s2.sub2Items.map((item) => <li key={item}>{item}</li>)}</ul>
          <p><strong>{p.s2.sub3Heading}</strong></p>
          <ul>{p.s2.sub3Items.map((item) => <li key={item}>{item}</li>)}</ul>
          <p><strong>{p.s2.sub4Heading}</strong></p>
          <ul>
            <li>{p.s2.sub4Item1}</li>
            <li>{p.s2.sub4Item2}</li>
          </ul>
          <p><strong>{p.s2.sub5Heading}</strong></p>
          <ul>{p.s2.sub5Items.map((item) => <li key={item}>{item}</li>)}</ul>
        </section>

        <section className="article-content-section">
          <h2>{p.s3.heading}</h2>
          <p>{p.s3.lead}</p>
          <ul>{p.s3.items.map((item) => <li key={item}>{item}</li>)}</ul>
          <p>{p.s3.notSellPara}</p>
        </section>

        <section className="article-content-section">
          <h2>{p.s4.heading}</h2>
          <p>{p.s4.lead}</p>
          <div className="legal-page__table-wrap">
            <table>
              <thead>
                <tr>
                  <th>{p.s4.tableHeaders.recipient}</th>
                  <th>{p.s4.tableHeaders.purpose}</th>
                  <th>{p.s4.tableHeaders.data}</th>
                </tr>
              </thead>
              <tbody>
                {p.s4.rows.map((row) => (
                  <tr key={row.recipient}>
                    <td><strong>{row.recipient}</strong></td>
                    <td>{row.purpose}</td>
                    <td>{row.data}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p>{p.s4.closingPara}</p>
        </section>

        <section className="article-content-section">
          <h2>{p.s5.heading}</h2>
          <p>{p.s5.body}</p>
        </section>

        <section className="article-content-section">
          <h2>{p.s6.heading}</h2>
          <p>{p.s6.body}</p>
        </section>

        <section className="article-content-section">
          <h2>{p.s7.heading}</h2>
          <p>{p.s7.lead}</p>
          <ul>
            {p.s7.items.map((item) => (
              <li key={item.bold}><strong>{item.bold}</strong>{item.rest}</li>
            ))}
          </ul>
          <p>{p.s7.contactPara}</p>
        </section>

        <section className="article-content-section">
          <h2>{p.s8.heading}</h2>
          <p>{p.s8.body}</p>
        </section>

        <section className="article-content-section">
          <h2>{p.s9.heading}</h2>
          <p>{p.s9.body}</p>
        </section>

        <section className="article-content-section">
          <h2>{p.s10.heading}</h2>
          <p>{p.s10.body}</p>
        </section>

        <section className="article-content-section">
          <h2>{p.s11.heading}</h2>
          <p>{p.s11.body}</p>
        </section>

        <section className="article-content-section">
          <h2>{p.s12.heading}</h2>
          <p>{p.s12.lead}</p>
          <p className="legal-page__contact">
            {p.s12.contactEmailPlaceholder}
            <br />
            {p.s12.contactEntityPlaceholder}
          </p>
        </section>

        <p className="library-disclaimer">
          <em>{p.draftDisclaimer}</em>
        </p>
      </article>
    </div>
  );
}
