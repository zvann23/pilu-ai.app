export type LegalDict = {
  privacyPolicy: {
    eyebrow: string; pageTitle: string; effectiveDateLabel: string; effectiveDateValue: string; lastUpdatedLabel: string; lastUpdatedValue: string; backToPilu: string;
    introPara1: string; introPara2: string;
    s1: { heading: string; body: string };
    s2: {
      heading: string;
      sub1Heading: string; sub1Items: string[];
      sub2Heading: string; sub2Items: string[];
      sub3Heading: string; sub3Items: string[];
      sub4Heading: string; sub4Item1: string; sub4Item2: string;
      sub5Heading: string; sub5Items: string[];
    };
    s3: { heading: string; lead: string; items: string[]; notSellPara: string };
    s4: {
      heading: string; lead: string;
      tableHeaders: { recipient: string; purpose: string; data: string };
      rows: { recipient: string; purpose: string; data: string }[];
      closingPara: string;
    };
    s5: { heading: string; body: string };
    s6: { heading: string; body: string };
    s7: { heading: string; lead: string; items: { bold: string; rest: string }[]; contactPara: string };
    s8: { heading: string; body: string };
    s9: { heading: string; body: string };
    s10: { heading: string; body: string };
    s11: { heading: string; body: string };
    s12: { heading: string; lead: string; contactEmailPlaceholder: string; contactEntityPlaceholder: string };
    draftDisclaimer: string;
  };
};
