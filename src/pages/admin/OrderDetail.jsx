// OrderDetail.jsx (corregido)
import AdminLayout from "./AdminLayout";
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { showSuccessAlert, showErrorAlert, showConfirmAlert } from "../../utils/alerts";

export default function OrderDetail() {

  
  const [order, setOrder] = useState({
    id: "UJ-2024-015",
    client: "María Rodríguez",
    email: "maria@email.com",
    phone: "+52 123 456 7890",
    status: "En Taller",
    date: "15/01/2024",
    priority: "Alta",
    
  
    pieceType: "Reloj de pulsera",
    brand: "Rolex",
    model: "Datejust 41",
    serialNumber: "R-78901234",
    receptionDate: "12/01/2024",
    estimatedDelivery: "20/01/2024",
    
    
    serviceDescription: "Cambio de batería y limpieza general del brazalete.",
    
   
    diagnosisNote: "Diagnóstico completado - Requiere cambio de batería",
    waitingForPartsNote: "Esperando repuestos necesarios",
    inWorkshopNote: "En proceso de reparación",
    qualityNote: "Control de calidad final",
    readyNote: "Listo para retiro",
    
   
    internalLog: [
      { user: "Sistema", date: "12/01/2024 10:00", note: "Servicio solicitado: Cambio de batería y limpieza general del brazalete." },
      { user: "Juan Pérez", date: "13/01/2024 15:30", note: "Cliente solicita limpieza adicional del brazalete." },
      { user: "Ana López", date: "14/01/2024 11:15", note: "Pieza requiere batería especial - en espera de proveedor." }
    ],
    
  
    newNote: ""
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});

  
  const statusOptions = ["Recibido", "Diagnóstico", "Espera de Piezas", "En Taller", "Calidad", "Listo"];
  
  const statusColors = {
    "Recibido": "bg-gray-100 text-gray-800 ",
    "Diagnóstico": "bg-blue-50 text-blue-700",
    "Espera de Piezas": "bg-yellow-50 text-yellow-700",
    "En Taller": "bg-orange-50 text-orange-700",
    "Calidad": "bg-purple-50 text-purple-700",
    "Listo": "bg-green-50 text-green-700"
  };

 
  const handleEditClick = () => {
    setIsEditing(true);
    setEditData({ ...order });
  };
 
  const handleSaveChanges = async () => {
    try {
      setOrder(editData);
      setIsEditing(false);
      
      await showSuccessAlert(
        'Cambios Guardados',
        'La orden se ha actualizado correctamente.'
      );
    } catch  {
      await showErrorAlert('Error', 'No se pudieron guardar los cambios');
    }
  };

  // Cancelar edición
  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  // Manejar cambios en formulario de edición
  const handleEditChange = (field, value) => {
    setEditData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Cambiar estado
  const handleStatusChange = async (newStatus) => {
    const result = await showConfirmAlert(
      'Cambiar Estado',
      `¿Cambiar estado de "${order.status}" a "${newStatus}"?`
    );
    
    if (result.isConfirmed) {
      const updatedOrder = {
        ...order,
        status: newStatus
      };
      setOrder(updatedOrder);
      
      await showSuccessAlert(
        'Estado Actualizado',
        `El estado ha sido cambiado a "${newStatus}"`
      );
    }
  };

  // Agregar nota a la bitácora
  const handleAddNote = async () => {
    if (!order.newNote.trim()) {
      await showErrorAlert('Nota vacía', 'Por favor ingrese una nota');
      return;
    }

    const newNoteEntry = {
      user: "Administrador",
      date: new Date().toLocaleDateString('es-MX') + " " + 
            new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' }),
      note: order.newNote
    };
    
    const updatedOrder = {
      ...order,
      internalLog: [newNoteEntry, ...order.internalLog],
      newNote: ""
    };
    
    setOrder(updatedOrder);
    
    await showSuccessAlert('Nota Agregada', 'La nota se ha agregado correctamente');
  };

  // Eliminar nota
  const handleDeleteNote = async (index) => {
    const result = await showConfirmAlert(
      'Eliminar Nota',
      '¿Está seguro que desea eliminar esta nota?'
    );
    
    if (result.isConfirmed) {
      const updatedLog = [...order.internalLog];
      updatedLog.splice(index, 1);
      
      setOrder({
        ...order,
        internalLog: updatedLog
      });
      
      await showSuccessAlert('Nota Eliminada', 'La nota ha sido eliminada');
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <div className="flex items-center space-x-4 mb-2">
                <Link 
                  to="/admin/orders"
                  className="text-[#6B4E2E] hover:text-[#ff8c00] transition-colors duration-200"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                </Link>
                <h1 className="text-2xl font-light tracking-wider text-[#6B4E2E]">
                  Orden #{order.id}
                </h1>
              </div>
              <p className="text-sm text-[#B08968] font-light">
                Cliente: {order.client} • Fecha: {order.date} • Prioridad: {order.priority}
              </p>
            </div>
            <div className="flex space-x-3">
              {isEditing ? (
                <>
                  <button
                    onClick={handleCancelEdit}
                    className="px-4 py-2 border border-[#e8e2d9]  text-sm font-light text-[#6B4E2E] hover:bg-[#faf8f5] transition-colors duration-200"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleSaveChanges}
                    className="px-4 py-2 bg-[#ff8c00] text-white  font-light hover:bg-[#e67e00] transition-colors duration-200"
                  >
                    Guardar
                  </button>
                </>
              ) : (
                <button
                  onClick={handleEditClick}
                  className="px-4 py-2 bg-[#ff8c00] text-white  font-light hover:bg-[#e67e00] transition-colors duration-200"
                >
                  Editar Orden
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Grid principal - REORGANIZADO */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Columna izquierda - Estado y progreso */}
          <div className="space-y-6">
            
            {/* Estado actual y selector */}
            <div className="bg-white p-6  border border-[#e8e2d9]">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-light text-lg text-[#6B4E2E]">Estado Actual</h2>
                <div className="relative">
                  <select 
                    value={order.status}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    className="px-4 py-2 border border-[#e8e2d9]  text-sm font-light text-[#6B4E2E] focus:outline-none appearance-none pr-8"
                  >
                    {statusOptions.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#B08968]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <span className={`inline-flex items-center px-3 py-1  text-sm font-light ${statusColors[order.status]}`}>
                  {order.status}
                </span>
              </div>

             
              <div className="space-y-4">
               
                <div className="flex items-start space-x-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${order.status === "Diagnóstico" ? 'bg-[#ff8c00]' : 'bg-gray-200'}`}>
                    {order.status === "Diagnóstico" && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-[#6B4E2E] font-light">Diagnóstico</p>
                    <p className="text-xs text-[#B08968]">Evaluación técnica en curso</p>
                    {order.status === "Diagnóstico" && order.diagnosisNote && (
                      <p className="text-xs text-[#ff8c00] mt-1">{order.diagnosisNote}</p>
                    )}
                  </div>
                </div>

              
                <div className="flex items-start space-x-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${order.status === "Espera de Piezas" ? 'bg-[#ff8c00]' : 'bg-gray-200'}`}>
                    {order.status === "Espera de Piezas" && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-[#6B4E2E] font-light">Espera de Piezas</p>
                    <p className="text-xs text-[#B08968]">{order.waitingForPartsNote}</p>
                  </div>
                </div>

            
                <div className="flex items-start space-x-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${order.status === "En Taller" ? 'bg-[#ff8c00]' : 'bg-gray-200'}`}>
                    {order.status === "En Taller" && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-[#6B4E2E] font-light">En Taller</p>
                    <p className="text-xs text-[#B08968]">{order.inWorkshopNote}</p>
                  </div>
                </div>

             
                <div className="flex items-start space-x-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${order.status === "Calidad" ? 'bg-[#ff8c00]' : 'bg-gray-200'}`}>
                    {order.status === "Calidad" && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-[#6B4E2E] font-light">Calidad</p>
                    <p className="text-xs text-[#B08968]">{order.qualityNote}</p>
                  </div>
                </div>

              
                <div className="flex items-start space-x-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${order.status === "Listo" ? 'bg-[#ff8c00]' : 'bg-gray-200'}`}>
                    {order.status === "Listo" && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-[#6B4E2E] font-light">Listo</p>
                    <p className="text-xs text-[#B08968]">{order.readyNote}</p>
                  </div>
                </div>
              </div>
            </div>

          
            <div className="bg-white p-6  border border-[#e8e2d9]">
              <h2 className="font-light text-lg text-[#6B4E2E] mb-4">Información del Cliente</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-[#B08968] font-light">Nombre del Cliente</p>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.client}
                      onChange={(e) => handleEditChange('client', e.target.value)}
                      className="w-full px-3 py-2 border border-[#e8e2d9] rounded text-sm mt-1"
                    />
                  ) : (
                    <p className="text-sm text-[#6B4E2E] mt-1">{order.client}</p>
                  )}
                </div>
                <div>
                  <p className="text-xs text-[#B08968] font-light">Teléfono</p>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.phone}
                      onChange={(e) => handleEditChange('phone', e.target.value)}
                      className="w-full px-3 py-2 border border-[#e8e2d9] rounded text-sm mt-1"
                    />
                  ) : (
                    <p className="text-sm text-[#6B4E2E] mt-1">{order.phone}</p>
                  )}
                </div>
                <div>
                  <p className="text-xs text-[#B08968] font-light">Correo Electrónico</p>
                  {isEditing ? (
                    <input
                      type="email"
                      value={editData.email}
                      onChange={(e) => handleEditChange('email', e.target.value)}
                      className="w-full px-3 py-2 border border-[#e8e2d9] rounded text-sm mt-1"
                    />
                  ) : (
                    <p className="text-sm text-[#6B4E2E] mt-1">{order.email}</p>
                  )}
                </div>
                <div>
                  <p className="text-xs text-[#B08968] font-light">Prioridad</p>
                  <p className="text-sm text-[#6B4E2E] mt-1">{order.priority}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Columna central - Detalles de la pieza y Bitácora */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Detalles de la pieza */}
            <div className="bg-white p-6  border border-[#e8e2d9]">
              <h2 className="font-light text-lg text-[#6B4E2E] mb-4">Detalles de la Pieza</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-[#B08968] font-light">Tipo de Pieza</p>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.pieceType}
                      onChange={(e) => handleEditChange('pieceType', e.target.value)}
                      className="w-full px-3 py-2 border border-[#e8e2d9] rounded text-sm mt-1"
                    />
                  ) : (
                    <p className="text-sm text-[#6B4E2E] mt-1">{order.pieceType}</p>
                  )}
                </div>
                <div>
                  <p className="text-xs text-[#B08968] font-light">Marca</p>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.brand}
                      onChange={(e) => handleEditChange('brand', e.target.value)}
                      className="w-full px-3 py-2 border border-[#e8e2d9] rounded text-sm mt-1"
                    />
                  ) : (
                    <p className="text-sm text-[#6B4E2E] mt-1">{order.brand}</p>
                  )}
                </div>
                <div>
                  <p className="text-xs text-[#B08968] font-light">Modelo</p>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.model}
                      onChange={(e) => handleEditChange('model', e.target.value)}
                      className="w-full px-3 py-2 border border-[#e8e2d9] rounded text-sm mt-1"
                    />
                  ) : (
                    <p className="text-sm text-[#6B4E2E] mt-1">{order.model}</p>
                  )}
                </div>
                <div>
                  <p className="text-xs text-[#B08968] font-light">Número de Serie</p>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.serialNumber}
                      onChange={(e) => handleEditChange('serialNumber', e.target.value)}
                      className="w-full px-3 py-2 border border-[#e8e2d9] rounded text-sm mt-1"
                    />
                  ) : (
                    <p className="text-sm text-[#6B4E2E] mt-1">{order.serialNumber}</p>
                  )}
                </div>
                <div>
                  <p className="text-xs text-[#B08968] font-light">Fecha Recepción</p>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.receptionDate}
                      onChange={(e) => handleEditChange('receptionDate', e.target.value)}
                      className="w-full px-3 py-2 border border-[#e8e2d9] rounded text-sm mt-1"
                    />
                  ) : (
                    <p className="text-sm text-[#6B4E2E] mt-1">{order.receptionDate}</p>
                  )}
                </div>
                <div>
                  <p className="text-xs text-[#B08968] font-light">Estimado Entrega</p>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.estimatedDelivery}
                      onChange={(e) => handleEditChange('estimatedDelivery', e.target.value)}
                      className="w-full px-3 py-2 border border-[#e8e2d9] rounded text-sm mt-1"
                    />
                  ) : (
                    <p className="text-sm text-[#6B4E2E] mt-1">{order.estimatedDelivery}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Bitácora interna - AHORA EN LA COLUMNA CENTRAL MÁS GRANDE */}
            <div className="bg-white p-6  border border-[#e8e2d9]">
              <h2 className="font-light text-lg text-[#6B4E2E] mb-4">Bitácora Interna</h2>
              
              {/* Formulario para agregar nota */}
              <div className="mb-6">
                <div className="flex space-x-4">
                  <div className="flex-1">
                    <textarea
                      value={order.newNote}
                      onChange={(e) => setOrder({...order, newNote: e.target.value})}
                      placeholder="Agregar nueva nota..."
                      rows="2"
                      className="w-full px-4 py-3 border border-[#e8e2d9]  text-sm focus:border-[#6B4E2E] focus:outline-none transition-colors duration-200"
                    />
                  </div>
                  <div>
                    <button
                      onClick={handleAddNote}
                      className="h-full px-6 bg-[#ff8c00] text-white  font-light hover:bg-[#e67e00] transition-colors duration-200 whitespace-nowrap"
                    >
                      Agregar Nota
                    </button>
                  </div>
                </div>
              </div>
              
            
              <div className="space-y-4 max-h-100 overflow-y-auto pr-2">
                {order.internalLog.map((log, index) => (
                  <div key={index} className="border-l-2 border-[#ff8c00] pl-4 py-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center space-x-3">
                          <p className="text-sm font-medium text-[#6B4E2E]">{log.user}</p>
                          <span className="text-xs text-[#B08968] font-light bg-[#faf8f5] px-2 py-1 ">
                            {log.date}
                          </span>
                        </div>
                        <p className="text-sm text-[#6B4E2E] font-light mt-2">{log.note}</p>
                      </div>
                      <button
                        onClick={() => handleDeleteNote(index)}
                        className="text-[#B08968] hover:text-red-600 transition-colors duration-200 p-1"
                        title="Eliminar nota"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
                
                {order.internalLog.length === 0 && (
                  <div className="text-center py-8">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-[#e8e2d9] mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="text-[#B08968] font-light">No hay notas en la bitácora</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}