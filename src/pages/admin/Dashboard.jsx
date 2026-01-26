
import AdminLayout from "./AdminLayout";
import { Link } from 'react-router-dom';
import { showInfoAlert } from "../../utils/alerts";
import { useState, useEffect } from 'react';


const ORDER_STATUSES = {
  RECIBIDO: { 
    label: "Recibido", 
    color: "bg-gray-100 text-gray-800", 
    borderColor: "border-gray-200",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    )
  },
  DIAGNOSTICO: { 
    label: "Diagnóstico", 
    color: "bg-blue-50 text-blue-700", 
    borderColor: "border-blue-200",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    )
  },
  ESPERA_PIEZAS: { 
    label: "Espera de Piezas", 
    color: "bg-yellow-50 text-yellow-700", 
    borderColor: "border-yellow-200",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  },
  EN_TALLER: { 
    label: "En Taller", 
    color: "bg-orange-50 text-orange-700", 
    borderColor: "border-orange-200",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    )
  },
  CALIDAD: { 
    label: "Calidad", 
    color: "bg-purple-50 text-purple-700", 
    borderColor: "border-purple-200",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  },
  LISTO: { 
    label: "Listo", 
    color: "bg-green-50 text-green-700", 
    borderColor: "border-green-200",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
      </svg>
    )
  }
};

export default function Dashboard() {
  const [animatedValues, setAnimatedValues] = useState({
    recibido: 0,
    diagnostico: 0,
    esperaPiezas: 0,
    enTaller: 0,
    calidad: 0,
    listo: 0
  });

  const stats = [
    { 
      label: ORDER_STATUSES.RECIBIDO.label, 
      value: 3, 
      status: "RECIBIDO",
      description: "Piezas recibidas hoy"
    },
    { 
      label: ORDER_STATUSES.DIAGNOSTICO.label, 
      value: 2, 
      status: "DIAGNOSTICO",
      description: "En evaluación técnica"
    },
    { 
      label: ORDER_STATUSES.ESPERA_PIEZAS.label, 
      value: 3, 
      status: "ESPERA_PIEZAS",
      description: "Esperando repuestos"
    },
    { 
      label: ORDER_STATUSES.EN_TALLER.label, 
      value: 4, 
      status: "EN_TALLER",
      description: "En reparación activa"
    },
    { 
      label: ORDER_STATUSES.CALIDAD.label, 
      value: 3, 
      status: "CALIDAD",
      description: "Control de calidad"
    },
    { 
      label: ORDER_STATUSES.LISTO.label, 
      value: 3, 
      status: "LISTO",
      description: "Listas para retirar"
    },
  ];

  const recentOrders = [
    { 
      id: "UJ-2026-015", 
      client: "María Rodríguez", 
      status: "EN_TALLER", 
      brand: "Rolex Datejust",
      daysInSystem: 2
    },
    { 
      id: "UJ-2026-014", 
      client: "Andrés López", 
      status: "DIAGNOSTICO", 
      brand: "Cartier Santos",
      daysInSystem: 1
    },
    { 
      id: "UJ-2026-013", 
      client: "Sofía Martínez", 
      status: "RECIBIDO", 
      brand: "Omega Seamaster",
      daysInSystem: 0
    },
    { 
      id: "UJ-2026-012", 
      client: "Carlos Gómez", 
      status: "LISTO", 
      brand: "Patek Philippe",
      daysInSystem: 3
    },
  ];


  useEffect(() => {
    const interval = setInterval(() => {
      setAnimatedValues(prev => {
        const newValues = { ...prev };
        stats.forEach((stat, index) => {
          const keys = ['recibido', 'diagnostico', 'esperaPiezas', 'enTaller', 'calidad', 'listo'];
          if (newValues[keys[index]] < stat.value) {
            newValues[keys[index]] += 1;
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
  }, );

  const handleStatClick = (stat) => {
    showInfoAlert(
      stat.label,
      `${stat.value} órdenes\n${stat.description}`
    );
  };

  const getStatusInfo = (status) => {
    return ORDER_STATUSES[status] || ORDER_STATUSES.RECIBIDO;
  };

  return (
    <AdminLayout>
     
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-light tracking-wider text-[#6B4E2E] mb-2">
              Panel de Control del Taller
            </h1>
            <p className="text-sm text-[#B08968] font-light">
              Sistema de seguimiento de órdenes Ultrajewels,
            </p>
          </div>
        </div>
        <div className="mt-4 w-full h-1 bg-linear-to-r from-[#6B4E2E] via-[#ff8c00] to-[#6B4E2E] rounded-full"></div>
      </div>


      <div className="bg-linear-to-r from-[#6B4E2E] to-[#8B5A2B]  p-6 mb-8 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-light mb-2">Resumen General</h2>
            <p className="text-amber-100 text-sm font-light">Total de órdenes activas en el sistema</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-light">14</p>
            <p className="text-amber-100 text-sm font-light">Órdenes activas</p>
          </div>
        </div>
      </div>

    
      <div className="mb-8">
        <h2 className="text-lg font-light text-[#6B4E2E] mb-4">Órdenes por Estado</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {stats.map((stat, i) => {
            const statusInfo = getStatusInfo(stat.status);
            const animatedValue = animatedValues[stat.status.toLowerCase()];
            
            return (
              <div 
                key={i} 
                className={`bg-white p-4 border ${statusInfo.borderColor} hover:shadow-md transition-all duration-300 cursor-pointer`}
                onClick={() => handleStatClick(stat)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className={`w-8 h-8 ${statusInfo.color.split(' ')[0]} rounded-full flex items-center justify-center`}>
                    {statusInfo.icon}
                  </div>
                </div>
                <p className="text-2xl font-light text-[#6B4E2E] mb-1">
                  {animatedValue}
                </p>
                <p className="text-xs font-medium text-[#6B4E2E] truncate">{stat.label}</p>
              </div>
            );
          })}
        </div>
      </div>

      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
       
        <div className="bg-white  border border-[#e8e2d9] overflow-hidden">
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
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
          
          <div className="divide-y divide-[#f5f1e8]">
            {recentOrders.map((order, i) => {
              const statusInfo = getStatusInfo(order.status);
              return (
                <div key={i} className="p-5 hover:bg-[#faf8f5] transition-colors duration-200">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3 mb-2">
                        <p className="font-medium text-[#6B4E2E]">{order.id}</p>
                        <span className={`text-xs px-3 py-1.5  font-medium ${statusInfo.color} ${statusInfo.borderColor} border`}>
                          {statusInfo.label}
                        </span>
                      </div>
                      <p className="text-sm text-[#6B4E2E] font-medium truncate">{order.client}</p>
                      <div className="flex items-center space-x-3 mt-1">
                        <p className="text-xs text-[#B08968] font-light">{order.brand}</p>
                        <span className="text-xs text-[#B08968]">•</span>
                        <div className="flex items-center space-x-1">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-[#B08968]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <p className="text-xs text-[#B08968] font-light">{order.daysInSystem} días</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <Link
                        to={`/admin/orders/${order.id}`}
                        className="text-xs text-[#6B4E2E] font-light hover:text-white hover:bg-[#ff8c00] transition-all duration-200 px-3 py-2 border border-[#e8e2d9]  hover:border-[#ff8c00]"
                      >
                        Ver
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

       
        <div className="space-y-6">
          <div className="bg-white  border border-[#e8e2d9] p-6">
            <h2 className="text-lg font-light text-[#6B4E2E] mb-6">Acciones Rápidas</h2>
            <div className="space-y-4">
              <Link
                to="/admin/new-order"
                className="flex items-center justify-between p-4 border border-[#e8e2d9]  hover:border-[#ff8c00] transition-colors duration-200"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-linear-to-br from-[#ff8c00] to-[#ffaa00] flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#6B4E2E]">Crear Nueva Orden</p>
                    <p className="text-xs text-[#B08968] font-light">Registrar nueva pieza en el sistema</p>
                  </div>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#B08968]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              
              <Link
                to="/admin/orders"
                className="flex items-center justify-between p-4 border border-[#e8e2d9]  hover:border-[#6B4E2E] transition-colors duration-200"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-linear-to-br from-[#6B4E2E] to-[#8B5A2B]  flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#6B4E2E] ">Gestionar Órdenes</p>
                    <p className="text-xs text-[#B08968] font-light">Ver y administrar todas las órdenes</p>
                  </div>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#B08968]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>

  
          <div className="bg-white  border border-[#e8e2d9] p-6">
            <h2 className="text-lg font-light text-[#6B4E2E] mb-6">Flujo del Taller</h2>
            <div className="relative">
         
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-linear-to-b from-[#6B4E2E] via-[#ff8c00] to-[#6B4E2E]"></div>
              
           
              <div className="space-y-8 relative">
                {Object.values(ORDER_STATUSES).map((status, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className={`w-8 h-8 ${status.color.split(' ')[0]} rounded-full flex items-center justify-center z-10 border-2 border-white shadow-sm`}>
                      {status.icon}
                    </div>
                    <div className="flex-1 pt-1">
                      <p className="text-sm font-medium text-[#6B4E2E]">{status.label}</p>
                      <p className="text-xs text-[#B08968] font-light mt-1">
                        {index === 0 && "Pieza recibida en taller"}
                        {index === 1 && "Evaluación técnica en curso"}
                        {index === 2 && "Esperando repuestos"}
                        {index === 3 && "En proceso de reparación"}
                        {index === 4 && "Control de calidad final"}
                        {index === 5 && "Lista para retiro"}
                        {index === 5 && "Lista para retiro"}
                        {index === 5 && "Lista para retiro"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

    
      <div className="mt-8 pt-6 border-t border-[#e8e2d9]">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm text-[#6B4E2E] font-light">Sistema activo</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-[#ff8c00] rounded-full"></div>
              <span className="text-sm text-[#6B4E2E] font-light">14 órdenes activas</span>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}