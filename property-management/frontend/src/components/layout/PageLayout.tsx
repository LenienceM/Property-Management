import type { ReactNode } from "react";
import { Navbar } from "./Navbar";
import PageFooter from "./PageFooter"; 

type Props = {
  children: ReactNode;
};

export default function PageLayout({ children }: Props) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      {/* flex-1 pushes everything below this down to the bottom */}
      <main className="flex-1">
        {children}
      </main>

      {/* Add footer */}
      <PageFooter />
    </div>
  );
}