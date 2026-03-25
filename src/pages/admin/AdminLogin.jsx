import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { useNavigate } from "react-router-dom";


const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY
);


export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [session, setSession] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => setSession(session)
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) setError(error.message);

    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
  };
  const navigate = useNavigate();

useEffect(() => {
  if (session) navigate("/dashboard");
}, [session]);


 
  if (session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#faf8f5]">
        <div className="bg-white p-10 border shadow-sm text-center">
          <h2 className="text-xl text-[#6B4E2E] mb-4">Dashboard</h2>
          <p className="mb-6 text-sm">{session.user.email}</p>
          <button
            onClick={handleLogout}
            className="px-6 py-2 bg-[#ff8c00] text-white hover:bg-[#985607]"
          >
            Sign out
          </button>
        </div>
      </div>
    );
  }



  return (
    <div className="min-h-screen flex items-center justify-center bg-[#faf8f5] p-4">
      <div className="w-full max-w-sm animate-fade-in-up">

        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center
             ">
            <img src="src/pages/admin/assets/new-logo-ultrajewels.svg" alt="Logo UltraJewels" className="w-40 h-40" />
          </div>
          <p className="text-[#6B4E2E] text-sm font-light mt-2 tracking-wider">
          ACCESO AL PANEL DE ADMINISTRACIÓN
          </p>
        </div>

        <form
          onSubmit={handleLogin}
          className="bg-white p-8 shadow-sm border border-[#e8e2d9]"
        >
          <h2 className="text-[#6B4E2E] text-lg font-light mb-8 text-center tracking-wider">
            DASHBOARD LOGIN
          </h2>

          <div className="space-y-6">
            <input
              type="email"
              placeholder="Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border-b border-[#e8e2d9]
              focus:border-[#8c7853] focus:outline-none
              text-[#3c3c3c] placeholder-[#a0a0a0]
              bg-transparent transition-all duration-300"
            />

            <input
              type="password"
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border-b border-[#e8e2d9]
              focus:border-[#8c7853] focus:outline-none
              text-[#3c3c3c] placeholder-[#a0a0a0]
              bg-transparent transition-all duration-300"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#ff8c00] text-white
              tracking-wider text-sm transition-all
              hover:bg-[#985607] hover:shadow-lg disabled:opacity-60"
            >
              {loading ? "LOGGING IN..." : "ACCESS DASHBOARD"}
            </button>
          </div>

          {error && (
            <p className="mt-6 text-red-600 text-sm text-center">
              {error}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
