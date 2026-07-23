import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import RequireAuth from "./components/auth/RequireAuth";
import RequireProfile from "./components/auth/RequireProfile";
import CookieBanner from "./components/legal/CookieBanner";
import BetaBanner from "./components/layout/BetaBanner";

const Index = lazy(() => import("./pages/Index"));
const News = lazy(() => import("./pages/News"));
const Clubs = lazy(() => import("./pages/Clubs"));
const ClubDetail = lazy(() => import("./pages/ClubDetail"));
const Events = lazy(() => import("./pages/Events"));
const EventDetail = lazy(() => import("./pages/EventDetail"));
const Teams = lazy(() => import("./pages/Teams"));
const TeamDetail = lazy(() => import("./pages/TeamDetail"));
const Alumni = lazy(() => import("./pages/Alumni"));
const AlumniDetail = lazy(() => import("./pages/AlumniDetail"));
const Students = lazy(() => import("./pages/Students"));
const StudentDetail = lazy(() => import("./pages/StudentDetail"));
const Profil = lazy(() => import("./pages/Profil"));
const AlumniSolidarity = lazy(() => import("./pages/AlumniSolidarity"));
const Kvkk = lazy(() => import("./pages/Kvkk"));
const KullanimSartlari = lazy(() => import("./pages/KullanimSartlari"));
const CerezPolitikasi = lazy(() => import("./pages/CerezPolitikasi"));
const AcikRiza = lazy(() => import("./pages/AcikRiza"));
const GizlilikPolitikasi = lazy(() => import("./pages/GizlilikPolitikasi"));
const Contact = lazy(() => import("./pages/Contact"));
const Login = lazy(() => import("./pages/Login"));
const SifreGuncelle = lazy(() => import("./pages/SifreGuncelle"));
const Admin = lazy(() => import("./pages/Admin"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <BetaBanner />
        <Suspense fallback={<div className="py-16 text-center text-muted-foreground">Yükleniyor...</div>}>
          <Routes>
            {/* Herkese açık sayfalar: ana sayfa, login, iletişim ve yasal metinler */}
            <Route path="/" element={<Index />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/sifre-guncelle" element={<SifreGuncelle />} />
            <Route path="/gizlilik-politikasi" element={<GizlilikPolitikasi />} />
            <Route path="/cerez-politikasi" element={<CerezPolitikasi />} />
            <Route path="/kullanim-sartlari" element={<KullanimSartlari />} />
            <Route path="/acik-riza" element={<AcikRiza />} />
            <Route path="/kvkk" element={<Kvkk />} />

            {/* Giriş yeter: profilini tamamlama sayfası */}
            <Route element={<RequireAuth />}>
              <Route path="/profil" element={<Profil />} />
            </Route>

            {/* Giriş + tamamlanmış profil gerektiren sayfalar */}
            <Route element={<RequireProfile />}>
              <Route path="/news" element={<News />} />
              <Route path="/clubs" element={<Clubs />} />
              <Route path="/clubs/:slug" element={<ClubDetail />} />
              <Route path="/etkinlikler" element={<Events />} />
              <Route path="/etkinlikler/:slug" element={<EventDetail />} />
              <Route path="/takimlar" element={<Teams />} />
              <Route path="/takimlar/:slug" element={<TeamDetail />} />
              <Route path="/mezun-dayanisma" element={<AlumniSolidarity />} />
              <Route path="/students" element={<Students />} />
              <Route path="/students/:id" element={<StudentDetail />} />
              <Route path="/alumni" element={<Alumni />} />
              <Route path="/alumni/:id" element={<AlumniDetail />} />
            </Route>

            {/* Admin kendi giriş akışına sahip */}
            <Route path="/admin" element={<Admin />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
        <CookieBanner />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
