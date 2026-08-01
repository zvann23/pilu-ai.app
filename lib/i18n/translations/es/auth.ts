import type { AuthDict } from "@/lib/i18n/dictionary/auth";

export const auth = {
  login: {
    eyebrow: "Bienvenido de nuevo", title: "Inicia sesión en Pilu", subtitle: "El compañero tranquilo de tu bebé, justo donde lo dejaste.",
    emailLabel: "Correo electrónico", passwordLabel: "Contraseña", signingIn: "Iniciando sesión…", signIn: "Iniciar sesión",
    newToPilu: "¿Nuevo en Pilu?", createAccount: "Crear una cuenta", or: "o",
    invalidCredentials: "Ese correo y esa contraseña no coinciden.",
    callbackFailed: "Ese enlace de inicio de sesión no funcionó — inténtalo de nuevo.",
  },
  signUp: {
    eyebrow: "Empecemos", title: "Crea tu cuenta de Pilu", subtitle: "Un espacio tranquilo y privado para los pequeños momentos de tu familia.",
    emailLabel: "Correo electrónico", passwordLabel: "Contraseña", or: "o",
    passwordTooShort: "La contraseña debe tener al menos 8 caracteres.",
    creatingAccount: "Creando cuenta…", createAccount: "Crear cuenta",
    alreadyHaveAccount: "¿Ya tienes una cuenta?", signIn: "Iniciar sesión", privacyPolicy: "Política de privacidad",
    confirmationSentTemplate: "Revisa {email} para ver un enlace de confirmación y terminar de crear tu cuenta.",
    backToSignIn: "Volver a iniciar sesión",
  },
  google: { redirecting: "Redirigiendo…", continueWithGoogle: "Continuar con Google" },
  onboarding: {
    eyebrow: "Ya casi está", title: "Configura tu familia", subtitle: "Unos pocos pasos rápidos y Pilu estará listo para ti.",
    errorCreateFamily: "No se pudo crear tu familia. Inténtalo de nuevo.",
    errorJoinInvite: "Ese código de invitación no funcionó — revísalo e inténtalo de nuevo.",
    errorSaveBaby: "No se pudo guardar el perfil de tu bebé. Inténtalo de nuevo.",
  },
  babyForm: {
    heading: "Cuéntanos sobre tu bebé", body: "Esto crea el perfil real de tu bebé en Pilu. Solo el nombre es obligatorio — añade el resto cuando estés listo.",
    nameLabel: "Nombre del bebé", namePlaceholder: "Nombre del bebé", nicknameLabel: "Apodo", nicknamePlaceholder: "Cómo sueles llamarlo", optional: "Opcional",
    dobLabel: "Fecha de nacimiento", sexLabel: "Sexo", sexNotSpecified: "Prefiero no decirlo", sexFemale: "Femenino", sexMale: "Masculino", sexIntersex: "Intersexual",
    birthWeightLabel: "Peso al nacer (kg)", birthLengthLabel: "Longitud al nacer (cm)",
    motherNameLabel: "Nombre de la mamá", motherNamePlaceholder: "Nombre de la mamá", fatherNameLabel: "Nombre del papá", fatherNamePlaceholder: "Nombre del papá",
    saving: "Guardando…", continueLabel: "Continuar",
  },
} satisfies AuthDict;
