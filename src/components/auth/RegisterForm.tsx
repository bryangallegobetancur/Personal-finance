import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Lock } from "lucide-react";
import { registerSchema } from "@/schemas/auth.schema";
import type { RegisterInput } from "@/schemas/auth.schema";
import { authApi } from "@/lib/auth";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { PasswordStrength } from "./PasswordStrength";
import { toast } from "sonner";

export function RegisterForm() {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
  });

  const password = watch("password", "");

  const onSubmit = async (values: RegisterInput) => {
    setServerError(null);
    try {
      const data = await authApi.register(values);
      if (data?.user && !data.session) {
        toast.success("Cuenta creada. Revisa tu correo para confirmar.");
        navigate("/login");
      } else {
        toast.success("Cuenta creada");
        navigate("/dashboard");
      }
    } catch (e) {
      setServerError(e instanceof Error ? e.message : "No se pudo registrar");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {serverError && (
        <div className="rounded-input border border-error/20 bg-error/5 p-3 text-small text-error">
          {serverError}
        </div>
      )}

      <Input
        label="Nombre completo"
        placeholder="Ana Pérez"
        icon={<User className="h-5 w-5" strokeWidth={1.75} />}
        error={errors.full_name?.message}
        hasError={!!errors.full_name}
        {...register("full_name")}
      />

      <Input
        label="Correo electrónico"
        type="email"
        autoComplete="email"
        placeholder="ana@ejemplo.com"
        icon={<Mail className="h-5 w-5" strokeWidth={1.75} />}
        error={errors.email?.message}
        hasError={!!errors.email}
        {...register("email")}
      />

      <div className="space-y-2">
        <Input
          label="Contraseña"
          type="password"
          autoComplete="new-password"
          placeholder="••••••••"
          icon={<Lock className="h-5 w-5" strokeWidth={1.75} />}
          error={errors.password?.message}
          hasError={!!errors.password}
          {...register("password")}
        />
        {password && <PasswordStrength value={password} />}
      </div>

      <Input
        label="Repetir contraseña"
        type="password"
        autoComplete="new-password"
        placeholder="••••••••"
        icon={<Lock className="h-5 w-5" strokeWidth={1.75} />}
        error={errors.confirmPassword?.message}
        hasError={!!errors.confirmPassword}
        {...register("confirmPassword")}
      />

      <Button type="submit" loading={isSubmitting} size="lg" className="w-full">
        Crear cuenta
      </Button>

      <p className="text-center text-small text-muted-foreground">
        ¿Ya tienes cuenta?{" "}
        <Link
          to="/login"
          className="font-medium text-primary transition-colors hover:text-primary-hover"
        >
          Inicia sesión
        </Link>
      </p>
    </form>
  );
}
