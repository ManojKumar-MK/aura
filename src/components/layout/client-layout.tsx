"use client";

import { ContactModalProvider } from "@/components/ui/contact-modal";

interface Props {
  children: React.ReactNode;
  inquiryOptions: string[];
  contactEmail: string;
  showEmail: boolean;
}

export function ClientLayout({ children, inquiryOptions, contactEmail, showEmail }: Props) {
  return (
    <ContactModalProvider inquiryOptions={inquiryOptions} contactEmail={contactEmail} showEmail={showEmail}>
      {children}
    </ContactModalProvider>
  );
}
