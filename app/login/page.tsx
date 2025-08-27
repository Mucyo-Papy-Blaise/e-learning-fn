import { LoginForm } from '@/components/auth/login-form';
import Head from 'next/head';

export default function LoginPage() {
  return (
    <><Head>
      <title>Login</title>
      <meta name="description" content="login page" />
    </Head>
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 via-white to-orange-100">
        <LoginForm />
      </main></>
  );
}