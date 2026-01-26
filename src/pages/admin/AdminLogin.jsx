export default function AdminLogin() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#faf8f5] p-4">
      <div className="w-full max-w-sm animate-fade-in-up">


        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 
            border border-[#d4b483]/30 rounded-full mb-4 
            transition-all duration-500 
            hover:shadow-[0_0_20px_rgba(255,140,0,0.2)]">

            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-[#8c7853] transition-colors duration-500 hover:text-[#ff8c00]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
          </div>

          <h1 className="text-2xl font-light tracking-wider text-[#6B4E2E] 
            transition-colors duration-500 hover:text-[#ff8c00]">
            ULTRAJEWELS
          </h1>

          <p className="text-[#6B4E2E] text-sm font-light mt-2 tracking-wider 
            transition-colors duration-500 hover:text-[#ff8c00]">
            ADMINISTRATIVE ACCESS
          </p>
        </div>

    
        <form className="bg-white p-8 shadow-sm border border-[#e8e2d9] 
          animate-fade-in-delay">

          <h2 className="text-[#6B4E2E] text-lg font-light mb-8 text-center 
            tracking-wider transition-colors duration-500 hover:text-[#ff8c00]">
            Dashboard Login
          </h2>

          <div className="space-y-6">

      
            <input
              type="email"
              placeholder="Email"
              className="w-full px-4 py-3 border-b border-[#e8e2d9]
              focus:border-[#8c7853] focus:outline-none
              text-[#3c3c3c] placeholder-[#a0a0a0]
              bg-transparent transition-all duration-300
              focus:pl-6"
            />

    
            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-3 border-b border-[#e8e2d9]
              focus:border-[#8c7853] focus:outline-none
              text-[#3c3c3c] placeholder-[#a0a0a0]
              bg-transparent transition-all duration-300
              focus:pl-6"
            />

     
            <button
              type="submit"
              className="w-full py-3 bg-[#ff8c00] text-white
              font-light tracking-wider text-sm
              transition-all duration-300
              hover:bg-[#985607]
              hover:shadow-lg
              hover:-translate-y-1px
              active:translate-y-0"
             
            >
              ACCESS DASHBOARD
            </button>
          </div>

  
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#e8e2d9]"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="px-4 bg-white text-[#6B4E2E] text-xs 
                transition-colors duration-500 hover:text-[#ff8c00]">
                SECURE ACCESS
              </span>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
}
