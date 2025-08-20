import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useState, useRef } from 'react';
import { Inertia } from '@inertiajs/inertia';

export default function Manage({ data = [], flash }) {
    const [items, setItems] = useState(data);
    const [showModal, setShowModal] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: ''
    });
    const [importing, setImporting] = useState(false);
    const fileInputRef = useRef();

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Open modal for create/edit
    const openModal = (item = null) => {
        if (item) {
            setEditingItem(item);
            setFormData({
                name: item.name || '',
                email: item.email || '',
                phone: item.phone || '',
                address: item.address || ''
            });
        } else {
            setEditingItem(null);
            setFormData({
                name: '',
                email: '',
                phone: '',
                address: ''
            });
        }
        setShowModal(true);
    };

    // Close modal
    const closeModal = () => {
        setShowModal(false);
        setEditingItem(null);
        setFormData({
            name: '',
            email: '',
            phone: '',
            address: ''
        });
    };

    // Handle form submit
    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (editingItem) {
            // Update existing item
            const updatedItems = items.map(item => 
                item.id === editingItem.id 
                    ? { ...item, ...formData }
                    : item
            );
            setItems(updatedItems);
            
            // In real app, you would make API call here
            // Inertia.put(`/manage/${editingItem.id}`, formData);
        } else {
            // Create new item
            const newItem = {
                id: Date.now(), // In real app, this would come from backend
                ...formData,
                created_at: new Date().toISOString()
            };
            setItems([...items, newItem]);
            
            // In real app, you would make API call here
            // Inertia.post('/manage', formData);
        }
        
        closeModal();
    };

    // Handle delete
    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this item?')) {
            setItems(items.filter(item => item.id !== id));
            
            // In real app, you would make API call here
            // Inertia.delete(`/manage/${id}`);
        }
    };

    // Handle CSV import
    const handleImport = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setImporting(true);
        
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const csv = event.target.result;
                const lines = csv.split('\n');
                const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
                
                const importedData = [];
                for (let i = 1; i < lines.length; i++) {
                    if (lines[i].trim()) {
                        const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
                        const item = {
                            id: Date.now() + i,
                            name: values[0] || '',
                            email: values[1] || '',
                            phone: values[2] || '',
                            address: values[3] || '',
                            created_at: new Date().toISOString()
                        };
                        importedData.push(item);
                    }
                }
                
                setItems([...items, ...importedData]);
                alert(`Successfully imported ${importedData.length} records`);
                
                // In real app, you would send to backend
                // Inertia.post('/manage/import', { data: importedData });
                
            } catch (error) {
                alert('Error importing CSV file');
                console.error(error);
            } finally {
                setImporting(false);
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
            }
        };
        
        reader.readAsText(file);
    };

    // Handle CSV export
    const handleExport = () => {
        if (items.length === 0) {
            alert('No data to export');
            return;
        }

        const headers = ['Name', 'Email', 'Phone', 'Address'];
        const csvContent = [
            headers.join(','),
            ...items.map(item => [
                `"${item.name || ''}"`,
                `"${item.email || ''}"`,
                `"${item.phone || ''}"`,
                `"${item.address || ''}"`
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `manage_data_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Manage Data
                </h2>
            }
        >
            <Head title="Manage Data" />
            
            <div className="m-4">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Flash Messages */}
                    {flash?.success && (
                        <div className="mb-4 rounded-md bg-green-50 p-4">
                            <div className="text-sm font-medium text-green-800">
                                {flash.success}
                            </div>
                        </div>
                    )}
                    
                    {flash?.error && (
                        <div className="mb-4 rounded-md bg-red-50 p-4">
                            <div className="text-sm font-medium text-red-800">
                                {flash.error}
                            </div>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="mb-6 flex flex-wrap gap-4">
                        <button
                            onClick={() => openModal()}
                            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            Add New Item
                        </button>
                        
                        <div className="flex gap-2">
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept=".csv"
                                onChange={handleImport}
                                className="hidden"
                            />
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                disabled={importing}
                                className="rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
                            >
                                {importing ? 'Importing...' : 'Import CSV'}
                            </button>
                            
                            <button
                                onClick={handleExport}
                                className="rounded-md bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
                            >
                                Export CSV
                            </button>
                        </div>
                    </div>

                    {/* Data Table */}
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            {items.length === 0 ? (
                                <div className="text-center py-8">
                                    <p className="text-gray-500">No data available. Add some items or import a CSV file.</p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Name
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Email
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Phone
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Address
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {items.map((item) => (
                                                <tr key={item.id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                        {item.name}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {item.email}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {item.phone}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {item.address}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                                        <button
                                                            onClick={() => openModal(item)}
                                                            className="text-blue-600 hover:text-blue-900"
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(item.id)}
                                                            className="text-red-600 hover:text-red-900"
                                                        >
                                                            Delete
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal for Create/Edit */}
            {showModal && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex min-h-screen items-center justify-center p-4">
                        <div className="fixed inset-0 bg-black opacity-30" onClick={closeModal}></div>
                        <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full">
                            <div className="p-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">
                                    {editingItem ? 'Edit Item' : 'Add New Item'}
                                </h3>
                                
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Name
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            required
                                        />
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        />
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Phone
                                        </label>
                                        <input
                                            type="text"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        />
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Address
                                        </label>
                                        <textarea
                                            name="address"
                                            value={formData.address}
                                            onChange={handleInputChange}
                                            rows={3}
                                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        />
                                    </div>
                                    
                                    <div className="flex justify-end space-x-3 pt-4">
                                        <button
                                            type="button"
                                            onClick={closeModal}
                                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            {editingItem ? 'Update' : 'Create'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}