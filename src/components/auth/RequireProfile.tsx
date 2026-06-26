import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { fetchMyStudentProfile } from "@/data/students";
import { fetchMyAlumniProfile } from "@/data/alumni";

// Guards pages that require BOTH a session AND a completed profile.
// - no session         -> /login
// - session, no profile -> /profil (complete it first)
// - session + profile   -> render the page
const RequireProfile = () => {
  const location = useLocation();
  const [isReady, setIsReady] = useState(false);
  const [isAuthed, setIsAuthed] = useState(false);
  const [hasProfile, setHasProfile] = useState(false);

  useEffect(() => {
    if (!supabase) {
      setIsAuthed(false);
      setIsReady(true);
      return;
    }

    let active = true;

    const check = async () => {
      const { data } = await supabase.auth.getSession();
      const userId = data.session?.user.id ?? null;
      if (!active) return;

      if (!userId) {
        setIsAuthed(false);
        setIsReady(true);
        return;
      }

      setIsAuthed(true);

      const [studentProfile, alumniProfile] = await Promise.all([
        fetchMyStudentProfile(userId),
        fetchMyAlumniProfile(userId),
      ]);
      if (!active) return;

      setHasProfile(Boolean(studentProfile || alumniProfile));
      setIsReady(true);
    };

    check();

    return () => {
      active = false;
    };
  }, [location.pathname]);

  if (!isReady) {
    return (
      <div className="py-16 text-center text-muted-foreground">Profil kontrol ediliyor...</div>
    );
  }

  if (!isAuthed) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (!hasProfile) {
    return <Navigate to="/profil" replace state={{ from: location }} />;
  }

  return <Outlet />;
};

export default RequireProfile;
