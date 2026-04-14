import { Link, useNavigate } from "react-router-dom";
import { showConfirmAlert } from "../../utils/alerts";
import { supabase } from "../../services/supabase";
import { useEffect, useState } from "react";

export default function AdminLayout({ children }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  
 
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Móvil
  const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(false); // Computadora

  const MAX_IDLE_TIME = 30 * 60 * 1000;
  const LAST_ACTIVITY_KEY = "last_activity";

  // --- LÓGICA DE INACTIVIDAD Y SESIÓN ---
  useEffect(() => {
    const updateActivity = () => localStorage.setItem(LAST_ACTIVITY_KEY, Date.now().toString());

    window.addEventListener("mousemove", updateActivity);
    window.addEventListener("keydown", updateActivity);
    window.addEventListener("click", updateActivity);
    window.addEventListener("scroll", updateActivity);

    updateActivity();

    return () => {
      window.removeEventListener("mousemove", updateActivity);
      window.removeEventListener("keydown", updateActivity);
      window.removeEventListener("click", updateActivity);
      window.removeEventListener("scroll", updateActivity);
    };
  }, []);

  useEffect(() => {
    const checkIdle = async () => {
      const lastActivity = localStorage.getItem(LAST_ACTIVITY_KEY);
      if (!lastActivity) return;
      const idleTime = Date.now() - Number(lastActivity);

      if (idleTime > MAX_IDLE_TIME) {
        await supabase.auth.signOut();
        localStorage.removeItem(LAST_ACTIVITY_KEY);
        alert("Sesión caducada por inactividad");
        navigate("/");
      }
    };

    const interval = setInterval(checkIdle, 60 * 1000);
    return () => clearInterval(interval);
  }, [navigate]);

  const handleLogout = async () => {
    const result = await showConfirmAlert("Cerrar sesión", "¿Está seguro que desea cerrar la sesión?");
    if (!result.isConfirmed) return;

    await supabase.auth.signOut();
    localStorage.removeItem(LAST_ACTIVITY_KEY);
    navigate("/");
  };

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };
    getUser();
  }, []);


  // --- FUNCIÓN PARA EXTRAER INICIALES ---
  const getUserInitials = () => {
    if (user?.user_metadata?.name) {
      const names = user.user_metadata.name.trim().split(/\s+/);
      if (names.length >= 2) return (names[0][0] + names[1][0]).toUpperCase();
      return names[0].substring(0, 2).toUpperCase();
    }
    if (user?.email) {
     
      const parts = user.email.split('@')[0].split('.');
      if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
      return user.email.substring(0, 2).toUpperCase();
    }
    return "UJ"; // Por defecto
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-linear-to-br from-[#f9f6f0] to-[#f5f1e8]">
      
     
      <div className="md:hidden flex items-center justify-between p-4 bg-white shadow-sm border-b border-[#e0d6c2]">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-linear-to-br from-[#6B4E2E] to-[#8B5A2B] rounded-full flex items-center justify-center">
            <span className="text-xs text-amber-100 font-medium">UJ</span>
          </div>
          <span className="text-sm font-semibold text-[#6B4E2E] tracking-wider">ULTRAJEWELS</span>
        </div>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-[#6B4E2E] focus:outline-none">
          {isSidebarOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

     
      {isSidebarOpen && <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setIsSidebarOpen(false)} />}

      {/* SIDEBAR PRINCIPAL */}
      <aside 
        className={`fixed md:relative inset-y-0 left-0 z-50 bg-white shadow-lg border-r border-[#e0d6c2] flex flex-col transform transition-all duration-300 ease-in-out 
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 
        ${isDesktopCollapsed ? "md:w-20" : "md:w-64"}`}
      >
       
        <button
          onClick={() => setIsDesktopCollapsed(!isDesktopCollapsed)}
          className="hidden md:flex absolute -right-3 top-8 w-6 h-6 bg-white border border-[#e0d6c2] rounded-full items-center justify-center text-[#8B7355] hover:text-[#D4A017] hover:border-[#D4A017] shadow-sm z-50 transition-colors"
        >
          {isDesktopCollapsed ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          )}
        </button>

        {/* LOGO AREA */}
        <div className={`p-6 border-b border-[#e0d6c2] flex ${isDesktopCollapsed ? 'justify-center p-4' : 'items-center'}`}>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-linear-to-br from-[#6B4E2E] to-[#8B5A2B] rounded-full flex items-center justify-center shadow-md shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-100" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            {!isDesktopCollapsed && (
              <div className="min-w-0">
                <h1 className="text-base font-light tracking-wider text-[#6B4E2E] truncate">ULTRAJEWELS</h1>
                <p className="text-xs text-[#8B7355] font-light">ADMIN TALLER</p>
              </div>
            )}
          </div>
        </div>

        {/* NAVEGACIÓN */}
        <nav className="p-4 space-y-1 flex-1 overflow-y-auto overflow-x-hidden">
          <Link to="/admin/dashboard" title="Dashboard" className={`flex items-center ${isDesktopCollapsed ? 'justify-center' : 'space-x-3 px-4'} py-3 text-sm font-medium text-[#6B4E2E] hover:bg-[#f9f6f0] hover:text-[#D4A017] transition-all duration-200 rounded-lg group`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#8B7355] group-hover:text-[#D4A017] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            {!isDesktopCollapsed && <span>Dashboard</span>}
          </Link>

          <Link to="/admin/orders" title="Órdenes" className={`flex items-center ${isDesktopCollapsed ? 'justify-center' : 'space-x-3 px-4'} py-3 text-sm font-medium text-[#6B4E2E] hover:bg-[#f9f6f0] hover:text-[#D4A017] transition-all duration-200 rounded-lg group`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#8B7355] group-hover:text-[#D4A017] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            {!isDesktopCollapsed && <span>Órdenes</span>}
          </Link>

          <Link to="/admin/new-order" title="Nueva Orden" className={`flex items-center ${isDesktopCollapsed ? 'justify-center' : 'space-x-3 px-4'} py-3 text-sm font-medium text-[#6B4E2E] hover:bg-[#f9f6f0] hover:text-[#D4A017] transition-all duration-200 rounded-lg group`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#8B7355] group-hover:text-[#D4A017] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
            </svg>
            {!isDesktopCollapsed && <span>Nueva Orden</span>}
          </Link>
        </nav>

       
        <div className={`p-4 border-t border-[#e0d6c2] bg-white mt-auto ${isDesktopCollapsed ? 'flex justify-center' : ''}`}>
          {isDesktopCollapsed ? (
         
            <button 
              onClick={handleLogout} 
              title="Cerrar sesión" 
              className="w-10 h-10 bg-linear-to-br from-[#6B4E2E] to-[#8B5A2B] rounded-full flex items-center justify-center shadow-sm shrink-0 hover:opacity-80 transition-opacity"
            >
              <span className="text-sm text-amber-100 font-medium">{getUserInitials()}</span>
            </button>
          ) : (
            /* VERSIÓN EXPANDIDA */
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 min-w-0 flex-1 pr-2">
                <div className="w-9 h-9 bg-linear-to-br from-[#6B4E2E] to-[#8B5A2B] rounded-full flex items-center justify-center shadow-sm shrink-0">
                  <span className="text-xs text-amber-100 font-medium">{getUserInitials()}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-[#6B4E2E] truncate" title={user?.user_metadata?.name || user?.email}>
                    {user?.user_metadata?.name || user?.email || "Usuario"}
                  </p>
                  <p className="text-xs text-[#8B7355] font-light truncate">Taller</p>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="text-[#8B7355] hover:text-[#D4A017] transition-colors duration-200 shrink-0 p-1 bg-gray-50 rounded-md"
                title="Cerrar sesión"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </aside>

  
      <main className="flex-1 p-4 md:p-6 overflow-auto">
        <div className="max-w-6xl mx-auto">{children}</div>
      </main>
    </div>
  );
}