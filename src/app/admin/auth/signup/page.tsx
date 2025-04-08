'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Mail, Lock, User } from "lucide-react";
import { createUser } from '@/actions/user-actions';

const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Password must be at least 6 characters'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SignupFormData = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupFormData) => {
    try {
      setIsLoading(true);
      setError(null);
            createUser(data.name, data.email, data.password, 'admin')

      router.push('/admin/auth/login');
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <Card className="w-full max-w-[320px]">
        <CardHeader className="space-y-2 pb-6">
          <CardTitle className="text-2xl font-semibold text-center">Create account</CardTitle>
          <p className="text-sm text-muted-foreground text-center">
            Enter your details to create your account
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  {...register('name')}
                  id="name"
                  type="text"
                  autoComplete="name"
                  placeholder="Full name"
                  className={cn(
                    "pl-9 h-10",
                    errors.name && "border-destructive focus-visible:ring-destructive/20"
                  )}
                />
              </div>
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  {...register('email')}
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="Email address"
                  className={cn(
                    "pl-9 h-10",
                    errors.email && "border-destructive focus-visible:ring-destructive/20"
                  )}
                />
              </div>
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  {...register('password')}
                  id="password"
                  type="password"
                  autoComplete="new-password"
                  placeholder="Password"
                  className={cn(
                    "pl-9 h-10",
                    errors.password && "border-destructive focus-visible:ring-destructive/20"
                  )}
                />
              </div>
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  {...register('confirmPassword')}
                  id="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  placeholder="Confirm password"
                  className={cn(
                    "pl-9 h-10",
                    errors.confirmPassword && "border-destructive focus-visible:ring-destructive/20"
                  )}
                />
              </div>
              {errors.confirmPassword && (
                <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
              )}
            </div>

            {error && (
              <div className="text-sm text-destructive text-center">{error}</div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className={cn(
                buttonVariants({ variant: "default" }),
                "w-full h-10",
                isLoading && "opacity-50 cursor-not-allowed"
              )}
            >
              {isLoading ? "Creating account..." : "Create account"}
            </button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
