import  { useState } from "react";
import Header from "../../components/public/Header";

import recibidoIcon from "../public/assets/Recibido__Icono.png";
import diagnosticoIcon from "../public/assets/Diagnostico_Icono.png";
import tallerIcon from "../public/assets/En_Taller_Icono.png";
import listoIcon from "../public/assets/Listo_Icono.png";

export default function Home() {
  const [orderNumber, setOrderNumber] = useState("");
  const [currentView, setCurrentView] = useState("search");
  const [searchError, setSearchError] = useState("");

  const orderDetails = {
    orderNumber: "UJ-2026-002",
    status: "EN TALLER",
    receivedDate: "15 DE JUNIO",
    timeline: [
      { status: "RECIBIDO", completed: true, icono: recibidoIcon },
      { status: "DIAGNÓSTICO", completed: true, icono: diagnosticoIcon },
      { status: "EN TALLER", completed: true, icono: tallerIcon },
      { status: "LISTO", completed: false, icono: listoIcon },
    ],
    pieceDetails: {
      type: "Collar",
      brand: "Cartier",
      service: "Reparación",
      description:
        "Collar de diamantes con engaste invisible en oro blanco 18k",
      diagnosis:
        "Dos diamantes presentan engastes flojos. Se procederá a reforzar todos los engastes.",
    },
  };

  const handleSearch = (e) => {
    e.preventDefault();

    if (!orderNumber.trim()) {
      setSearchError("Por favor ingresa tu número de orden");
      return;
    }

    setSearchError("");
    setCurrentView("details");
  };

  const handleNewSearch = () => {
    setCurrentView("search");
    setOrderNumber("");
    setSearchError("");
  };

const totalSteps = orderDetails.timeline.length;
const completedCount = orderDetails.timeline.filter(s => s.completed).length;

const baseProgress =
  (completedCount - 1) / (totalSteps - 1) * 100;

const extra = completedCount < totalSteps ? 10 : 0;

const progressPercent = Math.min(baseProgress + extra, 100);


  return (
    <div className="min-h-screen bg-white">
   

      <main className="container mx-auto px-6 py-16">
        {currentView === "search" && (
          <div className="text-center mt-20">
            <h2 className="text-3xl font-serif text-[#6B4E2E] mb-10">
              Consulta el estado de tu servicio
            </h2>

            <form onSubmit={handleSearch} className="max-w-xl mx-auto">
              <div className="relative">
                <input
                  type="text"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  placeholder="Número de orden"
                  className="w-full px-6 py-4 border border-gray-200  text-center text-gray-500 focus:outline-none focus:ring-1 focus:ring-[#ff8c00]"
                />

                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-[rgb(255,140,0)] p-3 hover:bg-[#945200] text-white"
                >
                  Buscar
                </button>
              </div>

              <p className="text-sm text-[#B08968] mt-4">
                Ingresa tu número de orden (ej: UJ-2026-001)
              </p>

              <div className="mt-12">
                <p className="text-sm text-gray-400 mb-4">
                  Órdenes de prueba disponibles:
                </p>

                <div className="flex justify-center gap-4">
                  {["UJ-2026-001", "UJ-2026-002", "UJ-2026-003"].map(
                    (order) => (
                      <button
                        key={order}
                        type="button"
                        onClick={() => setOrderNumber(order)}
                        className="px-5 py-2 bg-gray-100 rounded-lg text-[#6B4E2E] hover:bg-gray-200"
                      >
                        {order}
                      </button>
                    ),
                  )}
                </div>
              </div>

              {searchError && (
                <p className="mt-6 text-red-600 text-sm">{searchError}</p>
              )}
            </form>
          </div>
        )}

        {currentView === "details" && (
          <div>
            <div className="text-center mt-12">
              <p className="text-sm text-[#B08968] mb-2">
                ORDEN: {orderDetails.orderNumber}
              </p>

              <h1 className="text-2xl font-extrabold  text-[#6B4E2E]  mb-2">
                DIAGNÓSTICO
              </h1>

              <p className="text-[#B08968]">
                RECIBIDA EL {orderDetails.receivedDate}
              </p>
            </div>

           <div className="mt-16 max-w-2xl mx-auto">
  <div className="relative flex items-center justify-between">


    <div className="absolute top-1/2 left-0 w-full h-[4px] bg-gray-200 -translate-y-1/2 z-0" />

   
    <div
      className="absolute top-1/2 left-0 h-[4px] bg-[#ff8c00] -translate-y-1/2 transition-all duration-500 z-0"
      style={{ width: `${progressPercent}%` }}
    />

    {/* círculos */}
    {orderDetails.timeline.map((step, index) => (
      <div
        key={index}
        className="relative z-10 flex items-center justify-center
          rounded-full bg-[#ff8c00]
          w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14
        "
      >
        <img
          src={step.icono}
          alt={step.status}
          className="w-5 md:w-6 lg:w-7 object-contain"
        />
      </div>
    ))}

  </div>
</div>


            <div className="flex justify-center gap-6 mt-16">
              <button className="px-8 py-3 border border-[#F5B971] text-[#ff8c00]  hover:bg-[#ffd096]">
                CONTACTA UN ASESOR
              </button>

              <button className="px-8 py-3 bg-[#ff8c00] text-white  hover:bg-[#ff9100]">
                AGENDA UNA CITA
              </button>
            </div>

            <div className="bg-[#F9F9F9] p-10 mt-16 max-w-2xl mx-auto shadow-md">
              <h2 className="text-xl text-center text-[#6B4E2E] mb-8 font-medium">
                DETALLES DE LA PIEZA
              </h2>

              <div className="grid grid-cols-2 gap-y-6 gap-x-10 text-sm text-[#6B4E2E] text-center mb-10">
                <p>
                  <strong>TIPO: </strong>
                  {orderDetails.pieceDetails.type}
                </p>

                <p>
                  <strong>FECHA DE RECEPCION: </strong>
                  {orderDetails.receivedDate}
                </p>

                <p>
                  <strong>MARCA: </strong>
                  {orderDetails.pieceDetails.brand}
                </p>

                <p>
                  <strong>SERVICIO: </strong>
                  {orderDetails.pieceDetails.service}
                </p>
              </div>

              <div className="space-y-6 text-sm text-[#6B4E2E] text-center">
                <p>
                  <strong>DESCRIPCIÓN: </strong>
                  <br />
                  {orderDetails.pieceDetails.description}
                </p>

                <p>
                  <strong>DIAGNÓSTICO: </strong>
                  <br />
                  {orderDetails.pieceDetails.diagnosis}
                </p>
              </div>
            </div>

            <div className="flex justify-center mt-10">
              <button
                onClick={handleNewSearch}
                className="px-6 py-2 border border-[#F5B971] text-[#ff8c00]  hover:bg-[#ffd096]"
              >
                REALIZAR NUEVA BÚSQUEDA
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
