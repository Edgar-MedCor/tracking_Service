import AdminLayout from "./AdminLayout";
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { showConfirmAlert, showSuccessAlert, showErrorAlert } from "../../utils/alerts";
import { api } from '../../services/api';

export default function OrdersList() {
  const [orders, setOrders] = useState([]);
  const [masterData, setMasterData] = useState({
    priorities: [],
    statuses: []
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Todas las órdenes');
  const [priorityFilter, setPriorityFilter] = useState('Todas');
  const [sortBy, setSortBy] = useState('received_date');
  const [sortOrder, setSortOrder] = useState('desc');

  // Cargar datos iniciales
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      
      // Cargar órdenes y datos maestros en paralelo
      const [ordersResponse, mastersResponse] = await Promise.all([
        api.getOrders(),
        fetch(`${import.meta.env.VITE_API_URL}/orders/data/masters`).then(res => res.json())
      ]);

      if (ordersResponse.success) {
        setOrders(ordersResponse.orders || []);
      }

      if (mastersResponse.success) {
        setMasterData({
          priorities: mastersResponse.priorities || [],
          statuses: mastersResponse.statuses || []
        });
      }
    } catch (error) {
      console.error('Error cargando datos:', error);
      showErrorAlert('Error', 'No se pudieron cargar las órdenes');
    } finally {
      setLoading(false);
    }
  };

  // Buscar órdenes en tiempo real
  useEffect(() => {
    if (searchTerm.trim()) {
      const searchTimeout = setTimeout(async () => {
        try {
          setLoading(true);
          const response = await api.searchOrders(searchTerm);
          if (response.success) {
            setOrders(response.orders || []);
          }
        } catch (error) {
          console.error('Error buscando órdenes:', error);
        } finally {
          setLoading(false);
        }
      }, 500);

      return () => clearTimeout(searchTimeout);
    } else {
      loadInitialData();
    }
  }, [searchTerm]);



  const statusColors = {
    "En Diagnóstico": "bg-blue-50 text-blue-700 w-24 h-10 flex items-center justify-center text-center",
    "En espera de aprobación por cliente": "bg-yellow-50 text-yellow-700 w-24 h-10 flex items-center justify-center text-center",
    "En servicio": "bg-orange-50 text-orange-700 w-24 h-10 flex items-center justify-center text-center",
    "Pieza lista para entrega": "bg-purple-50 text-purple-700 w-24 h-10 flex items-center justify-center text-center"
  };

  const priorityColors = {
    "Alta": "bg-red-50 text-red-600 border border-red-200 w-24 text-center",
    "Media": "bg-yellow-50 text-yellow-600 border border-yellow-200 w-24 text-center",
    "Baja": "bg-green-50 text-green-600 border border-green-200 w-20 text-center",
  };

  const handleDeleteOrder = async (orderId, orderNumber) => {
    const result = await showConfirmAlert(
      'Eliminar Orden',
      `¿Está seguro que desea eliminar permanentemente la orden ${orderNumber}? Esta acción no se puede deshacer.`,
      'Eliminar',
      'Cancelar'
    );
    
    if (result.isConfirmed) {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/orders/${orderId}`, {
          method: 'DELETE'
        });
        
        const data = await response.json();
        
        if (data.success) {
          const updatedOrders = orders.filter(order => order.id !== orderId);
          setOrders(updatedOrders);
          
          await showSuccessAlert(
            'Orden Eliminada',
            `La orden ${orderNumber} ha sido eliminada correctamente.`
          );
        } else {
          throw new Error(data.error || 'Error al eliminar');
        }
      } catch (error) {
        console.error('Error eliminando orden:', error);
        await showErrorAlert(
          'Error',
          error.message || 'No se pudo eliminar la orden'
        );
      }
    }
  };

  const handleStatusChange = async (orderId, currentStatus) => {
    const statusSelect = document.createElement('select');
    statusSelect.className = 'w-full p-2 border border-[#e8e2d9] mt-2';
    
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = 'Seleccione un estado';
    defaultOption.disabled = true;
    statusSelect.appendChild(defaultOption);
    
    masterData.statuses.forEach(status => {
      const option = document.createElement('option');
      option.value = status.id;
      option.textContent = status.name;
      option.selected = status.name === currentStatus;
      statusSelect.appendChild(option);
    });

    const result = await showConfirmAlert(
      'Cambiar Estado',
      `Seleccione el nuevo estado para la orden:`,
      'Actualizar',
      'Cancelar',
      statusSelect
    );
    
    if (result.isConfirmed) {
      const newStatusId = parseInt(statusSelect.value);
      const newStatusName = masterData.statuses.find(s => s.id === newStatusId)?.name;
      
      if (!newStatusId || !newStatusName) {
        await showErrorAlert('Error', 'Estado inválido seleccionado');
        return;
      }
      
      try {
        const response = await api.updateStatus(orderId, newStatusId);
        
        if (response.success) {
          // Actualizar estado localmente
          const updatedOrders = orders.map(order => 
            order.id === orderId 
              ? { 
                  ...order, 
                  estado: newStatusName,
                  estado_id: newStatusId 
                }
              : order
          );
          
          setOrders(updatedOrders);
          
          await showSuccessAlert(
            'Estado Actualizado',
            `El estado ha sido cambiado a "${newStatusName}".`
          );
        }
      } catch (error) {
        console.error('Error actualizando estado:', error);
        await showErrorAlert(
          'Error',
          error.message || 'No se pudo actualizar el estado'
        );
      }
    }
  };


  let filteredOrders = orders.filter(order => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = 
      order.order_number?.toLowerCase().includes(searchLower) ||
      order.client_name?.toLowerCase().includes(searchLower) ||
      order.device_type?.toLowerCase().includes(searchLower) ||
      order.device_brand?.toLowerCase().includes(searchLower) ||
      order.device_model?.toLowerCase().includes(searchLower);
    
    const matchesStatus = statusFilter === 'Todas las órdenes' || order.estado === statusFilter;
    const matchesPriority = priorityFilter === 'Todas' || order.prioridad === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });
  filteredOrders.sort((a, b) => {
    if (sortBy === 'received_date') {
      const dateA = new Date(a.fecha_iso || a.received_date);
      const dateB = new Date(b.fecha_iso || b.received_date);
      return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    } else if (sortBy === 'priority') {
      const priorityOrder = { "Alta": 3, "Media": 2, "Baja": 1 };
      const priorityA = priorityOrder[a.prioridad] || 0;
      const priorityB = priorityOrder[b.prioridad] || 0;
      return sortOrder === 'desc' ? priorityB - priorityA : priorityA - priorityB;
    } else if (sortBy === 'order_number') {
      const numA = a.order_number || '';
      const numB = b.order_number || '';
      return sortOrder === 'desc' 
        ? numB.localeCompare(numA)
        : numA.localeCompare(numB);
    }
    return 0;
  });

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
  };

  const getSortIcon = (column) => {
    if (sortBy !== column) return null;
    return sortOrder === 'asc' ? '↑' : '↓';
  };



  if (loading && orders.length === 0) {
    return (
      <AdminLayout>
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ff8c00] mx-auto"></div>
            <p className="text-[#6B4E2E] mt-4">Cargando órdenes...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-light tracking-wider text-[#6B4E2E] mb-2">
              Órdenes de Servicio
            </h1>
            <p className="text-sm text-[#B08968] font-light">
              {filteredOrders.length} órdenes encontradas
            </p>
          </div>
          <div>
            <Link
              to="/admin/new-order"
              className="px-6 py-3 bg-[#ff8c00] text-white font-light hover:bg-[#e67e00] transition-colors duration-200 flex items-center space-x-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>Nueva Orden</span>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="md:col-span-2">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por ID, cliente, marca o tipo de pieza..."
              className="w-full px-4 py-3 border border-[#e8e2d9] focus:border-[#6B4E2E] focus:outline-none transition-colors duration-200"
            />
          </div>
          <div className="flex space-x-2">
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="flex-1 px-4 py-3 border border-[#e8e2d9] focus:border-[#6B4E2E] focus:outline-none transition-colors duration-200"
            >
              <option>Todas las órdenes</option>
              {masterData.statuses.map(status => (
                <option key={status.id}>{status.name}</option>
              ))}
            </select>
            <select 
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="flex-1 px-4 py-3 border border-[#e8e2d9] focus:border-[#6B4E2E] focus:outline-none transition-colors duration-200"
            >
              <option>Todas</option>
              {masterData.priorities.map(priority => (
                <option key={priority.id}>{priority.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white border border-[#e8e2d9] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#faf8f5]">
                <th 
                  className="p-4 text-left text-sm font-medium text-[#B08968] cursor-pointer hover:text-[#6B4E2E]"
                  onClick={() => handleSort('order_number')}
                >
                  <div className="flex items-center">
                    Orden
                    <span className="ml-1 text-xs">{getSortIcon('order_number')}</span>
                  </div>
                </th>
                <th className="p-4 text-left text-sm font-medium text-[#B08968]">Cliente</th>
                <th className="p-4 text-left text-sm font-medium text-[#B08968]">Pieza</th>
                <th 
                  className="p-4 text-left text-sm font-medium text-[#B08968] cursor-pointer hover:text-[#6B4E2E]"
                  onClick={() => handleSort('received_date')}
                >
                  <div className="flex items-center">
                    Fecha
                    <span className="ml-1 text-xs">{getSortIcon('received_date')}</span>
                  </div>
                </th>
                <th className="p-4 text-left text-sm font-medium text-[#B08968]">Estado</th>
                <th 
                  className="p-4 text-left text-sm font-medium text-[#B08968] cursor-pointer hover:text-[#6B4E2E]"
                  onClick={() => handleSort('priority')}
                >
                  <div className="flex items-center">
                    Prioridad
                    <span className="ml-1 text-xs">{getSortIcon('priority')}</span>
                  </div>
                </th>
                <th className="p-4 text-left text-sm font-medium text-[#B08968]">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f5f1e8]">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-[#faf8f5] transition-colors duration-200">
                  <td className="p-4">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-[#ff8c00] rounded-full mr-3"></div>
                      <div>
                        <p className="font-medium text-[#6B4E2E]">{order.order_number}</p>
                        {order.tiempo_desde_creacion && (
                          <p className="text-xs text-[#B08968] font-light">{order.tiempo_desde_creacion}</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div>
                      <p className="font-medium text-[#6B4E2E]">{order.client_name}</p>
                      {order.client_phone && (
                        <p className="text-xs text-[#B08968] font-light">{order.client_phone}</p>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <div>
                      <p className="text-sm text-[#6B4E2E] font-medium">{order.device_type}</p>
                      {order.device_brand && (
                        <p className="text-xs text-[#B08968] font-light">{order.device_brand}</p>
                      )}
                      {order.device_model && (
                        <p className="text-xs text-[#B08968] font-light">{order.device_model}</p>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <p className="text-sm text-[#B08968] font-light">{order.fecha}</p>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-3 py-1 text-xs font-medium ${statusColors[order.estado] || 'bg-gray-100 text-gray-800'}`}>
                      {order.estado || 'Sin estado'}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`inline-block px-3 py-1 text-xs font-medium ${priorityColors[order.prioridad] || 'bg-gray-50 text-gray-600 border border-gray-200'}`}>
                      {order.prioridad || 'Sin prioridad'}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex space-x-3">
                      <Link
                        to={`/admin/orders/${order.id}`}
                        className="text-[#6B4E2E] hover:text-[#ff8c00] transition-colors duration-200"
                        title="Ver detalles"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </Link>
                      <button
                        onClick={() => handleDeleteOrder(order.id, order.order_number)}
                        className="text-[#6B4E2E] hover:text-red-600 transition-colors duration-200"
                        title="Eliminar orden"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredOrders.length === 0 && (
          <div className="p-12 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-[#e8e2d9] mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p className="text-[#B08968] font-light">No se encontraron órdenes con los filtros aplicados</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('Todas las órdenes');
                setPriorityFilter('Todas');
                loadInitialData();
              }}
              className="mt-4 text-sm text-[#ff8c00] hover:text-[#e67e00] transition-colors duration-200"
            >
              Limpiar filtros y recargar
            </button>
          </div>
        )}

        <div className="p-4 border-t border-[#e8e2d9] flex justify-between items-center">
          <p className="text-sm text-[#B08968] font-light">
            Mostrando {filteredOrders.length} de {orders.length} órdenes
          </p>
          <div className="flex space-x-2">
            <button 
              className="px-3 py-1 border border-[#e8e2d9] rounded text-sm font-light text-[#6B4E2E] hover:bg-[#faf8f5]"
              onClick={loadInitialData}
            >
              Actualizar
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}