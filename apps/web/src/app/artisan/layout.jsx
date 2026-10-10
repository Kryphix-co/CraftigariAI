import { ArtisanAuthGuard } from "@/features/auth/ArtisanAuthGuard";
import { AuthProvider } from "@/features/auth/AuthContext";

export default function ArtisanLayout({ children }) {
 return (
  <AuthProvider>
   <ArtisanAuthGuard>{children}</ArtisanAuthGuard>
  </AuthProvider>
 );
}
