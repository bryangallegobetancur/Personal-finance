import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { Mail } from "lucide-react";
import { forgotPasswordSchema } from "@/schemas/auth.schema";
import type { ForgotPasswordInput } from "@/schemas/auth.schema";
import { authApi } from "@/lib/auth";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { toast } from "sonner";

export function ForgotPasswordForm() {
  const [sent, setSent] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordInput>({ resolver: zodResolver(forgotPasswordSchema) });

  const onSubmit = async (values: ForgotPasswordInput) => {
    try {
      await authApi.forgotPassword(values);
      setSent(true);
      toast.success("Revisa tu correo para restablecer la contraseña");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "No se pudo enviar el correo");
    }
  };

  if (sent) {
    return (
      <div className="space-y-5 text-center">
        <p className="text-small text-foreground">
          Si el correo existe, recibirás un enlace para restablecer tu contraseña.
        </p>
        <Link
          to="/login"
          className="inline-block text-small font-medium text-primary transition-colors hover:text-primary-hover"
        >
          Volver a iniciar sesión
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <Input
        label="Correo electrónico"
        type="email"
        placeholder="ana@ejemplo.com"
        icon={<Mail className="h-5 w-5" strokeWidth={1.75} />}
        error={errors.email?.message}
        hasError={!!errors.email}
        {...register("email")}
      />
      <Button type="submit" loading={isSubmitting} size="lg" className="w-full">
        Enviar enlace
      </Button>
    </form>
  );
}
