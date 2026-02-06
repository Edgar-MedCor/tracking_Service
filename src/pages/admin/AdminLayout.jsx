import { Link, useNavigate } from "react-router-dom";
import { showConfirmAlert } from "../../utils/alerts";
import { supabase } from "../../services/supabase";

export default function AdminLayout({ children }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const result = await showConfirmAlert(
      "Cerrar Sesión",
      "¿Está seguro que desea cerrar la sesión?"
    );

    if (!result.isConfirmed) return;

    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Error al cerrar sesión:", error);
      return;
    }

    navigate("/");
  };

  return (
    <div className="min-h-screen flex bg-linear-to-br from-[#f9f6f0] to-[#f5f1e8]">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg border-r border-[#e0d6c2] flex flex-col">
        <div className="p-6 border-b border-[#e0d6c2]">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-linear-to-br from-[#6B4E2E] to-[#8B5A2B] rounded-full flex items-center justify-center shadow-md">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-amber-100"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-base font-light tracking-wider text-[#6B4E2E]">
                ULTRAJEWELS
              </h1>
              <p className="text-xs text-[#8B7355] font-light">ADMIN TALLER</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1 flex-1">
          <Link
            to="/dashboard"
            className="flex items-center space-x-3 px-4 py-3 text-sm font-medium text-[#6B4E2E] hover:bg-[#f9f6f0] hover:text-[#D4A017] transition-all duration-200 group"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-[#8B7355] group-hover:text-[#D4A017]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
              />
            </svg>
            <span>Dashboard</span>
          </Link>

          <Link
            to="/admin/orders"
            className="flex items-center space-x-3 px-4 py-3 text-sm font-medium text-[#6B4E2E] hover:bg-[#f9f6f0] hover:text-[#D4A017] transition-all duration-200 group"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-[#8B7355] group-hover:text-[#D4A017]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <span>Órdenes</span>
          </Link>

          <Link
            to="/admin/new-order"
            className="flex items-center space-x-3 px-4 py-3 text-sm font-medium text-[#6B4E2E] hover:bg-[#f9f6f0] hover:text-[#D4A017] transition-all duration-200 group"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-[#8B7355] group-hover:text-[#D4A017]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 4v16m8-8H4"
              />
            </svg>
            <span>Nueva Orden</span>
          </Link>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-[#e0d6c2] bg-white mt-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-linear-to-br from-[#6B4E2E] to-[#8B5A2B] rounded-full flex items-center justify-center shadow-sm">
                <span className="text-xs text-amber-100 font-medium">AT</span>
              </div>
              <div>
                <p className="text-sm font-medium text-[#6B4E2E]">
                  Administrador
                </p>
                <p className="text-xs text-[#8B7355] font-light">Taller</p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="text-[#8B7355] hover:text-[#D4A017] transition-colors duration-200"
              title="Cerrar sesión"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 p-6 overflow-auto">
        <div className="max-w-6xl mx-auto">{children}</div>
      </main>
    </div>
  );
}

