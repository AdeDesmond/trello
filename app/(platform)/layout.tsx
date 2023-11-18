import { ClerkProvider } from "@clerk/nextjs";

const PlatFromLayout = ({ children }: { children: React.ReactNode }) => {
  return <ClerkProvider>{children}</ClerkProvider>;
};

export default PlatFromLayout;
