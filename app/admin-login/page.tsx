"use client";

import { useState } from "react";
import { login, register } from "./actions";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function AdminLoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleLogin(formData: FormData) {
    setLoading(true);
    setError(null);
    setSuccess(null);
    const result = await login(formData);
    if (result?.error) {
      setError(result.error);
    }
    setLoading(false);
  }

  async function handleRegister(formData: FormData) {
    setLoading(true);
    setError(null);
    setSuccess(null);
    const result = await register(formData);
    if (result?.error) {
      setError(result.error);
    } else if (result?.success) {
      setSuccess(result.success);
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-parchment rounded-2xl shadow-soft p-8">
        <div className="text-center mb-8">
          <h1 className="font-heading text-3xl mb-2">LEORA</h1>
          <p className="text-muted-foreground">Admin Portal Login</p>
        </div>

        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-ink-soft mb-1">Email</label>
            <Input name="email" type="email" placeholder="admin@example.com" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink-soft mb-1">Password</label>
            <Input name="password" type="password" required />
          </div>

          {error && (
            <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-md">
              {error}
            </div>
          )}
          {success && (
            <div className="p-3 bg-status-approved/10 text-status-approved text-sm rounded-md">
              {success}
            </div>
          )}

          <div className="flex gap-2">
            <Button formAction={handleLogin} type="submit" variant="primary" className="flex-1" disabled={loading}>
              Sign In
            </Button>
            <Button formAction={handleRegister} type="submit" variant="outline" className="flex-1" disabled={loading}>
              Register
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
