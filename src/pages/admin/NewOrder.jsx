import AdminLayout from "./AdminLayout";
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { showSuccessAlert, showErrorAlert, showConfirmAlert } from "../../utils/alerts";
import { Link } from 'react-router-dom';
import { api } from '../../services/api'; 

export default function NewOrder() {
  const navigate = useNavigate();
  
  
  const [masterData, setMasterData] = useState({
    priorities: [],
    statuses: []
  });
  
  const [loadingMasterData, setLoadingMasterData] = useState(true);
  
  const [formData, setFormData] = useState({
    order_number: '',
    client_name: '',
    client_email: '',
    client_phone: '',
    device_type: '',
    device_brand: '',
    device_model: '',
    serial_number: '',
    status_id: '',
    priority_id: '',
    initial_note: '',
    received_date: new Date().toISOString().split('T')[0], 
    estimated_delivery: ''
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  
  useEffect(() => {
    loadMasterData();
  }, []);


  const loadMasterData = async () => {
    try {
      const response = await api.getMasterData?.() || 
        await fetch(`${import.meta.env.VITE_API_URL}/orders/data/masters`).then(res => res.json());
      
      if (response.success) {
        setMasterData({
          priorities: response.priorities,
          statuses: response.statuses
        });
        
    
        const defaultStatus = response.statuses.find(s => s.name === 'Recibido');
        const defaultPriority = response.priorities.find(p => p.name === 'Media');
        
        if (defaultStatus && defaultPriority) {
          setFormData(prev => ({
            ...prev,
            status_id: defaultStatus.id.toString(),
            priority_id: defaultPriority.id.toString()
          }));
        }
      }
    } catch (error) {
      console.error('Error cargando datos maestros:', error);
      showErrorAlert('Error', 'No se pudieron cargar los datos necesarios');
    } finally {
      setLoadingMasterData(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
  
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };


  const validateForm = () => {
    const newErrors = {};
    if (!formData.order_number?.trim()) {
      newErrors.order_number = 'El número de orden es requerido';
    } else if (formData.order_number.length > 20) {
      newErrors.order_number = 'Máximo 20 caracteres';
    }
    
    if (!formData.client_name?.trim()) {
      newErrors.client_name = 'El nombre del cliente es requerido';
    } else if (formData.client_name.length > 30) {
      newErrors.client_name = 'Máximo 30 caracteres';
    }
    
    if (!formData.device_type?.trim()) {
      newErrors.device_type = 'El tipo de dispositivo es requerido';
    } else if (formData.device_type.length > 100) {
      newErrors.device_type = 'Máximo 100 caracteres';
    }
    
    
    if (formData.client_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.client_email)) {
      newErrors.client_email = 'Correo electrónico inválido';
    }
    
    
    if (formData.client_phone && !/^[\d\s\-\+\(\)]{10,20}$/.test(formData.client_phone.replace(/\s/g, ''))) {
      newErrors.client_phone = 'Teléfono inválido (10-20 dígitos)';
    }
    
    
    if (!formData.status_id) {
      newErrors.status_id = 'Seleccione un estado';
    }
    
    if (!formData.priority_id) {
      newErrors.priority_id = 'Seleccione una prioridad';
    }
    
    if (formData.estimated_delivery) {
      const receivedDate = new Date(formData.received_date);
      const estimatedDate = new Date(formData.estimated_delivery);
      
      if (estimatedDate < receivedDate) {
        newErrors.estimated_delivery = 'La fecha estimada no puede ser anterior a la fecha de recepción';
      }
    }
    
    if (formData.device_brand && formData.device_brand.length > 50) {
      newErrors.device_brand = 'Máximo 50 caracteres';
    }
    
    if (formData.device_model && formData.device_model.length > 50) {
      newErrors.device_model = 'Máximo 50 caracteres';
    }
    
    if (formData.serial_number && formData.serial_number.length > 100) {
      newErrors.serial_number = 'Máximo 100 caracteres';
    }
    
    if (formData.initial_note && formData.initial_note.length > 1000) {
      newErrors.initial_note = 'Máximo 1000 caracteres';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    
    if (!validateForm()) {
      await showErrorAlert(
        'Error de validación',
        'Por favor corrija los errores en el formulario'
      );
      return;
    }

    const result = await showConfirmAlert(
      'Confirmar Creación',
      `¿Desea crear una nueva orden ${formData.order_number} para ${formData.client_name}?`
    );
    
    if (!result.isConfirmed) {
      return;
    }
    
    setLoading(true);
    
    try {

      const orderData = {
        order_number: formData.order_number.trim(),
        client_name: formData.client_name.trim(),
        client_phone: formData.client_phone?.trim() || null,
        client_email: formData.client_email?.trim() || null,
        priority_id: parseInt(formData.priority_id),
        device_type: formData.device_type.trim(),
        device_brand: formData.device_brand?.trim() || null,
        device_model: formData.device_model?.trim() || null,
        serial_number: formData.serial_number?.trim() || null,
        status_id: parseInt(formData.status_id),
        received_date: formData.received_date,
        estimated_delivery: formData.estimated_delivery || null,
        initial_note: formData.initial_note?.trim() || null
      };
      
      
      const response = await api.createOrder(orderData);
      
      if (response.success) {
        await showSuccessAlert(
          '¡Orden Creada!',
          `Orden #${formData.order_number} creada exitosamente para ${formData.client_name}.`
        );
        
        
        navigate('/admin/orders');
      } else {
        throw new Error(response.error || 'Error al crear la orden');
      }
      
    } catch (error) {
      console.error('Error creando orden:', error);
      
      let errorMessage = 'Error al crear la orden';
      
      if (error.message.includes('número de orden') || error.message.includes('23505')) {
        errorMessage = `El número de orden '${formData.order_number}' ya existe. Por favor use un número diferente.`;
      } else if (error.message.includes('prioridad o estado') || error.message.includes('23503')) {
        errorMessage = 'Error en los datos de prioridad o estado. Por favor verifique.';
      } else if (error.message.includes('campo requerido') || error.message.includes('23502')) {
        errorMessage = 'Faltan campos requeridos. Por favor complete todos los campos obligatorios.';
      }
      
      await showErrorAlert('Error', errorMessage);
    } finally {
      setLoading(false);
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


  if (loadingMasterData) {
    return (
      <AdminLayout>
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ff8c00] mx-auto"></div>
            <p className="text-[#6B4E2E] mt-4">Cargando datos...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

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
              NUEVA ORDEN DE SERVICIO
            </h1>
          </div>
          <p className="text-sm text-[#B08968] font-light">
            Complete los datos para crear una nueva orden
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white p-8 border border-[#e8e2d9] shadow-sm">
            <h2 className="font-light text-lg text-[#6B4E2E] mb-6 tracking-wider">
              INFORMACIÓN DE LA ORDEN
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm text-[#B08968] font-light mb-2">
                  NÚMERO DE ORDEN *
                </label>
                <input 
                  type="text" 
                  name="order_number"
                  value={formData.order_number}
                  onChange={handleChange}
                  placeholder="Ej: ORD-2026-001"
                  className={`w-full px-4 py-3 border ${errors.order_number ? 'border-red-500' : 'border-[#e8e2d9]'} focus:border-[#6B4E2E] focus:outline-none transition-colors duration-200`}
                  required
                  disabled={loading}
                  maxLength="50"
                />
                {errors.order_number && (
                  <p className="text-red-500 text-xs mt-1">{errors.order_number}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm text-[#B08968] font-light mb-2">
                  ESTADO INICIAL *
                </label>
                <select 
                  name="status_id"
                  value={formData.status_id}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border ${errors.status_id ? 'border-red-500' : 'border-[#e8e2d9]'} focus:border-[#6B4E2E] focus:outline-none transition-colors duration-200`}
                  required
                  disabled={loading}
                >
                 
                  {masterData.statuses.map(status => (
                    <option key={status.id} value={status.id}>
                      {status.name}
                    </option>
                  ))}
                </select>
                {errors.status_id && (
                  <p className="text-red-500 text-xs mt-1">{errors.status_id}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm text-[#B08968] font-light mb-2">
                  PRIORIDAD *
                </label>
                <select 
                  name="priority_id"
                  value={formData.priority_id}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border ${errors.priority_id ? 'border-red-500' : 'border-[#e8e2d9]'} focus:border-[#6B4E2E] focus:outline-none transition-colors duration-200`}
                  required
                  disabled={loading}
                >
                 
                  {masterData.priorities.map(priority => (
                    <option key={priority.id} value={priority.id}>
                      {priority.name}
                    </option>
                  ))}
                </select>
                {errors.priority_id && (
                  <p className="text-red-500 text-xs mt-1">{errors.priority_id}</p>
                )}
              </div>

              <div>
                <label className="block text-sm text-[#B08968] font-light mb-2">
                  FECHA DE RECEPCIÓN
                </label>
                <input 
                  type="date" 
                  name="received_date"
                  value={formData.received_date}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-[#e8e2d9] focus:border-[#6B4E2E] focus:outline-none transition-colors duration-200"
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          
          <div className="bg-white p-8 border border-[#e8e2d9] shadow-sm">
            <h2 className="font-light text-lg text-[#6B4E2E] mb-6 tracking-wider">
              INFORMACIÓN DEL CLIENTE
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm text-[#B08968] font-light mb-2">
                  NOMBRE DEL CLIENTE *
                </label>
                <input 
                  type="text" 
                  name="client_name"
                  value={formData.client_name}
                  onChange={handleChange}
                  placeholder="Ingrese nombre completo"
                  className={`w-full px-4 py-3 border ${errors.client_name ? 'border-red-500' : 'border-[#e8e2d9]'} focus:border-[#6B4E2E] focus:outline-none transition-colors duration-200`}
                  required
                  disabled={loading}
                  maxLength="100"
                />
                {errors.client_name && (
                  <p className="text-red-500 text-xs mt-1">{errors.client_name}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm text-[#B08968] font-light mb-2">
                  TELÉFONO *
                </label>
                <input 
                  type="tel" 
                  name="client_phone"
                  value={formData.client_phone}
                  onChange={handleChange}
                  placeholder="+52 123 456 7890"
                  className={`w-full px-4 py-3 border ${errors.client_phone ? 'border-red-500' : 'border-[#e8e2d9]'} focus:border-[#6B4E2E] focus:outline-none transition-colors duration-200`}
                  disabled={loading}
                  maxLength="20"
                 required
                />
                {errors.client_phone && (
                  <p className="text-red-500 text-xs mt-1">{errors.client_phone}</p>
                )}
              </div>

              <div>
                <label className="block text-sm text-[#B08968] font-light mb-2">
                  CORREO ELECTRÓNICO
                </label>
                <input 
                  type="email" 
                  name="client_email"
                  value={formData.client_email}
                  onChange={handleChange}
                  placeholder="cliente@ejemplo.com"
                  className={`w-full px-4 py-3 border ${errors.client_email ? 'border-red-500' : 'border-[#e8e2d9]'} focus:border-[#6B4E2E] focus:outline-none transition-colors duration-200`}
                  disabled={loading}
                  maxLength="100"
                />
                {errors.client_email && (
                  <p className="text-red-500 text-xs mt-1">{errors.client_email}</p>
                )}
              </div>
            </div>
          </div>
          
          
          <div className="bg-white p-8 border border-[#e8e2d9] shadow-sm">
            <h2 className="font-light text-lg text-[#6B4E2E] mb-6 tracking-wider">
              INFORMACIÓN DE LA PIEZA Y SERVICIO
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm text-[#B08968] font-light mb-2">
                  TIPO DE DISPOSITIVO *
                </label>
                <input 
                  type="text" 
                  name="device_type"
                  value={formData.device_type}
                  onChange={handleChange}
                  placeholder="Ej: Reloj de pulsera, collar, anillo, etc."
                  className={`w-full px-4 py-3 border ${errors.device_type ? 'border-red-500' : 'border-[#e8e2d9]'} focus:border-[#6B4E2E] focus:outline-none transition-colors duration-200`}
                  required
                  disabled={loading}
                  maxLength="100"
                />
                {errors.device_type && (
                  <p className="text-red-500 text-xs mt-1">{errors.device_type}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm text-[#B08968] font-light mb-2">
                  MARCA
                </label>
                <input 
                  type="text" 
                  name="device_brand"
                  value={formData.device_brand}
                  onChange={handleChange}
                  placeholder="Ej: Rolex, Cartier, Tiffany, etc."
                  className={`w-full px-4 py-3 border ${errors.device_brand ? 'border-red-500' : 'border-[#e8e2d9]'} focus:border-[#6B4E2E] focus:outline-none transition-colors duration-200`}
                  disabled={loading}
                  maxLength="50"
                />
                {errors.device_brand && (
                  <p className="text-red-500 text-xs mt-1">{errors.device_brand}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm text-[#B08968] font-light mb-2">
                  MODELO
                </label>
                <input 
                  type="text" 
                  name="device_model"
                  value={formData.device_model}
                  onChange={handleChange}
                  placeholder="Modelo específico"
                  className={`w-full px-4 py-3 border ${errors.device_model ? 'border-red-500' : 'border-[#e8e2d9]'} focus:border-[#6B4E2E] focus:outline-none transition-colors duration-200`}
                  disabled={loading}
                  maxLength="50"
                />
                {errors.device_model && (
                  <p className="text-red-500 text-xs mt-1">{errors.device_model}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm text-[#B08968] font-light mb-2">
                  NÚMERO DE SERIE
                </label>
                <input 
                  type="text" 
                  name="serial_number"
                  value={formData.serial_number}
                  onChange={handleChange}
                  placeholder="Ingrese número de serie"
                  className={`w-full px-4 py-3 border ${errors.serial_number ? 'border-red-500' : 'border-[#e8e2d9]'} focus:border-[#6B4E2E] focus:outline-none transition-colors duration-200`}
                  disabled={loading}
                  maxLength="100"
                />
                {errors.serial_number && (
                  <p className="text-red-500 text-xs mt-1">{errors.serial_number}</p>
                )}
              </div>

              <div>
                <label className="block text-sm text-[#B08968] font-light mb-2">
                  FECHA ESTIMADA DE ENTREGA
                </label>
                <input 
                  type="date" 
                  name="estimated_delivery"
                  value={formData.estimated_delivery}
                  onChange={handleChange}
                  min={formData.received_date}
                  className={`w-full px-4 py-3 border ${errors.estimated_delivery ? 'border-red-500' : 'border-[#e8e2d9]'} focus:border-[#6B4E2E] focus:outline-none transition-colors duration-200`}
                  disabled={loading}
                />
                {errors.estimated_delivery && (
                  <p className="text-red-500 text-xs mt-1">{errors.estimated_delivery}</p>
                )}
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm text-[#B08968] font-light mb-2">
                  DESCRIPCIÓN DEL SERVICIO SOLICITADO
                </label>
                <textarea 
                  rows="4"
                  name="initial_note"
                  value={formData.initial_note}
                  onChange={handleChange}
                  placeholder="Describa en detalle el problema o servicio requerido..."
                  className={`w-full px-4 py-3 border ${errors.initial_note ? 'border-red-500' : 'border-[#e8e2d9]'} focus:border-[#6B4E2E] focus:outline-none transition-colors duration-200`}
                  disabled={loading}
                  maxLength="1000"
                />
                {errors.initial_note && (
                  <p className="text-red-500 text-xs mt-1">{errors.initial_note}</p>
                )}
                <p className="text-xs text-[#B08968] mt-1">
                  Esta descripción se registrará como la primera nota en la bitácora
                </p>
              </div>
            </div>
          </div>

          <div className="flex space-x-4">
            <button
              type="button"
              onClick={handleCancel}
              disabled={loading}
              className="px-6 py-3 border border-[#e8e2d9] bg-white text-[#ff8c00] font-light hover:text-white hover:bg-[#ff8c00] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              CANCELAR
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-[#ff8c00] border border-[#e8e2d9] text-white font-light hover:bg-white hover:text-[#ff8c00] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  CREANDO ORDEN...
                </>
              ) : (
                'CREAR ORDEN'
              )}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}