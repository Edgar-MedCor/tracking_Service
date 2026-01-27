
import AdminLayout from "./AdminLayout";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { showSuccessAlert, showErrorAlert, showConfirmAlert } from "../../utils/alerts";
import { Link } from 'react-router-dom';
export default function NewOrder() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    clientName: '',
    email: '',
    phone: '',
    pieceType: '',
    brand: '',
    model: '',
    serialNumber: '',
    initialStatus: 'Recibido',
    priority: 'Media',
    description: '',
    receptionDate: new Date().toLocaleDateString('es-MX'),
    estimatedDelivery: ''
  });

  const statusOptions = ["Recibido", "Diagnóstico", "Espera de Piezas", "En Taller", "Calidad", "Listo"];
  const priorityOptions = ["Alta", "Media", "Baja"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
 
    if (!formData.clientName || !formData.pieceType) {
      await showErrorAlert(
        'Campos requeridos',
        'Por favor complete los campos obligatorios: Nombre del Cliente y Tipo de Pieza.'
      );
      return;
    }

    const result = await showConfirmAlert(
      'Confirmar Creación',
      `¿Desea crear una nueva orden para ${formData.clientName}?`
    );
    
    if (result.isConfirmed) {
      
      setTimeout(async () => {
        await showSuccessAlert(
          'Orden Creada',
          `La orden ha sido creada exitosamente para ${formData.clientName}.`
        );
        navigate('/admin/orders');
      }, 500);
    }
  };

  const handleCancel = async () => {
    const result = await showConfirmAlert(
      'Cancelar Creación',
      '¿Está seguro que desea cancelar? Los datos ingresados se perderán.'
    );
    
    if (result.isConfirmed) {
      navigate('/admin/orders');
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
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
              Nueva Orden de Servicio
            </h1>
          </div>
          <p className="text-sm text-[#B08968] font-light">
            Complete los datos para crear una nueva orden
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="bg-white p-8  border border-[#e8e2d9] shadow-sm">
            <h2 className="font-light text-lg text-[#6B4E2E] mb-6 tracking-wider">
              Información del Cliente
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm text-[#B08968] font-light mb-2">
                  Nombre del Cliente *
                </label>
                <input 
                  type="text" 
                  name="clientName"
                  value={formData.clientName}
                  onChange={handleChange}
                  placeholder="Ingrese nombre completo"
                  className="w-full px-4 py-3 border border-[#e8e2d9]  focus:border-[#6B4E2E] focus:outline-none transition-colors duration-200"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm text-[#B08968] font-light mb-2">
                  Teléfono
                </label>
                <input 
                  type="tel" 
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+52 123 456 7890"
                  className="w-full px-4 py-3 border border-[#e8e2d9]  focus:border-[#6B4E2E] focus:outline-none transition-colors duration-200"
                />
              </div>
              
              <div>
                <label className="block text-sm text-[#B08968] font-light mb-2">
                  Correo Electrónico
                </label>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="cliente@ejemplo.com"
                  className="w-full px-4 py-3 border border-[#e8e2d9]  focus:border-[#6B4E2E] focus:outline-none transition-colors duration-200"
                />
              </div>

              <div>
                <label className="block text-sm text-[#B08968] font-light mb-2">
                  Prioridad
                </label>
                <select 
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-[#e8e2d9]  focus:border-[#6B4E2E] focus:outline-none transition-colors duration-200"
                >
                  {priorityOptions.map(priority => (
                    <option key={priority} value={priority}>{priority}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          
          
          <div className="bg-white p-8 border border-[#e8e2d9] shadow-sm">
            <h2 className="font-light text-lg text-[#6B4E2E] mb-6 tracking-wider">
              Información de la Pieza
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm text-[#B08968] font-light mb-2">
                  Tipo de Pieza *
                </label>
                <input 
                  type="text" 
                  name="pieceType"
                  value={formData.pieceType}
                  onChange={handleChange}
                  placeholder="Ej: Reloj de pulsera, collar, etc."
                  className="w-full px-4 py-3 border border-[#e8e2d9]  focus:border-[#6B4E2E] focus:outline-none transition-colors duration-200"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm text-[#B08968] font-light mb-2">
                  Marca
                </label>
                <input 
                  type="text" 
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  placeholder="Ej: Rolex, Cartier, etc."
                  className="w-full px-4 py-3 border border-[#e8e2d9]  focus:border-[#6B4E2E] focus:outline-none transition-colors duration-200"
                />
              </div>
              
              <div>
                <label className="block text-sm text-[#B08968] font-light mb-2">
                  Modelo
                </label>
                <input 
                  type="text" 
                  name="model"
                  value={formData.model}
                  onChange={handleChange}
                  placeholder="Modelo específico"
                  className="w-full px-4 py-3 border border-[#e8e2d9]  focus:border-[#6B4E2E] focus:outline-none transition-colors duration-200"
                />
              </div>
              
              <div>
                <label className="block text-sm text-[#B08968] font-light mb-2">
                  Número de Serie
                </label>
                <input 
                  type="text" 
                  name="serialNumber"
                  value={formData.serialNumber}
                  onChange={handleChange}
                  placeholder="Ingrese número de serie"
                  className="w-full px-4 py-3 border border-[#e8e2d9]  focus:border-[#6B4E2E] focus:outline-none transition-colors duration-200"
                />
              </div>

              <div>
                <label className="block text-sm text-[#B08968] font-light mb-2">
                  Estado Inicial
                </label>
                <select 
                  name="initialStatus"
                  value={formData.initialStatus}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-[#e8e2d9]  focus:border-[#6B4E2E] focus:outline-none transition-colors duration-200"
                >
                  {statusOptions.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm text-[#B08968] font-light mb-2">
                  Fecha Recepción
                </label>
                <input 
                  type="text" 
                  name="receptionDate"
                  value={formData.receptionDate}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-[#e8e2d9]  focus:border-[#6B4E2E] focus:outline-none transition-colors duration-200"
                />
              </div>

              <div>
                <label className="block text-sm text-[#B08968] font-light mb-2">
                  Fecha Estimada de Entrega
                </label>
                <div className="flex space-x-2">
                  <input 
                    type="date" 
                    name="estimatedDelivery"
                    value={formData.estimatedDelivery}
                    onChange={handleChange}
                    placeholder="DD/MM/AAAA"
                    className="flex-1 px-4 py-3 border border-[#e8e2d9]  focus:border-[#6B4E2E] focus:outline-none transition-colors duration-200"
                  />
                </div>
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm text-[#B08968] font-light mb-2">
                  Descripción del Servicio Solicitado
                </label>
                <textarea 
                  rows="3"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describa el servicio requerido..."
                  className="w-full px-4 py-3 border border-[#e8e2d9]  focus:border-[#6B4E2E] focus:outline-none transition-colors duration-200"
                />
              </div>
            </div>
          </div>

          <div className="flex space-x-4">
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-3 border border-[#e8e2d9]  text-[#6B4E2E] font-light hover:bg-[#faf8f5] transition-colors duration-200"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-[#ff8c00] text-white  font-light hover:bg-[#e67e00] transition-colors duration-200"
            >
              Crear Orden
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}