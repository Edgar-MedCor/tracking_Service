
import AdminLayout from "./AdminLayout";
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { showConfirmAlert, showSuccessAlert  } from "../../utils/alerts";

export default function OrdersList() {
  const [orders, setOrders] = useState([
    { id: "UJ-2026-015", client: "María Rodríguez", status: "En Taller", date: "15/01/2024", priority: "Alta", pieceType: "Reloj Rolex", brand: "Rolex" },
    { id: "UJ-2026-014", client: "Andrés López", status: "Diagnóstico", date: "14/01/2024", priority: "Media", pieceType: "Collar de oro", brand: "Cartier" },
    { id: "UJ-2026-013", client: "Sofía Martínez", status: "Recibido", date: "13/01/2024", priority: "Baja", pieceType: "Anillo diamante", brand: "Tiffany" },
    { id: "UJ-2026-012", client: "Carlos Gómez", status: "Listo", date: "12/01/2024", priority: "Media", pieceType: "Pulsera plata", brand: "David Yurman" },
    { id: "UJ-2026-011", client: "Roberto Sánchez", status: "En Taller", date: "11/01/2024", priority: "Alta", pieceType: "Reloj Cartier", brand: "Cartier" },
    { id: "UJ-2026-010", client: "Laura Fernández", status: "Calidad", date: "10/01/2024", priority: "Media", pieceType: "Cadena oro", brand: "Bulgari" },
    { id: "UJ-2026-009", client: "Miguel Torres", status: "Espera de Piezas", date: "09/01/2024", priority: "Alta", pieceType: "Reloj Patek", brand: "Patek Philippe" },
    { id: "UJ-2026-008", client: "Elena Vargas", status: "Listo", date: "08/01/2024", priority: "Baja", pieceType: "Aretes diamantes", brand: "Harry Winston" },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Todas las órdenes');
  const [priorityFilter, setPriorityFilter] = useState('Todas');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');

  const statusOptions = ["Recibido", "Diagnóstico", "Espera de Piezas", "En Taller", "Calidad", "Listo"];
  
const statusColors = {
  "Recibido": "bg-gray-100 text-gray-800 w-24 h-10 flex items-center justify-center text-center",
  "Diagnóstico": "bg-blue-50 text-blue-700 w-24 h-10 flex items-center justify-center text-center",
  "Espera de Piezas": "bg-yellow-50 text-yellow-700 w-24 h-10 flex items-center justify-center text-center",
  "En Taller": "bg-orange-50 text-orange-700 w-24 h-10 flex items-center justify-center text-center",
  "Calidad": "bg-purple-50 text-purple-700 w-24 h-10 flex items-center justify-center text-center",
  "Listo": "bg-green-50 text-green-700 w-24 h-10 flex items-center justify-center text-center"
};

  const priorityColors = {
    "Alta": "bg-red-50 text-red-600 border border-red-200 w-24 text-center",
    "Media": "bg-yellow-50 text-yellow-600 border border-yellow-200 w-24 text-center",
    "Baja": "bg-green-50 text-green-600 border border-green-200 w-20 text-center",
  };

  const handleDeleteOrder = async (orderId) => {
    const result = await showConfirmAlert(
      'Eliminar Orden',
      `¿Está seguro que desea eliminar la orden ${orderId}? Esta acción no se puede deshacer.`,
      'Eliminar',
      'Cancelar'
    );
    
    if (result.isConfirmed) {
      const updatedOrders = orders.filter(order => order.id !== orderId);
      setOrders(updatedOrders);
      
      await showSuccessAlert(
        'Orden Eliminada',
        `La orden ${orderId} ha sido eliminada correctamente.`
      );
    }
  };

  const handleStatusChange = async (orderId, currentStatus) => {
    const statusSelect = document.createElement('select');
    statusSelect.className = 'w-full p-2 border border-[#e8e2d9] mt-2';
    statusOptions.forEach(status => {
      const option = document.createElement('option');
      option.value = status;
      option.textContent = status;
      option.selected = status === currentStatus;
      statusSelect.appendChild(option);
    });

    const result = await showConfirmAlert(
      'Cambiar Estado',
      `Seleccione el nuevo estado para la orden ${orderId}:`,
      'Actualizar',
      'Cancelar',
      statusSelect
    );
    
    if (result.isConfirmed) {
      const newStatus = statusSelect.value;
      const updatedOrders = orders.map(order => 
        order.id === orderId 
          ? { ...order, status: newStatus }
          : order
      );
      
      setOrders(updatedOrders);
      
      await showSuccessAlert(
        'Estado Actualizado',
        `El estado de la orden ${orderId} ha sido cambiado a "${newStatus}".`
      );
    }
  };


  let filteredOrders = orders.filter(order => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = 
      order.id.toLowerCase().includes(searchLower) ||
      order.client.toLowerCase().includes(searchLower) ||
      order.pieceType.toLowerCase().includes(searchLower) ||
      order.brand.toLowerCase().includes(searchLower);
    
    const matchesStatus = statusFilter === 'Todas las órdenes' || order.status === statusFilter;
    const matchesPriority = priorityFilter === 'Todas' || order.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });


  filteredOrders.sort((a, b) => {
    if (sortBy === 'date') {
      const dateA = new Date(a.date.split('/').reverse().join('-'));
      const dateB = new Date(b.date.split('/').reverse().join('-'));
      return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    } else if (sortBy === 'priority') {
      const priorityOrder = { "Alta": 3, "Media": 2, "Baja": 1 };
      const priorityA = priorityOrder[a.priority] || 0;
      const priorityB = priorityOrder[b.priority] || 0;
      return sortOrder === 'desc' ? priorityB - priorityA : priorityA - priorityB;
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
              className="px-6 py-3 bg-[#ff8c00] text-white  font-light hover:bg-[#e67e00] transition-colors duration-200 flex items-center space-x-2"
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
              {statusOptions.map(status => (
                <option key={status}>{status}</option>
              ))}
            </select>
            <select 
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="flex-1 px-4 py-3 border border-[#e8e2d9] focus:border-[#6B4E2E] focus:outline-none transition-colors duration-200"
            >
              <option>Todas</option>
              <option>Alta</option>
              <option>Media</option>
              <option>Baja</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white  border border-[#e8e2d9] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#faf8f5]">
                <th 
                  className="p-4 text-left text-sm font-medium text-[#B08968] cursor-pointer hover:text-[#6B4E2E]"
                  onClick={() => handleSort('id')}
                >
                  <div className="flex items-center">
                    Orden
                    <span className="ml-1 text-xs">{getSortIcon('id')}</span>
                  </div>
                </th>
                <th className="p-4 text-left text-sm font-medium text-[#B08968]">Cliente</th>
                <th className="p-4 text-left text-sm font-medium text-[#B08968]">Pieza</th>
                <th 
                  className="p-4 text-left text-sm font-medium text-[#B08968] cursor-pointer hover:text-[#6B4E2E]"
                  onClick={() => handleSort('date')}
                >
                  <div className="flex items-center">
                    Fecha
                    <span className="ml-1 text-xs">{getSortIcon('date')}</span>
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
              {filteredOrders.map((order, i) => (
                <tr key={i} className="hover:bg-[#faf8f5] transition-colors duration-200">
                  <td className="p-4">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-[#ff8c00] rounded-full mr-3"></div>
                      <p className="font-medium text-[#6B4E2E]">{order.id}</p>
                    </div>
                  </td>
                  <td className="p-4">
                    <p className="font-medium text-[#6B4E2E]">{order.client}</p>
                  </td>
                  <td className="p-4">
                    <div>
                      <p className="text-sm text-[#6B4E2E] font-medium">{order.pieceType}</p>
                      <p className="text-xs text-[#B08968] font-light">{order.brand}</p>
                    </div>
                  </td>
                  <td className="p-4">
                    <p className="text-sm text-[#B08968] font-light">{order.date}</p>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-3 py-1 l text-xs font-medium ${statusColors[order.status]}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`inline-block px-3  py-1 text-xs font-medium ${priorityColors[order.priority]}`}>
                      {order.priority}
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
                        onClick={() => handleStatusChange(order.id, order.status)}
                        className="text-[#6B4E2E] hover:text-[#ff8c00] transition-colors duration-200"
                        title="Cambiar estado"
                      >
                       
                      </button>
                      <button
                        onClick={() => handleDeleteOrder(order.id)}
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
              }}
              className="mt-4 text-sm text-[#ff8c00] hover:text-[#e67e00] transition-colors duration-200"
            >
              Limpiar filtros
            </button>
          </div>
        )}

        <div className="p-4 border-t border-[#e8e2d9] flex justify-between items-center">
          <p className="text-sm text-[#B08968] font-light">
            Mostrando {filteredOrders.length} de {orders.length} órdenes
          </p>
          <div className="flex space-x-2">
            <button className="px-3 py-1 border border-[#e8e2d9] rounded text-sm font-light text-[#6B4E2E] hover:bg-[#faf8f5]">
              ← Anterior
            </button>
            <button className="px-3 py-1 border border-[#e8e2d9] rounded text-sm font-light text-[#6B4E2E] hover:bg-[#faf8f5]">
              Siguiente →
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}