import AdminLayout from "./AdminLayout";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import {
  showSuccessAlert,
  showErrorAlert,
  showConfirmAlert,
} from "../../utils/alerts";
import { api } from "../../services/api";

export default function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [notes, setNotes] = useState([]);
  const [files, setFiles] = useState([]); 
  const [masterData, setMasterData] = useState({
    priorities: [],
    statuses: [],
  });
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false); 
  const [editData, setEditData] = useState({});
  const [newNote, setNewNote] = useState("");
  const fileInputRef = useRef(null); 

  const statusColors = {
    "En Diagnóstico": "bg-blue-50 text-blue-700",
    "En espera de aprobación por cliente": "bg-yellow-50 text-yellow-700",
    "En servicio": "bg-orange-50 text-orange-700",
    "Pieza lista para entrega": "bg-purple-50 text-purple-700",
  };

  const priorityColors = {
    Alta: "bg-red-50 text-red-600 border border-red-200",
    Media: "bg-yellow-50 text-yellow-600 border border-yellow-200",
    Baja: "bg-green-50 text-green-600 border border-green-200",
  };

  // Cargar datos iniciales
  useEffect(() => {
    if (id) {
      loadOrderData();
      loadMasterData();
    }
  }, [id]);

  const loadOrderData = async () => {
    try {
      setLoading(true);
      const response = await api.getOrder(id);

      if (response.success) {
        setOrder(response.order);
        setNotes(response.bitacora?.notas || []);
        setFiles(response.archivos || []); 

        // Preparar datos para edición
        setEditData({
          client_name: response.order.client_name,
          client_email: response.order.client_email,
          client_phone: response.order.client_phone,
          device_type: response.order.device_type,
          device_brand: response.order.device_brand,
          device_model: response.order.device_model,
          serial_number: response.order.serial_number,
          estimated_delivery: response.order.estimated_delivery,
          priority_id: response.order.priority_id,
        });
      }
    } catch (error) {
      console.error("Error cargando orden:", error);
      showErrorAlert("Error", "No se pudo cargar la orden");
      navigate("/admin/orders");
    } finally {
      setLoading(false);
    }
  };

  const loadMasterData = async () => {
    try {
      const response = await api.getMasterData();
      if (response.success) {
        setMasterData({
          priorities: response.priorities || [],
          statuses: response.statuses || [],
        });
      }
    } catch (error) {
      console.error("Error cargando datos maestros:", error);
    }
  };

  // --- FUNCIONES PARA ARCHIVOS ADJUNTOS ---
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

   
    if (file.size > 5 * 1024 * 1024) return showErrorAlert("Error", "El archivo debe ser menor a 5MB");

    const formData = new FormData();
    formData.append("file", file);

    try {
      setIsUploading(true);
      const response = await api.uploadFile(id, formData);

      if (response.success) {
        setFiles((prev) => [response.file, ...prev]); 
        await showSuccessAlert("¡Archivo Subido!", "El archivo se ha adjuntado correctamente a la orden.");
      }
    } catch (error) {
      console.error("Error subiendo archivo:", error);
      await showErrorAlert("Error", "No se pudo subir el archivo.");
    } finally {
      setIsUploading(false);
      // Limpiamos el input para permitir subir el mismo archivo otra vez si fuera necesario
      if (fileInputRef.current) fileInputRef.current.value = ""; 
    }
  };

  const handleDeleteFile = async (fileId) => {
    const result = await showConfirmAlert("Eliminar Archivo", "¿Estás seguro de que deseas eliminar este archivo de forma permanente?");

    if (!result.isConfirmed) return;

    try {
      const response = await api.deleteFile(id, fileId);

      if (response.success) {
        setFiles((prev) => prev.filter((f) => f.id !== fileId));
        await showSuccessAlert("Archivo eliminado", "El archivo se ha eliminado correctamente.");
      }
    } catch (error) {
      console.error("Error eliminando archivo:", error);
      await showErrorAlert("Error", "No se pudo eliminar el archivo.", error.message);
    }
  };
  // ----------------------------------------

  // Manejar edición
  const handleEditClick = () => {
    setIsEditing(true);
  };

  const [errors, setErrors] = useState({});

  const handleSaveChanges = async () => {
    const requiredFields = [
      "client_name",
      "device_type",
    ];

    const newErrors = {};

    // vacíos
    requiredFields.forEach((field) => {
      if (!editData[field]?.trim()) {
        newErrors[field] = "Este campo es obligatorio";
      }
    });

    // email
    if (
      editData.client_email &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editData.client_email)
    ) {
      newErrors.client_email = "Correo inválido";
    }

    // teléfono
    if (editData.client_phone && !/^[0-9]{8,15}$/.test(editData.client_phone)) {
      newErrors.client_phone = "Solo números (8 a 15 dígitos)";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      await showErrorAlert("Datos inválidos", "Revisa los campos marcados");
      return;
    }

    setErrors({});

    try {
      const response = await api.updateOrder(id, editData);

      if (response.success) {
        setOrder((prev) => ({ ...prev, ...editData }));
        setIsEditing(false);
        await showSuccessAlert("Guardado", "Orden actualizada");
        loadOrderData();
      }
    } catch (error) {
      await showErrorAlert("Error", error.message || "No se pudo guardar");
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    if (order) {
      setEditData({
        client_name: order.client_name,
        client_email: order.client_email,
        client_phone: order.client_phone,
        device_type: order.device_type,
        device_brand: order.device_brand,
        device_model: order.device_model,
        serial_number: order.serial_number,
        estimated_delivery: order.estimated_delivery,
        priority_id: order.priority_id,
      });
    }
  };

  const handleEditChange = (field, value) => {
    setEditData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Cambiar estado
  const handleStatusChange = async (newStatusId) => {
    const newStatus = masterData.statuses.find(
      (s) => s.id === parseInt(newStatusId),
    );

    const result = await showConfirmAlert(
      "Cambiar Estado",
      `¿Cambiar estado de "${order?.status_name}" a "${newStatus?.name}"?`,
    );

    if (result.isConfirmed && newStatus) {
      try {
        const response = await api.updateStatus(id, newStatus.id);

        if (response.success) {
          setOrder((prev) => ({
            ...prev,
            status_id: newStatus.id,
            status_name: newStatus.name,
          }));

          await showSuccessAlert(
            "¡Estado Actualizado!",
            `El estado ha sido cambiado a "${newStatus.name}"`,
          );
        }
      } catch (error) {
        console.error("Error actualizando estado:", error);
        await showErrorAlert("Error", "No se pudo actualizar el estado");
      }
    }
  };

  const handlePriorityChange = async (newPriorityId) => {
    const newPriority = masterData.priorities.find(
      (p) => p.id === parseInt(newPriorityId),
    );

    if (!newPriority) return;

    const result = await showConfirmAlert(
      "Cambiar Prioridad",
      `¿Cambiar a "${newPriority.name}"?`,
    );

    if (!result.isConfirmed) return;

    try {
      const response = await api.updatePriority(id, newPriority.id);

      if (response.success) {
        setOrder((prev) => ({
          ...prev,
          priority_id: newPriority.id,
          priority_name: newPriority.name,
        }));

        await showSuccessAlert(
          "¡Prioridad Actualizada!",
          `Ahora es "${newPriority.name}"`,
        );
      }
    } catch (err) {
      await showErrorAlert("Error", "No se pudo actualizar prioridad: " + err.message);
    }
  };

  // Agregar nota
  const handleAddNote = async () => {
    if (!newNote.trim()) {
      await showErrorAlert("Nota vacía", "Por favor ingrese una nota");
      return;
    }

    try {
      const response = await api.addNote(id, newNote);

      if (response.success) {
        const newNoteObj = {
          id: response.note.id,
          description: response.note.description,
          fecha_formateada:
            new Date().toLocaleDateString("es-MX") +
            " " +
            new Date().toLocaleTimeString("es-MX", {
              hour: "2-digit",
              minute: "2-digit",
            }),
          created_at: new Date().toISOString(),
        };

        setNotes((prev) => [newNoteObj, ...prev]);
        setNewNote("");

        await showSuccessAlert(
          "¡Nota Agregada!",
          "La nota se ha agregado correctamente",
        );
      }
    } catch (error) {
      console.error("Error agregando nota:", error);
      await showErrorAlert("Error", "No se pudo agregar la nota");
    }
  };

  // Eliminar nota
  const handleDeleteNote = async (noteId) => {
    const result = await showConfirmAlert("Eliminar Nota", "¿Seguro?");

    if (!result.isConfirmed) return;

    try {
      const response = await api.deleteNote(id, noteId);

      if (response.success) {
        setNotes((prev) => prev.filter((n) => n.id !== noteId));
        await showSuccessAlert("Nota eliminada", "Correctamente");
      }
    } catch (err) {
      await showErrorAlert("Error", "No se pudo eliminar", err.message);
    }
  };

  // Eliminar orden
  const handleDeleteOrder = async () => {
    const result = await showConfirmAlert(
      "Eliminar Orden",
      `¿Está seguro que desea eliminar permanentemente la orden ${order?.order_number}? Esta acción no se puede deshacer.`,
      "Eliminar",
      "Cancelar",
    );

    if (result.isConfirmed) {
      try {
        const response = await api.deleteOrder(id);

        if (response.success) {
          await showSuccessAlert(
            "¡Orden Eliminada!",
            `La orden ${order?.order_number} ha sido eliminada correctamente.`,
          );
          navigate("/admin/orders");
        }
      } catch (error) {
        console.error("Error eliminando orden:", error);
        await showErrorAlert(
          "Error",
          error.message || "No se pudo eliminar la orden",
        );
      }
    }
  };

  // Formatear fecha
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";

    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("es-MX");
    } catch {
      return dateString;
    }
  };

  // Cargando
  if (loading) {
    return (
      <AdminLayout>
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ff8c00] mx-auto"></div>
            <p className="text-[#6B4E2E] mt-4">Cargando orden...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (!order) {
    return (
      <AdminLayout>
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-12">
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
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <p className="text-[#B08968] font-light">Orden no encontrada</p>
            <Link
              to="/admin/orders"
              className="mt-4 inline-block text-sm text-[#ff8c00] hover:text-[#e67e00] transition-colors duration-200"
            >
              ← Volver a órdenes
            </Link>
          </div>
        </div>
      </AdminLayout>
    );
  }

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
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 19l-7-7m0 0l7-7m-7 7h18"
                    />
                  </svg>
                </Link>
                <h1 className="text-2xl font-light tracking-wider text-[#6B4E2E]">
                  Orden #{order.order_number}
                </h1>
              </div>
              <p className="text-sm text-[#B08968] font-light">
                Cliente: {order.client_name} • Fecha:{" "}
                {formatDate(order.received_date)} • Prioridad:{" "}
                {order.priority_name || order.priority_id}
              </p>
            </div>
            <div className="flex space-x-3">
              {isEditing ? (
                <>
                  <button
                    onClick={handleCancelEdit}
                    className="px-4 py-2 border border-[#e8e2d9] text-sm font-light text-[#6B4E2E] hover:bg-[#faf8f5] transition-colors duration-200"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleSaveChanges}
                    className="px-4 py-2 bg-[#ff8c00] text-white font-light hover:bg-[#e67e00] transition-colors duration-200"
                  >
                    Guardar
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleDeleteOrder}
                    className="px-4 py-2 border border-red-200 text-sm font-light text-red-600 hover:bg-red-50 transition-colors duration-200"
                  >
                    Eliminar
                  </button>
                  <button
                    onClick={handleEditClick}
                    className="px-4 py-2 bg-[#ff8c00] text-white font-light hover:bg-[#e67e00] transition-colors duration-200"
                  >
                    Editar Orden
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="space-y-6">
            <div className="bg-white p-6 border border-[#e8e2d9]">
              <h2 className="font-light text-lg text-[#6B4E2E] mb-4">
                Estado y Prioridad
              </h2>

              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm text-[#B08968] font-light">
                    Estado Actual
                  </p>
                  <div className="relative w-48">
                    <select
                      value={order.status_id}
                      onChange={(e) => handleStatusChange(e.target.value)}
                      className="w-full px-3 py-2 border border-[#e8e2d9] text-sm font-light text-[#6B4E2E] focus:outline-none appearance-none pr-8"
                    >
                      {masterData.statuses.map((status) => (
                        <option key={status.id} value={status.id}>
                          {status.name}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-[#B08968]"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
                <span
                  className={`inline-flex items-center px-3 py-1 text-sm font-light ${statusColors[order.status_name] || "bg-gray-100 text-gray-800"}`}
                >
                  {order.status_name || "Sin estado"}
                </span>
              </div>

              {/* Prioridad */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm text-[#B08968] font-light">Prioridad</p>
                  <div className="relative w-48">
                    <select
                      value={order.priority_id}
                      onChange={(e) => handlePriorityChange(e.target.value)}
                      className="w-full px-3 py-2 border border-[#e8e2d9] text-sm font-light text-[#6B4E2E] focus:outline-none appearance-none pr-8"
                    >
                      {masterData.priorities.map((priority) => (
                        <option key={priority.id} value={priority.id}>
                          {priority.name}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-[#B08968]"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
                <span
                  className={`inline-block px-3 py-1 text-xs font-medium ${
                    priorityColors[order.priority_name] ||
                    "bg-gray-50 text-gray-600 border border-gray-200"
                  }`}
                >
                  {order.priority_name || order.priority_id || "N/A"}
                </span>
              </div>

              {/* Línea de tiempo de estados */}
              <div className="pt-6 border-t border-[#e8e2d9]">
                <h3 className="text-sm font-medium text-[#6B4E2E] mb-4">
                  Progreso del Servicio
                </h3>
                <div className="space-y-4">
                  {masterData.statuses.map((status) => (
                    <div key={status.id} className="flex items-start space-x-3">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center ${
                          order.status_id === status.id
                            ? "bg-[#ff8c00]"
                            : order.status_id > status.id
                              ? "bg-green-500"
                              : "bg-gray-200"
                        }`}
                      >
                        {order.status_id === status.id && (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-3 w-3 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={3}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        )}
                        {order.status_id > status.id && (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-3 w-3 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={3}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        )}
                      </div>
                      <div className="flex-1">
                        <p
                          className={`text-sm font-light ${
                            order.status_id === status.id
                              ? "text-[#ff8c00]"
                              : order.status_id > status.id
                                ? "text-green-600"
                                : "text-[#6B4E2E]"
                          }`}
                        >
                          {status.name}
                        </p>
                        {order.status_id === status.id && notes[0] && (
                          <p className="text-xs text-[#ff8c00] mt-1 italic">
                            {notes[0].description?.substring(0, 50)}...
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {/* Información del cliente */}
            <div className="bg-white p-6 border border-[#e8e2d9]">
              <h2 className="font-light text-lg text-[#6B4E2E] mb-4">
                Información del Cliente
              </h2>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-[#B08968] font-light">
                    Nombre del Cliente
                  </p>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.client_name}
                      required
                      onChange={(e) =>
                        handleEditChange("client_name", e.target.value)
                      }
                      className={`w-full px-3 py-2 border border-[#e8e2d9] rounded text-sm mt-1 ${
                        errors.client_name ? "border-red-500" : ""
                      }`}
                    />
                  ) : (
                    <p className="text-sm text-[#6B4E2E] mt-1">
                      {order.client_name}
                    </p>
                  )}
                </div>
                <div>
                  {errors.client_phone && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.client_phone}
                    </p>
                  )}

                  <p className="text-xs text-[#B08968] font-light">Teléfono</p>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.client_phone}
                      required
                      onChange={(e) =>
                        handleEditChange("client_phone", e.target.value)
                      }
                      className={`w-full px-3 py-2 border border-[#e8e2d9] rounded text-sm mt-1 ${errors.client_phone ? "border-red-500" : ""}`}
                    />
                  ) : (
                    <p className="text-sm text-[#6B4E2E] mt-1">
                      {order.client_phone || "N/A"}
                    </p>
                  )}
                </div>
                <div>
                  {errors.client_email && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.client_email}
                    </p>
                  )}
                  <p className="text-xs text-[#B08968] font-light">
                    Correo Electrónico
                  </p>
                  {isEditing ? (
                    <input
                      type="email"
                      value={editData.client_email}
                      onChange={(e) =>
                        handleEditChange("client_email", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-[#e8e2d9] rounded text-sm mt-1"
                    />
                  ) : (
                    <p className="text-sm text-[#6B4E2E] mt-1">
                      {order.client_email || "N/A"}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Columna central - Detalles, Archivos y Bitácora */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Detalles de la pieza */}
            <div className="bg-white p-6 border border-[#e8e2d9]">
              <h2 className="font-light text-lg text-[#6B4E2E] mb-4">
                Detalles de la Pieza
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-[#B08968] font-light">
                    Tipo de Pieza
                  </p>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.device_type}
                      onChange={(e) =>
                        handleEditChange("device_type", e.target.value)
                      }
                      className={`w-full px-3 py-2 border border-[#e8e2d9] rounded text-sm mt-1 ${errors.device_type ? "border-red-500" : ""}`}
                    />
                  ) : (
                    <p className="text-sm text-[#6B4E2E] mt-1">
                      {order.device_type}
                    </p>
                  )}
                </div>
                <div>
                  <p className="text-xs text-[#B08968] font-light">Marca</p>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.device_brand}
                      onChange={(e) =>
                        handleEditChange("device_brand", e.target.value)
                      }
                      className={`w-full px-3 py-2 border border-[#e8e2d9] rounded text-sm mt-1 ${errors.device_brand ? "border-red-500" : ""}`}
                    />
                  ) : (
                    <p className="text-sm text-[#6B4E2E] mt-1">
                      {order.device_brand || "N/A"}
                    </p>
                  )}
                </div>
                <div>
                  <p className="text-xs text-[#B08968] font-light">Modelo</p>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.device_model}
                      onChange={(e) =>
                        handleEditChange("device_model", e.target.value)
                      }
                      className={`w-full px-3 py-2 border border-[#e8e2d9] rounded text-sm mt-1 ${errors.device_model ? "border-red-500" : ""}`}
                    />
                  ) : (
                    <p className="text-sm text-[#6B4E2E] mt-1">
                      {order.device_model || "N/A"}
                    </p>
                  )}
                </div>
                <div>
                  <p className="text-xs text-[#B08968] font-light">
                    Número de Serie
                  </p>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.serial_number}
                      required
                      onChange={(e) =>
                        handleEditChange("serial_number", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-[#e8e2d9] rounded text-sm mt-1"
                    />
                  ) : (
                    <p className="text-sm text-[#6B4E2E] mt-1">
                      {order.serial_number || "N/A"}
                    </p>
                  )}
                </div>
                <div>
                  <p className="text-xs text-[#B08968] font-light">
                    Fecha Recepción
                  </p>
                  <p className="text-sm text-[#6B4E2E] mt-1">
                    {formatDate(order.received_date)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[#B08968] font-light">
                    Estimado Entrega
                  </p>
                  {isEditing ? (
                    <input
                      type="date"
                      value={editData.estimated_delivery || ""}
                      onChange={(e) =>
                        handleEditChange("estimated_delivery", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-[#e8e2d9] rounded text-sm mt-1"
                    />
                  ) : (
                    <p className="text-sm text-[#6B4E2E] mt-1">
                      {order.estimated_delivery
                        ? formatDate(order.estimated_delivery)
                        : "No definido"}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* --- SECCIÓN DE ARCHIVOS ADJUNTOS --- */}
            <div className="bg-white p-6 border border-[#e8e2d9]">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-light text-lg text-[#6B4E2E]">
                  Archivos Adjuntos ({files.length})
                </h2>
                <div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer px-4 py-2 border border-[#ff8c00] text-[#ff8c00] text-sm font-light hover:bg-[#fff5e6] transition-colors duration-200 flex items-center space-x-2"
                  >
                    {isUploading ? (
                      <span className="animate-spin h-4 w-4 border-2 border-[#ff8c00] border-t-transparent rounded-full"></span>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                      </svg>
                    )}
                    <span>{isUploading ? "Subiendo..." : "Adjuntar Archivo"}</span>
                  </label>
                </div>
              </div>

              {files.length > 0 ? (
                <div className="space-y-3">
                  {files.map((file) => (
                    <div key={file.id} className="flex justify-between items-center p-3 border border-[#e8e2d9] bg-[#faf8f5] hover:bg-white transition-colors duration-200">
                      <div className="flex items-center space-x-3 overflow-hidden">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#B08968] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span className="text-sm text-[#6B4E2E] truncate font-light" title={file.file_name}>
                          {file.file_name}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 flex-shrink-0">
                        {/* Botón Descargar */}
                        <a
                          href={file.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          download={file.file_name}
                          className="text-[#6B4E2E] hover:text-[#ff8c00] transition-colors duration-200 p-1"
                          title="Descargar o Ver"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                        </a>
                        {/* Botón Eliminar */}
                        <button
                          onClick={() => handleDeleteFile(file.id)}
                          className="text-[#B08968] hover:text-red-600 transition-colors duration-200 p-1"
                          title="Eliminar archivo"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-[#B08968] font-light italic text-center py-4 bg-[#faf8f5] border border-[#e8e2d9] rounded">
                  Aún no hay archivos adjuntos en esta orden.
                </p>
              )}
            </div>
            {/* -------------------------------------- */}

            {/* Bitácora */}
            <div className="bg-white p-6 border border-[#e8e2d9]">
              <h2 className="font-light text-lg text-[#6B4E2E] mb-4">
                Bitácora ({notes.length} notas)
              </h2>

              {/* Formulario para agregar nota */}
              <div className="mb-6">
                <div className="flex space-x-4">
                  <div className="flex-1">
                    <textarea
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      placeholder="Agregar nueva nota..."
                      rows="2"
                      className="w-full px-4 py-3 border border-[#e8e2d9] text-sm focus:border-[#6B4E2E] focus:outline-none transition-colors duration-200"
                    />
                  </div>
                  <div>
                    <button
                      onClick={handleAddNote}
                      className="h-full px-6 bg-[#ff8c00] text-white font-light hover:bg-[#e67e00] transition-colors duration-200 whitespace-nowrap"
                    >
                      Agregar Nota
                    </button>
                  </div>
                </div>
              </div>

              {/* Lista de notas */}
              <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                {notes.map((note) => (
                  <div
                    key={note.id}
                    className="border-l-2 border-[#ff8c00] pl-4 py-3"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center space-x-3">
                          <span className="text-xs text-[#B08968] font-light bg-[#faf8f5] px-2 py-1">
                            {note.fecha_formateada ||
                              formatDate(note.created_at)}
                          </span>
                        </div>
                        <p className="text-sm text-[#6B4E2E] font-light mt-2">
                          {note.description}
                        </p>
                      </div>
                      <button
                        onClick={() => handleDeleteNote(note.id)}
                        className="text-[#B08968] hover:text-red-600 transition-colors duration-200 p-1"
                        title="Eliminar nota"
                      >
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
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}

                {notes.length === 0 && (
                  <div className="text-center py-8">
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
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    <p className="text-[#B08968] font-light">
                      No hay notas en la bitácora
                    </p>
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