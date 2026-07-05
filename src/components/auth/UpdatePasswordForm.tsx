import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { Lock } from "lucide-react";
import { updatePasswordSchema } from "@/schemas/auth.schema";
import type { UpdatePasswordInput } from "@/schemas/auth.schema";
import { authApi } from "@/lib/auth";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { PasswordStrength } from "./PasswordStrength";
import { toast } from "sonner";

export function UpdatePasswordForm() {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<UpdatePasswordInput>({
    resolver: zodResolver(updatePasswordSchema),
    mode: "onChange",
  });

  const password = watch("password", "");

  const onSubmit = async (values: UpdatePasswordInput) => {
    setServerError(null);
    try {
      await authApi.updatePassword(values);
      toast.success("Contraseña actualizada");
      navigate("/dashboard", { replace: true });
    } catch (e) {
      setServerError(e instanceof Error ? e.message : "No se pudo actualizar");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {serverError && (
        <div className="rounded-input border border-error/20 bg-error/5 p-3 text-small text-error">
          {serverError}
        </div>
      )}
      <div className="space-y-2">
        <Input
          label="Nueva contraseña"
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
        Actualizar contraseña
      </Button>
    </form>
  );
}
