import { useState, useEffect } from "react";
import recibidoIcon from "../public/assets/Recibido__Icono.png";
import diagnosticoIcon from "../public/assets/Diagnostico_Icono.png";
import tallerIcon from "../public/assets/En_Taller_Icono.png";
import listoIcon from "../public/assets/Listo_Icono.png";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

// Estados
const statusIcons = {
  "En diagnóstico": recibidoIcon,
  "En espera de aprobación por cliente": diagnosticoIcon,
  "En servicio": tallerIcon,
  "Pieza lista para entrega": listoIcon,
};

// Orden de los estados en la línea de tiempo
const statusOrder = [
  "En Diagnóstico",
  "En espera de aprobación por cliente",
  "En servicio",
  "Pieza lista para entrega",
];

async function fetchClientOrder(orderNumber) {
  try {
    const response = await fetch(`${API_URL}/cliente/${orderNumber}`);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Error al buscar la orden");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching order:", error);
    throw error;
  }
}

// Función para formatear fecha
function formatDate(dateString) {
  if (!dateString) return "";

  try {
    const date = new Date(dateString);
    return date
      .toLocaleDateString("es-ES", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
      .toUpperCase();
  } catch {
    return dateString;
  }
}

// Función para crear timeline basado en el estado actual
function createTimeline(currentStatus) {
  const currentStatusIndex = statusOrder.indexOf(currentStatus);

  return statusOrder.map((status, index) => ({
    status: status.toUpperCase(),
    completed: index <= currentStatusIndex,
    icono: statusIcons[status] || recibidoIcon,
  }));
}

export default function Home() {
  const [orderNumber, setOrderNumber] = useState("");
  const [currentView, setCurrentView] = useState("search");
  const [searchError, setSearchError] = useState("");
  const [loading, setLoading] = useState(false);
  const [orderData, setOrderData] = useState(null);

  // Efecto para ocultar scrollbars globalmente
  useEffect(() => {
    const applyScrollbarStyles = () => {
      document.body.style.overflow = "auto";
      document.body.style.scrollbarWidth = "none";
      document.body.style.msOverflowStyle = "none";
      document.body.style.margin = "0";
      document.body.style.padding = "0";
      document.body.style.width = "100%";

      document.documentElement.style.overflow = "auto";
      document.documentElement.style.scrollbarWidth = "none";
      document.documentElement.style.msOverflowStyle = "none";
      document.documentElement.style.margin = "0";
      document.documentElement.style.padding = "0";

      const styleId = "hide-scrollbars-global";
      let style = document.getElementById(styleId);

      if (!style) {
        style = document.createElement("style");
        style.id = styleId;
        style.innerHTML = `
          ::-webkit-scrollbar {
            display: none !important;
            width: 0 !important;
            height: 0 !important;
            background: transparent !important;
          }
          
          * {
            scrollbar-width: none !important;
            -ms-overflow-style: none !important;
          }
          
          body, #root {
            margin: 0 !important;
            padding: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
            overflow-x: hidden !important;
          }
          
          .main-content {
            margin-left: auto !important;
            margin-right: auto !important;
          }
        `;
        document.head.appendChild(style);
      }
    };

    applyScrollbarStyles();

    const timer = setTimeout(applyScrollbarStyles, 100);

    const observer = new MutationObserver(applyScrollbarStyles);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["style", "class"],
    });

    return () => {
      clearTimeout(timer);
      observer.disconnect();

      const style = document.getElementById("hide-scrollbars-global");
      if (style) {
        style.remove();
      }

      document.body.style.overflow = "";
      document.body.style.scrollbarWidth = "";
      document.body.style.msOverflowStyle = "";
      document.body.style.margin = "";
      document.body.style.padding = "";
      document.body.style.width = "";

      document.documentElement.style.overflow = "";
      document.documentElement.style.scrollbarWidth = "";
      document.documentElement.style.msOverflowStyle = "";
      document.documentElement.style.margin = "";
      document.documentElement.style.padding = "";
    };
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!orderNumber.trim()) {
      setSearchError("Por favor ingresa tu número de orden");
      return;
    }

    setSearchError("");
    setLoading(true);

    try {
      const response = await fetchClientOrder(orderNumber);

      if (response.success) {
        setOrderData(response.orden);
        setCurrentView("details");
      } else {
        throw new Error(response.error || "Orden no encontrada");
      }
    } catch (error) {
      setSearchError(
        error.message ||
          "Error al buscar la orden. Verifica el número e intenta nuevamente.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleNewSearch = () => {
    setCurrentView("search");
    setOrderNumber("");
    setSearchError("");
    setOrderData(null);
  };

  // Calcular progreso para la línea de tiempo
  const calculateProgress = () => {
    if (!orderData?.estado_actual) return 0;

    const currentStatusIndex = statusOrder.indexOf(orderData.estado_actual);
    if (currentStatusIndex === -1 || statusOrder.length <= 1) return 0;

    const baseProgress = (currentStatusIndex / (statusOrder.length - 1)) * 100;
    const extra = currentStatusIndex < statusOrder.length - 1 ? 10 : 0;
    return Math.min(baseProgress + extra, 100);
  };

  const progressPercent = calculateProgress();
  const timeline = orderData?.estado_actual
    ? createTimeline(orderData.estado_actual)
    : [];

  return (
    <div
      className="min-h-screen bg-white w-full"
      style={{
        overflow: "auto",
        scrollbarWidth: "none",
        msOverflowStyle: "none",
        margin: 0,
        padding: 0,
        width: "100%",
        maxWidth: "100vw",
        position: "relative",
      }}
    >
      <style jsx global>{`
        .scrollbar-hidden {
          overflow: auto !important;
          scrollbar-width: none !important;
          -ms-overflow-style: none !important;
        }

        .scrollbar-hidden::-webkit-scrollbar {
          display: none !important;
          width: 0 !important;
          height: 0 !important;
        }

        .center-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 100%;
        }
      `}</style>

      <main
        className="main-content px-6 py-16"
        style={{
          maxWidth: "800px",
          width: "100%",
          margin: "0 auto",
          paddingLeft: "1.5rem",
          paddingRight: "1.5rem",
        }}
      >
        {currentView === "search" && (
          <div className="text-center mt-20 center-content">
            <h2 className="text-3xl font-serif text-[#6B4E2E] mb-10 max-w-xl mx-auto">
              CONSULTA EL ESTADO DE TU SERVICIO
            </h2>

            <form onSubmit={handleSearch} className="max-w-xl w-full mx-auto">
              <div className="relative">
                <input
                  type="text"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  placeholder="Número de orden"
                  className="w-full px-6 py-4 border border-gray-200 text-center text-gray-500 focus:outline-none focus:ring-1 focus:ring-[#ff8c00]"
                  disabled={loading}
                />

                <button
                  type="submit"
                  disabled={loading}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-[rgb(255,140,0)] p-3 transition-colors duration-500 hover:bg-[#945200] disabled:bg-gray-400 disabled:cursor-not-allowed text-white"
                >
                  {loading ? "Buscando..." : "Buscar"}
                </button>
              </div>

              <p className="text-sm text-[#B08968] mt-4">
                INGRESA TU NÚMERO DE ORDEN PARA VER EL ESTADO DE TU SERVICIO
              </p>

              {searchError && (
                <p className="mt-6 text-red-600 text-sm">{searchError}</p>
              )}
            </form>
          </div>
        )}

        {currentView === "details" && orderData && (
          <div className="center-content">
            <div className="text-center mt-12 w-full">
              <p className="text-sm text-[#B08968] mb-2">
                ORDEN: {orderData.order_number}
              </p>

              <h1 className="text-2xl font-extrabold text-[#6B4E2E] mb-2">
                {orderData.estado_actual?.toUpperCase() || "EN PROCESO"}
              </h1>

              <p className="text-[#B08968]">
                RECIBIDA EL {formatDate(orderData.received_date)}
              </p>

              {orderData.ultima_actualizacion && (
                <p className="text-sm text-gray-500 mt-2">
                  Última actualización: {orderData.ultima_actualizacion}
                </p>
              )}
            </div>

            {/* Línea de tiempo */}
            <div className="mt-16 w-full max-w-2xl mx-auto">
              <div className="relative flex items-center justify-between">
                <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -translate-y-1/2 z-0" />

                <div
                  className="absolute top-1/2 left-0 h-1 bg-[#ff8c00] -translate-y-1/2 transition-all duration-500 z-0"
                  style={{ width: `${progressPercent}%` }}
                />

                {timeline.map((step, index) => (
                  <div
                    key={index}
                    className={`relative z-10 flex items-center justify-center rounded-full w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 ${
                      step.completed ? "bg-[#EF922E]" : "bg-[#EF922E]"
                    }`}
                  >
                    <img
                      src={step.icono}
                      alt={step.status}
                      className="w-5 md:w-6 lg:w-7 object-contain"
                    />
                  </div>
                ))}
              </div>

              <div className="flex justify-between mt-4 text-xs text-gray-600">
                {timeline.map((step, index) => (
                  <div
                    key={index}
                    className="text-center"
                    style={{ width: `${100 / timeline.length}%` }}
                  >
                    <span
                      className={
                        step.completed ? "font-bold text-[#6B4E2E]" : ""
                      }
                    ></span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-center gap-6 mt-16 flex-wrap">
              <button className="px-8 py-3 border border-[#EF922E] transition-colors duration-500 text-[#EF922E] hover:bg-[#EF922E] hover:text-white whitespace-nowrap">
                CONTACTA UN ASESOR
              </button>

              {/* <button className="px-8 py-3 bg-[#EF922E] text-white transition-colors duration-500 hover:bg-white hover:text-[#EF922E] border border-[#EF922E] whitespace-nowrap">
                AGENDA UNA CITA
              </button> */}
            </div>

            <div className="bg-white p-8 mt-12 w-full max-w-3xl mx-auto">
              <h2 className="text-xl text-center text-[#6B4E2E] mb-10 font-normal border-b border-[#E8E2D9] pb-4">
                DETALLES DE LA PIEZA
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 text-center">
                {/* Columna 1 */}
                <div className="space-y-8">
                  {orderData.device_type && (
                    <div>
                      <div className="text-sm text-[#B08968] mb-2">MARCA</div>
                      <div className="text-[#6B4E2E] text-base">
                        {orderData.device_brand}
                      </div>
                    </div>
                  )}

                  {orderData.device_brand && (
                    <div>
                      <div className="text-sm text-[#B08968] mb-2">TIPO</div>
                      <div className="text-[#6B4E2E] text-base">
                        {orderData.device_type}
                       
                          
                      </div>
                    </div>
                  )}

                  {orderData.serial_number && (
                    <div>
                      <div className="text-sm text-[#B08968] mb-2">
                        NÚMERO DE SERIE
                      </div>
                      <div className="text-[#6B4E2E] text-base font-mono">
                        {orderData.serial_number}
                      </div>
                    </div>
                  )}
                </div>

                {/* Columna 2 */}
                <div className="space-y-8 text-center">
                  {orderData.device_model && (
                    <div>
                      <div className="text-sm text-[#B08968] mb-2">MODELO</div>
                      <div className="text-[#6B4E2E] text-base">
                        {orderData.device_model}
                      </div>
                    </div>
                  )}
                  
                  {orderData.received_date && (
                    <div>
                      <div className="text-sm text-[#B08968] mb-2">
                        FECHA RECEPCIÓN
                      </div>
                      <div className="text-[#6B4E2E] text-base">
                        {formatDate(orderData.received_date)}
                      </div>
                    </div>
                  )}

                  {orderData.estimated_delivery && (
                    <div>
                      <div className="text-sm text-[#B08968] mb-2">
                        ENTREGA ESTIMADA
                      </div>
                      <div className="text-[#6B4E2E] text-base">
                        {formatDate(orderData.estimated_delivery)}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Estado actual - separado */}
              {orderData.estado_actual && (
                <div className="mt-12 pt-8 border-t border-[#E8E2D9]">
                  <div className="text-center">
                    <div className="text-sm text-[#B08968] mb-2">
                      ESTADO ACTUAL
                    </div>
                    <div className="text-lg text-[#6B4E2E] font-medium">
                      {orderData.estado_actual}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-center mt-10 w-full">
              <button
                onClick={handleNewSearch}
                className="px-6 py-2 border border-[#EF922E] text-[#EF922E] transition-colors duration-500 hover:bg-[#EF922E] hover:text-white"
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
