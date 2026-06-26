import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import News from "./pages/News";
import Clubs from "./pages/Clubs";
import ClubDetail from "./pages/ClubDetail";
import Events from "./pages/Events";
import EventDetail from "./pages/EventDetail";
import Teams from "./pages/Teams";
import TeamDetail from "./pages/TeamDetail";
import Alumni from "./pages/Alumni";
import AlumniCreate from "./pages/AlumniCreate";
import AlumniDetail from "./pages/AlumniDetail";
import Students from "./pages/Students";
import AlumniSolidarity from "./pages/AlumniSolidarity";
import RequireAuth from "./components/auth/RequireAuth";
import Kvkk from "./pages/Kvkk";
import KullanimSartlari from "./pages/KullanimSartlari";
import CerezPolitikasi from "./pages/CerezPolitikasi";
import AcikRiza from "./pages/AcikRiza";
import GizlilikPolitikasi from "./pages/GizlilikPolitikasi";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import CookieBanner from "./components/legal/CookieBanner";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/news" element={<News />} />
          <Route path="/clubs" element={<Clubs />} />
          <Route path="/clubs/:slug" element={<ClubDetail />} />
          <Route path="/etkinlikler" element={<Events />} />
          <Route path="/etkinlikler/:slug" element={<EventDetail />} />
          <Route path="/takimlar" element={<Teams />} />
          <Route path="/takimlar/:slug" element={<TeamDetail />} />
          <Route element={<RequireAuth />}>
            <Route path="/students" element={<Students />} />
            <Route path="/alumni" element={<Alumni />} />
            <Route path="/alumni/yeni" element={<AlumniCreate />} />
            <Route path="/alumni/:id" element={<AlumniDetail />} />
          </Route>
          <Route path="/mezun-dayanisma" element={<AlumniSolidarity />} />
          <Route path="/gizlilik-politikasi" element={<GizlilikPolitikasi />} />
          <Route path="/cerez-politikasi" element={<CerezPolitikasi />} />
          <Route path="/kullanim-sartlari" element={<KullanimSartlari />} />
          <Route path="/acik-riza" element={<AcikRiza />} />
          <Route path="/kvkk" element={<Kvkk />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<Admin />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <CookieBanner />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
