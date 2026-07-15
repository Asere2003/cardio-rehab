import { AppHeader } from "@/components/layout/app-header";

type PublicLayoutProps = {
  children: React.ReactNode;
  showLoginButton?: boolean;
  showBackButton?: boolean;
};

export function PublicLayout({
  children,
  showLoginButton = false,
  showBackButton = false

}: PublicLayoutProps) {
  return (
    <main className="min-h-svh bg-background">
      <section className="mx-auto flex min-h-svh w-full max-w-6xl flex-col px-5 py-6 sm:px-8 lg:px-10">
        <AppHeader showLoginButton={showLoginButton} showBackButton={showBackButton}/>
        {children}
      </section>
    </main>
  );
}