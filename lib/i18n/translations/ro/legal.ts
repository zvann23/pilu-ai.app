import type { LegalDict } from "@/lib/i18n/dictionary/legal";

export const legal = {
  privacyPolicy: {
    eyebrow: "Legal", pageTitle: "Politica de confidențialitate — Pilu",
    effectiveDateLabel: "Data intrării în vigoare:", effectiveDateValue: "[INSERAȚI DATA]",
    lastUpdatedLabel: "Ultima actualizare:", lastUpdatedValue: "[INSERAȚI DATA]",
    backToPilu: "Înapoi la Pilu",
    introPara1: 'Această Politică de confidențialitate explică modul în care Pilu ("Pilu", "noi" sau "al nostru") colectează, utilizează, distribuie și protejează informațiile atunci când folosiți aplicația Pilu ("Aplicația"). Pilu este dezvoltată de [INSERAȚI NUMELE ENTITĂȚII LEGALE — de ex. Salmatek SRL / Salmatek PFA], cu sediul în România.',
    introPara2: "Prin utilizarea Pilu, sunteți de acord cu colectarea și utilizarea informațiilor așa cum sunt descrise în această politică.",
    s1: {
      heading: "1. Cui se adresează Pilu",
      body: "Pilu este conceput pentru părinți și îngrijitori ai copiilor, de la sarcină până la aproximativ 4 ani. Pilu este destinat utilizării de către adulți — titularul contului trebuie să aibă cel puțin 18 ani. Informațiile despre un copil (bebelușul dumneavoastră) sunt introduse de dumneavoastră, părintele sau îngrijitorul, în numele copilului. Pilu nu se adresează copiilor și nu colectează cu bună știință informații direct de la copii.",
    },
    s2: {
      heading: "2. Informațiile pe care le colectăm",
      sub1Heading: "2.1 Informații despre cont",
      sub1Items: ["Nume, adresă de email și fotografie de profil (dacă sunt furnizate prin autentificare Google)", "Date de autentificare (prin Supabase Auth — email/parolă sau Google OAuth)"],
      sub2Heading: "2.2 Informații despre familie și bebeluș",
      sub2Items: [
        "Structura familiei/gospodăriei, inclusiv alți părinți sau îngrijitori pe care îi invitați să acceseze contul",
        "Detalii despre profilul bebelușului: nume, data nașterii, sex",
        "Înregistrări de hrănire, somn și scutece",
        "Măsurători de creștere și repere de dezvoltare",
        "Înregistrări de vaccinuri și medicamente",
        "Fotografii și înregistrări adăugate în Cartea de amintiri sau Jurnalul zilnic",
        "Notițe, înregistrări și orice alt conținut pe care alegeți să îl salvați în Aplicație",
      ],
      sub3Heading: "2.3 Conversații cu Întreabă Pilu",
      sub3Items: ["Întrebări și mesaje trimise asistentului AI al Pilu, precum și contextul necesar pentru a răspunde la acestea (de ex. vârsta bebelușului, date relevante înregistrate)"],
      sub4Heading: "2.4 Informații despre abonament și facturare",
      sub4Item1: "Nivelul de abonament (Gratuit, Elite sau Premium) și starea facturării",
      sub4Item2: "Plățile pentru abonamentele Elite/Premium sunt procesate prin Google Play Billing — Pilu nu primește și nu stochează detaliile cardului dumneavoastră de plată. Politica de confidențialitate a Google guvernează tranzacția de plată în sine.",
      sub5Heading: "2.5 Informații despre utilizare și dispozitiv",
      sub5Items: ["Informații tehnice de bază (tipul dispozitivului, versiunea aplicației, jurnale de erori) pentru a ne ajuta să întreținem și să îmbunătățim Aplicația"],
    },
    s3: {
      heading: "3. Cum utilizăm informațiile dumneavoastră",
      lead: "Utilizăm informațiile colectate pentru a:",
      items: [
        "Oferi funcțiile de bază ale Aplicației (urmărire, cronologie, mementouri, partajare în familie, Sunete pentru somn etc.)",
        "Alimenta asistentul Întreabă Pilu, inclusiv prin trimiterea contextului relevant furnizorului nostru de AI (Google Gemini — vezi Secțiunea 4) pentru a genera răspunsuri",
        "Procesa și gestiona abonamentele Elite/Premium",
        "Trimite notificări pentru care ați optat (de ex. mementouri, actualizări de activitate în familie)",
        "Menține securitatea, integritatea și fiabilitatea Aplicației",
        "Îmbunătăți și dezvolta funcții noi",
      ],
      notSellPara: "Nu vindem informațiile dumneavoastră personale sau ale copilului dumneavoastră unor terți și nu le folosim în scopuri publicitare.",
    },
    s4: {
      heading: "4. Cum distribuim informațiile",
      lead: "Distribuim informații doar în măsura necesară pentru a opera Aplicația:",
      tableHeaders: { recipient: "Destinatar", purpose: "Scop", data: "Date implicate" },
      rows: [
        { recipient: "Supabase", purpose: "Găzduire bază de date și autentificare (găzduită în UE)", data: "Toate datele de cont, familie și bebeluș" },
        { recipient: "Google (Gemini API)", purpose: "Alimentează asistentul Întreabă Pilu", data: "Întrebările dumneavoastră și contextul necesar pentru a răspunde la acestea" },
        { recipient: "Google (Autentificare)", purpose: "Metodă opțională de autentificare", data: "Nume, email, fotografie de profil" },
        { recipient: "Google Play Billing", purpose: "Procesează plățile pentru abonamentele Elite/Premium", data: "Starea abonamentului; detaliile de plată sunt gestionate integral de Google" },
        { recipient: "Vercel", purpose: "Găzduirea aplicației", data: "Date tehnice/de utilizare necesare pentru a livra Aplicația" },
      ],
      closingPara: "Le solicităm acestor furnizori să gestioneze datele dumneavoastră în siguranță și doar în scopurile descrise aici. Nu distribuim datele familiei sau ale bebelușului dumneavoastră niciunui alt părinte, îngrijitor sau familie în afara celei pe care o creați sau la care vă alăturați explicit.",
    },
    s5: {
      heading: "5. Partajare în familie",
      body: "Dacă invitați alți părinți sau îngrijitori în familia dumneavoastră în Pilu, aceștia vor putea vedea profilul (profilurile) bebelușului și datele înregistrate asociate acelei familii, în funcție de permisiunile rolului lor. Invitați doar persoane în care aveți încredere cu aceste informații.",
    },
    s6: {
      heading: "6. Păstrarea datelor",
      body: "Păstrăm informațiile dumneavoastră atât timp cât contul este activ sau după cum este necesar pentru a oferi funcțiile Aplicației (de exemplu, pentru a păstra disponibilă cronologia și amintirile bebelușului dumneavoastră în timp). Dacă vă ștergeți contul, ștergem sau anonimizăm datele dumneavoastră personale în termen de [INSERAȚI TERMENUL — de ex. 30 de zile], cu excepția cazurilor în care suntem obligați prin lege să păstrăm anumite înregistrări.",
    },
    s7: {
      heading: "7. Drepturile dumneavoastră",
      lead: "Dacă vă aflați în Spațiul Economic European, Regatul Unit sau o altă jurisdicție cu protecții similare, aveți dreptul să:",
      items: [
        { bold: "Accesați", rest: " datele personale pe care le deținem despre dumneavoastră și familia dumneavoastră" },
        { bold: "Corectați", rest: " date inexacte" },
        { bold: "Ștergeți", rest: ' contul dumneavoastră și datele asociate ("dreptul la ștergere")' },
        { bold: "Exportați", rest: ' datele dumneavoastră într-un format portabil ("dreptul la portabilitatea datelor")' },
        { bold: "Vă opuneți sau restricționați", rest: " anumite prelucrări" },
        { bold: "Retrageți consimțământul", rest: " în orice moment, atunci când prelucrarea se bazează pe consimțământ" },
      ],
      contactPara: "Pentru a exercita oricare dintre aceste drepturi, contactați-ne la [INSERAȚI EMAILUL DE CONTACT]. Vom răspunde în termenul cerut de legislația aplicabilă.",
    },
    s8: {
      heading: "8. Securitate",
      body: "Folosim măsuri standard din industrie pentru a proteja informațiile dumneavoastră, inclusiv criptare în tranzit, politici de securitate la nivel de rând care restricționează accesul la date doar membrilor autorizați ai familiei și autentificare securizată. Nicio metodă de stocare sau transmitere nu este 100% sigură și nu putem garanta o securitate absolută.",
    },
    s9: {
      heading: "9. Transferuri internaționale de date",
      body: "Baza noastră de date principală este găzduită în Uniunea Europeană (Frankfurt, prin Supabase). Unii furnizori de servicii (precum Google, pentru Gemini AI și Autentificare) pot procesa date în afara UE/SEE. În aceste cazuri, ne bazăm pe garanțiile adecvate cerute de legislația aplicabilă privind protecția datelor.",
    },
    s10: {
      heading: "10. Confidențialitatea copiilor",
      body: "Pilu este un instrument pentru părinți și îngrijitori, nu un serviciu destinat sau promovat copiilor. Nu permitem cu bună știință copiilor să creeze conturi sau să interacționeze direct cu Aplicația. Informațiile despre un copil sunt furnizate de părintele sau tutorele legal, care este responsabil pentru acuratețea și adecvarea a ceea ce înregistrează.",
    },
    s11: {
      heading: "11. Modificări ale acestei politici",
      body: 'Este posibil să actualizăm periodic această Politică de confidențialitate. Dacă facem modificări semnificative, vă vom notifica în Aplicație sau prin email înainte ca modificările să intre în vigoare. Data „Ultima actualizare” din partea de sus a acestei pagini reflectă cea mai recentă revizuire.',
    },
    s12: {
      heading: "12. Contactați-ne",
      lead: "Dacă aveți întrebări despre această Politică de confidențialitate sau despre modul în care sunt gestionate datele dumneavoastră, contactați-ne la:",
      contactEmailPlaceholder: "[INSERAȚI EMAILUL DE CONTACT]",
      contactEntityPlaceholder: "[INSERAȚI NUMELE ȘI ADRESA ENTITĂȚII LEGALE, DACĂ ESTE CAZUL]",
    },
    draftDisclaimer: "Acest document este un draft inițial bazat pe funcțiile actuale ale Pilu. Ar trebui revizuit de un avocat calificat înainte de publicare — în special secțiunile privind termenele de păstrare a datelor, transferurile internaționale și obligațiile dumneavoastră specifice conform legislației române/UE (GDPR) — înainte ca acesta să fie considerat politica dumneavoastră finală, obligatorie.",
  },
} satisfies LegalDict;
