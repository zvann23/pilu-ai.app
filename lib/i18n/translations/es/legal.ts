import type { LegalDict } from "@/lib/i18n/dictionary/legal";

export const legal = {
  privacyPolicy: {
    eyebrow: "Legal", pageTitle: "Política de privacidad — Pilu",
    effectiveDateLabel: "Fecha de entrada en vigor:", effectiveDateValue: "[INSERTAR FECHA]",
    lastUpdatedLabel: "Última actualización:", lastUpdatedValue: "[INSERTAR FECHA]",
    backToPilu: "Volver a Pilu",
    introPara1: 'Esta Política de privacidad explica cómo Pilu ("Pilu", "nosotros" o "nuestro") recopila, utiliza, comparte y protege la información cuando usas la aplicación Pilu (la "Aplicación"). Pilu está desarrollada por [INSERTAR NOMBRE DE LA ENTIDAD LEGAL — p. ej., Salmatek SRL / Salmatek PFA], con sede en Rumanía.',
    introPara2: "Al usar Pilu, aceptas la recopilación y el uso de información tal como se describe en esta política.",
    s1: {
      heading: "1. A quién está dirigido Pilu",
      body: "Pilu está diseñado para padres y cuidadores de niños desde el embarazo hasta aproximadamente los 4 años. Pilu está destinado a ser usado por adultos — el titular de la cuenta debe tener 18 años o más. La información sobre un niño (tu bebé) es introducida por ti, el padre/madre o cuidador, en nombre del niño. Pilu no está dirigido a niños y no recopila conscientemente información directamente de niños.",
    },
    s2: {
      heading: "2. Información que recopilamos",
      sub1Heading: "2.1 Información de la cuenta",
      sub1Items: ["Nombre, dirección de correo electrónico y foto de perfil (si se proporciona mediante inicio de sesión de Google)", "Datos de autenticación (a través de Supabase Auth — correo/contraseña o Google OAuth)"],
      sub2Heading: "2.2 Información de familia y bebé",
      sub2Items: [
        "Estructura familiar/del hogar, incluidos otros padres o cuidadores que invites a compartir el acceso",
        "Detalles del perfil del bebé: nombre, fecha de nacimiento, sexo",
        "Registros de alimentación, sueño y pañales",
        "Mediciones de crecimiento e hitos",
        "Registros de vacunas y medicamentos",
        "Fotos y entradas que añadas al Libro de recuerdos o al Diario",
        "Notas, entradas y cualquier otro contenido que decidas registrar en la Aplicación",
      ],
      sub3Heading: "2.3 Conversaciones con Pregunta a Pilu",
      sub3Items: ["Preguntas y mensajes que envíes al asistente de IA de Pilu, y el contexto necesario para responderlos (p. ej., la edad de tu bebé, datos registrados relevantes)"],
      sub4Heading: "2.4 Información de suscripción y facturación",
      sub4Item1: "Nivel de suscripción (Gratuito, Elite o Premium) y estado de facturación",
      sub4Item2: "Los pagos de las suscripciones Elite/Premium se procesan mediante Google Play Billing — Pilu no recibe ni almacena los datos de tu tarjeta de pago. La propia política de privacidad de Google rige la transacción de pago en sí.",
      sub5Heading: "2.5 Información de uso y del dispositivo",
      sub5Items: ["Información técnica básica (tipo de dispositivo, versión de la app, registros de fallos) para ayudarnos a mantener y mejorar la Aplicación"],
    },
    s3: {
      heading: "3. Cómo usamos tu información",
      lead: "Usamos la información que recopilamos para:",
      items: [
        "Proporcionar las funciones principales de la Aplicación (seguimiento, cronología, recordatorios, uso compartido familiar, Sonidos para dormir, etc.)",
        "Impulsar el asistente Pregunta a Pilu, incluido el envío del contexto relevante a nuestro proveedor de IA (Google Gemini — ver Sección 4) para generar respuestas",
        "Procesar y gestionar las suscripciones Elite/Premium",
        "Enviarte notificaciones a las que te hayas suscrito (p. ej., recordatorios, actualizaciones de actividad familiar)",
        "Mantener la seguridad, integridad y fiabilidad de la Aplicación",
        "Mejorar y desarrollar nuevas funciones",
      ],
      notSellPara: "No vendemos tu información personal ni la de tu hijo a terceros, y no la usamos con fines publicitarios.",
    },
    s4: {
      heading: "4. Cómo compartimos información",
      lead: "Compartimos información solo según sea necesario para operar la Aplicación:",
      tableHeaders: { recipient: "Destinatario", purpose: "Propósito", data: "Datos implicados" },
      rows: [
        { recipient: "Supabase", purpose: "Alojamiento de base de datos y autenticación (alojado en la UE)", data: "Todos los datos de cuenta, familia y bebé" },
        { recipient: "Google (API de Gemini)", purpose: "Impulsa el asistente Pregunta a Pilu", data: "Tus preguntas y el contexto necesario para responderlas" },
        { recipient: "Google (Inicio de sesión)", purpose: "Método de inicio de sesión opcional", data: "Nombre, correo electrónico, foto de perfil" },
        { recipient: "Google Play Billing", purpose: "Procesa los pagos de suscripciones Elite/Premium", data: "Estado de la suscripción; los datos de pago los gestiona Google en su totalidad" },
        { recipient: "Vercel", purpose: "Alojamiento de la aplicación", data: "Datos técnicos/de uso necesarios para prestar la Aplicación" },
      ],
      closingPara: "Exigimos a estos proveedores que gestionen tus datos de forma segura y solo para los fines aquí descritos. No compartimos los datos de tu familia o de tu bebé con ningún otro padre/madre, cuidador o familia fuera de la que creas o a la que te unas explícitamente.",
    },
    s5: {
      heading: "5. Uso compartido en familia",
      body: "Si invitas a otros padres/madres o cuidadores a tu familia en Pilu, podrán ver el perfil o perfiles del bebé y los datos registrados asociados a esa familia, según los permisos de su rol. Invita solo a personas en las que confíes con esta información.",
    },
    s6: {
      heading: "6. Retención de datos",
      body: "Conservamos tu información mientras tu cuenta esté activa, o según sea necesario para proporcionar las funciones de la Aplicación (por ejemplo, mantener disponible con el tiempo la cronología y los recuerdos de tu bebé). Si eliminas tu cuenta, eliminamos o anonimizamos tus datos personales en un plazo de [INSERTAR PLAZO — p. ej., 30 días], salvo que estemos obligados por ley a conservar determinados registros.",
    },
    s7: {
      heading: "7. Tus derechos",
      lead: "Si te encuentras en el Espacio Económico Europeo, el Reino Unido u otra jurisdicción con protecciones similares, tienes derecho a:",
      items: [
        { bold: "Acceder", rest: " a los datos personales que tenemos sobre ti y tu familia" },
        { bold: "Corregir", rest: " datos inexactos" },
        { bold: "Eliminar", rest: ' tu cuenta y los datos asociados ("derecho al olvido")' },
        { bold: "Exportar", rest: ' tus datos en un formato portátil ("derecho a la portabilidad de datos")' },
        { bold: "Oponerte o restringir", rest: " determinados tratamientos" },
        { bold: "Retirar el consentimiento", rest: " en cualquier momento cuando el tratamiento se base en el consentimiento" },
      ],
      contactPara: "Para ejercer cualquiera de estos derechos, contáctanos en [INSERTAR CORREO DE CONTACTO]. Responderemos dentro del plazo exigido por la ley aplicable.",
    },
    s8: {
      heading: "8. Seguridad",
      body: "Utilizamos medidas estándar del sector para proteger tu información, incluido el cifrado en tránsito, políticas de seguridad a nivel de fila que restringen el acceso a los datos solo a miembros autorizados de la familia, y autenticación segura. Ningún método de almacenamiento o transmisión es 100% seguro y no podemos garantizar una seguridad absoluta.",
    },
    s9: {
      heading: "9. Transferencias internacionales de datos",
      body: "Nuestra base de datos principal está alojada en la Unión Europea (Fráncfort, a través de Supabase). Algunos proveedores de servicios (como Google, para Gemini AI e Inicio de sesión) pueden procesar datos fuera de la UE/EEE. Cuando esto ocurre, nos basamos en las salvaguardas adecuadas exigidas por la legislación de protección de datos aplicable.",
    },
    s10: {
      heading: "10. Privacidad de los menores",
      body: "Pilu es una herramienta para padres, madres y cuidadores, no un servicio dirigido o comercializado a menores. No permitimos conscientemente que los menores creen cuentas o interactúen directamente con la Aplicación. La información sobre un menor la proporciona su padre/madre o tutor legal, quien es responsable de la exactitud e idoneidad de lo que registra.",
    },
    s11: {
      heading: "11. Cambios en esta política",
      body: 'Podemos actualizar esta Política de privacidad de vez en cuando. Si realizamos cambios importantes, te notificaremos en la Aplicación o por correo electrónico antes de que los cambios entren en vigor. La fecha de "Última actualización" en la parte superior de esta página refleja la revisión más reciente.',
    },
    s12: {
      heading: "12. Contáctanos",
      lead: "Si tienes preguntas sobre esta Política de privacidad o sobre cómo se maneja tu información, contáctanos en:",
      contactEmailPlaceholder: "[INSERTAR CORREO DE CONTACTO]",
      contactEntityPlaceholder: "[INSERTAR NOMBRE Y DIRECCIÓN DE LA ENTIDAD LEGAL, SI CORRESPONDE]",
    },
    draftDisclaimer: "Este documento es un borrador inicial basado en las funciones actuales de Pilu. Debería ser revisado por un abogado calificado antes de su publicación — en particular las secciones sobre plazos de retención de datos, transferencias internacionales y tus obligaciones específicas según la legislación rumana/de la UE (RGPD) — antes de considerarse tu política final y vinculante.",
  },
} satisfies LegalDict;
