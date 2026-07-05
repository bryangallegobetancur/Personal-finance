import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Mail, Lock } from "lucide-react";
import { loginSchema } from "@/schemas/auth.schema";
import type { LoginInput } from "@/schemas/auth.schema";
import { authApi } from "@/lib/auth";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { toast } from "sonner";

export function LoginForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || "/dashboard";

  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (values: LoginInput) => {
    setServerError(null);
    try {
      await authApi.login(values);
      toast.success("Sesión iniciada");
      navigate(from, { replace: true });
    } catch (e) {
      setServerError(e instanceof Error ? e.message : "No se pudo iniciar sesión");
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
        label="Correo electrónico"
        type="email"
        autoComplete="email"
        placeholder="ana@ejemplo.com"
        icon={<Mail className="h-5 w-5" strokeWidth={1.75} />}
        error={errors.email?.message}
        hasError={!!errors.email}
        {...register("email")}
      />

      <Input
        label="Contraseña"
        type="password"
        autoComplete="current-password"
        placeholder="••••••••"
        icon={<Lock className="h-5 w-5" strokeWidth={1.75} />}
        error={errors.password?.message}
        hasError={!!errors.password}
        {...register("password")}
      />

      <div className="flex justify-end">
        <Link
          to="/forgot-password"
          className="text-caption font-medium text-primary transition-colors hover:text-primary-hover"
        >
          ¿Olvidaste tu contraseña?
        </Link>
      </div>

      <Button type="submit" loading={isSubmitting} size="lg" className="w-full">
        Iniciar sesión
      </Button>

      <p className="text-center text-small text-muted-foreground">
        ¿No tienes cuenta?{" "}
        <Link
          to="/register"
          className="font-medium text-primary transition-colors hover:text-primary-hover"
        >
          Regístrate
        </Link>
      </p>
    </form>
  );
}
