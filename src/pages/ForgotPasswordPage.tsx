import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";

export function ForgotPasswordPage() {
  return (
    <div>
      <h2 className="mb-2 text-h3 font-semibold text-foreground">Recuperar contraseña</h2>
      <p className="mb-6 text-small text-muted-foreground">
        Te enviaremos un enlace para restablecerla.
      </p>
      <ForgotPasswordForm />
    </div>
  );
}
