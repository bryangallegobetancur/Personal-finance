import { supabase } from "@/lib/supabase";
import type {
  RegisterInput,
  LoginInput,
  ForgotPasswordInput,
  UpdatePasswordInput,
} from "@/schemas/auth.schema";

export const authApi = {
  async register({ full_name, email, password }: RegisterInput) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name } },
    });
    if (error) throw error;
    return data;
  },

  async login({ email, password }: LoginInput) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  },

  async forgotPassword({ email }: ForgotPasswordInput) {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/update-password`,
    });
    if (error) throw error;
    return data;
  },

  async updatePassword({ password }: UpdatePasswordInput) {
    const { data, error } = await supabase.auth.updateUser({ password });
    if (error) throw error;
    return data;
  },

  async signOut() {
    await supabase.auth.signOut();
  },
};
