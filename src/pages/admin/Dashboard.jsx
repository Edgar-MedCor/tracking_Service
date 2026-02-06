import AdminLayout from "./AdminLayout";
import { Link } from "react-router-dom";
import { showInfoAlert, showErrorAlert } from "../../utils/alerts";
import { useState, useEffect } from "react";

const ORDER_STATUSES = {
  EN_DIAGNOSTICO: {
    label: "En Diagnóstico",
    color: "bg-blue-50 text-blue-700",
    borderColor: "border-blue-200",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-4 w-4"
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
    ),
  },
  ESPERA_APROBACION_CLIENTE: {
    label: "En espera de aprobación por cliente",
    color: "bg-yellow-50 text-yellow-700",
    borderColor: "border-yellow-200",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-4 w-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
  EN_SERVICIO: {
    label: "En servicio",
    color: "bg-orange-50 text-orange-700",
    borderColor: "border-orange-200",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-4 w-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
    ),
  },
  PIEZA_LISTA_ENTREGA: {
    label: "Pieza lista para entrega",
    color: "bg-purple-50 text-purple-700",
    borderColor: "border-purple-200",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-4 w-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
};

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState({
    total_ordenes: 0,
    por_estado: [],
    por_prioridad: [],
    recientes: [],
  });

  const [loading, setLoading] = useState(true);
  const [animatedValues, setAnimatedValues] = useState({
    enDiagnostico: 0,
    esperaAprobacionCliente: 0,
    enServicio: 0,
    piezaListaEntrega: 0,
  });

  // Cargar datos del dashboard
  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/dashboard/stats`,
      );
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      const data = await response.json();

      if (data.success) {
        setDashboardData(data.stats);
        console.log("Datos recibidos del dashboard:", data.stats);
        const statusMap = {
          "En Diagnóstico": "enDiagnostico",
          "En espera de aprobación por cliente": "esperaAprobacionCliente",
          "En servicio": "enServicio",
          "Pieza lista para entrega": "piezaListaEntrega",
        };

        const initialValues = {};
        data.stats.por_estado.forEach((status) => {
          const key = statusMap[status.name];
          if (key) {
            initialValues[key] = 0;
          }
        });
        setAnimatedValues(initialValues);

        // Iniciar animación
        startAnimation(data.stats.por_estado, statusMap);
      } else {
        throw new Error(data.error || "Error en la respuesta del servidor");
      }
    } catch (error) {
      console.error("Error cargando dashboard:", error);

      // Intentar carga alternativa
      try {
        console.log("Intentando carga alternativa...");

        // Cargar datos de manera manual
        const ordersResponse = await fetch(
          `${import.meta.env.VITE_API_URL}/api/orders`,
        );
        const mastersResponse = await fetch(
          `${import.meta.env.VITE_API_URL}/api/orders/data/masters`,
        );

        const ordersData = await ordersResponse.json();
        const mastersData = await mastersResponse.json();

        if (ordersData.success && mastersData.success) {
          const orders = ordersData.orders || [];
          const statuses = mastersData.statuses || [];

          // Calcular estadísticas manualmente
          const por_estado = statuses.map((status) => ({
            id: status.id,
            name: status.name,
            cantidad: orders.filter((o) => o.estado === status.name).length,
          }));

          const total_ordenes = orders.length;
          const recientes = orders.slice(0, 5).map((order) => ({
            ...order,
            tiempo_desde_creacion: order.tiempo_desde_creacion || "Reciente",
          }));

          setDashboardData({
            total_ordenes,
            por_estado,
            por_prioridad: [],
            recientes,
          });

          // Inicializar valores animados
          const statusMap = {
            "En Diagnóstico": "enDiagnostico",
            "En espera de aprobación por cliente": "esperaAprobacionCliente",
            "En servicio": "enServicio",
            "Pieza lista para entrega": "piezaListaEntrega",
          };

          const initialValues = {};
          por_estado.forEach((status) => {
            const key = statusMap[status.name];
            if (key) {
              initialValues[key] = 0;
            }
          });
          setAnimatedValues(initialValues);

          // Iniciar animación
          startAnimation(por_estado, statusMap);

          console.log("Datos cargados manualmente:", {
            total_ordenes,
            por_estado,
          });
        } else {
          showErrorAlert(
            "Error",
            "No se pudieron cargar las estadísticas del sistema",
          );
        }
      } catch (fallbackError) {
        console.error("Error en carga alternativa:", fallbackError);
        showErrorAlert("Error", "No se pudieron cargar las estadísticas");
      }
    } finally {
      setLoading(false);
    }
  };

  // Animación de contadores
  const startAnimation = (statusStats, statusMap) => {
    const interval = setInterval(() => {
      setAnimatedValues((prev) => {
        const newValues = { ...prev };
      
        statusStats.forEach((status) => {
          const key = statusMap[status.name];
          if (key) {
            const targetValue = status.cantidad;
            const currentValue = newValues[key];

            if (currentValue < targetValue) {
              newValues[key] = Math.min(currentValue + 1, targetValue);
        
            }
          }
        });

        return newValues;
      });
    }, 30);

    const timeout = setTimeout(() => {
      clearInterval(interval);
    }, 2000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  };

  const handleStatClick = (status) => {
    showInfoAlert(
      status.name,
      `${status.cantidad} órdenes\n${getStatusDescription(status.name)}`,
    );
  };

  const getStatusDescription = (statusName) => {
    const normalized = statusName.trim().toLowerCase();

    const descriptions = {
      "en diagnóstico": "Piezas en proceso de diagnóstico técnico",
      "en espera de aprobación por cliente":
      "Esperando aprobación del cliente para proceder",
      "en servicio": "En proceso de reparación o servicio activo",
      "pieza lista para entrega": "Reparación completada, lista para retiro",
    };

    return descriptions[normalized] || "Órdenes en este estado";
  };

  const getStatusInfo = (statusName) => {
    const normalized = statusName.trim().toLowerCase();

    if (normalized === "en Diagnóstico" || normalized === "en diagnostico") {
      return ORDER_STATUSES.EN_DIAGNOSTICO;
    }
    if (normalized === "en espera de aprobación por cliente") {
      return ORDER_STATUSES.ESPERA_APROBACION_CLIENTE;
    }
    if (normalized === "en servicio") {
      return ORDER_STATUSES.EN_SERVICIO;
    }
    if (normalized === "pieza lista para entrega") {
      return ORDER_STATUSES.PIEZA_LISTA_ENTREGA;
    }

    return ORDER_STATUSES.EN_DIAGNOSTICO;
  };

  const allStats = [
    { name: "En Diagnóstico", cantidad: 0 },
    { name: "En espera de aprobación por cliente", cantidad: 0 },
    { name: "En servicio", cantidad: 0 },
    { name: "Pieza lista para entrega", cantidad: 0 },
  ];

 
  dashboardData.por_estado.forEach((status) => {
    const existingStat = allStats.find((s) => s.name === status.name);
    if (existingStat) {
      existingStat.cantidad = status.cantidad;
    }
  });

  const stats = allStats.map((status) => ({
    label: status.name,
    value: status.cantidad,
    status: status.name.toUpperCase().replace(/ /g, "_"),
    description: getStatusDescription(status.name),
  }));

  // Cargando
  if (loading) {
    return (
      <AdminLayout>
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ff8c00] mx-auto"></div>
            <p className="text-[#6B4E2E] mt-4">Cargando estadísticas...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-light tracking-wider text-[#6B4E2E] mb-2">
              Panel de Control del Taller
            </h1>
            <p className="text-sm text-[#B08968] font-light">
              Sistema de seguimiento de órdenes Ultrajewels
            </p>
          </div>
        </div>
        <div className="mt-4 w-full h-1 bg-linear-to-r from-[#6B4E2E] via-[#ff8c00] to-[#6B4E2E] rounded-full"></div>
      </div>

      {/* Banner de Resumen */}
      <div className="bg-linear-to-r from-[#6B4E2E] to-[#8B5A2B] p-6 mb-8 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-light mb-2">Resumen General</h2>
            <p className="text-amber-100 text-sm font-light">
              Total de órdenes activas en el sistema
            </p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-light">{dashboardData.total_ordenes}</p>
            <p className="text-amber-100 text-sm font-light">Órdenes activas</p>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-lg font-light text-[#6B4E2E] mb-4">
          Órdenes por Estado
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, i) => {
            const statusInfo = getStatusInfo(stat.label);

            let animatedValue = 0;

            if (stat.label === "En Diagnóstico") {
              animatedValue = animatedValues.enDiagnostico;
            } else if (stat.label === "En espera de aprobación por cliente") {
              animatedValue = animatedValues.esperaAprobacionCliente;
            } else if (stat.label === "En servicio") {
              animatedValue = animatedValues.enServicio;
            } else if (stat.label === "Pieza lista para entrega") {
              animatedValue = animatedValues.piezaListaEntrega;
            }

            console.log(
              ` Card ${i}: "${stat.label}" = ${animatedValue} (valor: ${stat.value})`,
            );

            return (
              <div
                key={i}
                className={`bg-white p-4 border ${statusInfo.borderColor} hover:shadow-md transition-all duration-300 cursor-pointer`}
                onClick={() => handleStatClick(stat)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div
                    className={`w-8 h-8 ${statusInfo.color.split(" ")[0]} rounded-full flex items-center justify-center`}
                  >
                    {statusInfo.icon}
                  </div>
                </div>
                <p className="text-2xl font-light text-[#6B4E2E] mb-1">
                  {animatedValue}
                </p>
                <p className="text-xs font-medium text-[#6B4E2E] truncate">
                  {stat.label}
                </p>
                <p className="text-xs text-[#B08968] mt-1 truncate">
                  {stat.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white border border-[#e8e2d9] overflow-hidden">
          <div className="p-6 border-b border-[#e8e2d9] bg-[#faf8f5]">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-light text-[#6B4E2E]">
                Órdenes Recientes
              </h2>
              <Link
                to="/admin/orders"
                className="text-sm text-[#6B4E2E] font-light hover:text-[#ff8c00] transition-colors duration-200 flex items-center"
              >
                Ver todas
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 ml-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            </div>
          </div>

          <div className="divide-y divide-[#f5f1e8]">
            {dashboardData.recientes.length > 0 ? (
              dashboardData.recientes.map((order, i) => {
                const statusInfo = getStatusInfo(
                  order.estado || "En diagnóstico",
                );
                return (
                  <div
                    key={i}
                    className="p-5 hover:bg-[#faf8f5] transition-colors duration-200"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3 mb-2">
                          <p className="font-medium text-[#6B4E2E]">
                            {order.order_number}
                          </p>
                          <span
                            className={`text-xs px-3 py-1.5 font-medium ${statusInfo.color} ${statusInfo.borderColor} border`}
                          >
                            {order.estado || "En diagnóstico"}
                          </span>
                        </div>
                        <p className="text-sm text-[#6B4E2E] font-medium truncate">
                          {order.client_name}
                        </p>
                        <div className="flex items-center space-x-3 mt-1">
                          {order.device_brand && (
                            <p className="text-xs text-[#B08968] font-light">
                              {order.device_brand}
                            </p>
                          )}
                          {order.device_type && (
                            <>
                              <span className="text-xs text-[#B08968]">•</span>
                              <p className="text-xs text-[#B08968] font-light">
                                {order.device_type}
                              </p>
                            </>
                          )}
                          <span className="text-xs text-[#B08968]">•</span>
                          <div className="flex items-center space-x-1">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-3 w-3 text-[#B08968]"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            <p className="text-xs text-[#B08968] font-light">
                              {order.tiempo_desde_creacion || "Reciente"}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 ml-4">
                        <Link
                          to={`/admin/orders/${order.id}`}
                          className="text-xs text-[#6B4E2E] font-light hover:text-white hover:bg-[#ff8c00] transition-all duration-200 px-3 py-2 border border-[#e8e2d9] hover:border-[#ff8c00]"
                        >
                          Ver
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-8 text-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 mx-auto text-[#e8e2d9] mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
                <p className="text-[#B08968] font-light">
                  No hay órdenes recientes
                </p>
                <Link
                  to="/admin/orders"
                  className="mt-2 inline-block text-sm text-[#ff8c00] hover:text-[#e67e00] transition-colors duration-200"
                >
                  Ver todas las órdenes
                </Link>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white border border-[#e8e2d9] p-6">
            <h2 className="text-lg font-light text-[#6B4E2E] mb-6">
              Acciones Rápidas
            </h2>
            <div className="space-y-4">
              <Link
                to="/admin/new-order"
                className="flex items-center justify-between p-4 border border-[#e8e2d9] hover:border-[#ff8c00] transition-colors duration-200"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-linear-to-br from-[#ff8c00] to-[#ffaa00] flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#6B4E2E]">
                      Crear Nueva Orden
                    </p>
                    <p className="text-xs text-[#B08968] font-light">
                      Registrar nueva pieza en el sistema
                    </p>
                  </div>
                </div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-[#B08968]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>

              <Link
                to="/admin/orders"
                className="flex items-center justify-between p-4 border border-[#e8e2d9] hover:border-[#6B4E2E] transition-colors duration-200"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-linear-to-br from-[#6B4E2E] to-[#8B5A2B] flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#6B4E2E]">
                      Gestionar Órdenes
                    </p>
                    <p className="text-xs text-[#B08968] font-light">
                      Ver y administrar todas las órdenes
                    </p>
                  </div>
                </div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-[#B08968]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            </div>
          </div>

          {/* Flujo del Taller */}
          <div className="bg-white border border-[#e8e2d9] p-6">
            <h2 className="text-lg font-light text-[#6B4E2E] mb-6">
              Flujo del Taller
            </h2>
            <div className="relative">
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-linear-to-b from-[#6B4E2E] via-[#ff8c00] to-[#6B4E2E]"></div>

              <div className="space-y-8 relative">
                {Object.values(ORDER_STATUSES).map((status, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div
                      className={`w-8 h-8 ${status.color.split(" ")[0]} rounded-full flex items-center justify-center z-10 border-2 border-white shadow-sm`}
                    >
                      {status.icon}
                    </div>
                    <div className="flex-1 pt-1">
                      <p className="text-sm font-medium text-[#6B4E2E]">
                        {status.label}
                      </p>
                      <p className="text-xs text-[#B08968] font-light mt-1">
                        {index === 0 && "Diagnóstico técnico inicial"}
                        {index === 1 && "Esperando aprobación del cliente"}
                        {index === 2 && "Reparación o servicio en curso"}
                        {index === 3 &&
                          "Servicio completado, lista para entrega"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 pt-6 border-t border-[#e8e2d9]">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm text-[#6B4E2E] font-light">
                Sistema activo
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-[#ff8c00] rounded-full"></div>
              <span className="text-sm text-[#6B4E2E] font-light">
                {dashboardData.total_ordenes} órdenes activas
              </span>
            </div>
          </div>
          <div className="mt-4 md:mt-0">
            <button
              onClick={loadDashboardData}
              className="text-sm text-[#6B4E2E] font-light hover:text-[#ff8c00] transition-colors duration-200 flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Actualizar
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
