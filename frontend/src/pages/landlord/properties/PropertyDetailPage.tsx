import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
// import { apiClient } from "../../../api/axios";
import { ArrowLeft, Edit3, Home, Users, Key, Wrench, TrendingUp } from 'lucide-react';
import type { PropertyProps } from "./core/types";
import { useController } from "./core/requests";
import { ROUTES } from "../../../constants/routes";
import type { UnitProps } from "../units/core/type";
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import Button from "../../../components/common/Button";
import { useModal } from "../../../components/common/modal/ModalProvider";
import CreateUnitForm from "./components/forms/CreateUnitForm";
import CreatePropertyForm from "./components/forms/CreatePropertyForm";

const unitStatusStyle: Record<string, string> = {
    OCCUPIED:          'bg-green-200 text-green-600 border-green-300',
    VACANT:            'bg-gray-200 text-gray-600 border-gray-300',
    UNDER_MAINTENANCE: 'bg-red-200 text-red-600 border-red-300',
}

const unitHeader = ["Unit", "Rent", "Status", "Tenant", "Actions"];

const PropertyDetailPage = () => {

    const { id:property_id } = useParams();
    const navigate = useNavigate();
    const {showModal, closeModal} = useModal();

    const controller = useController();
    const [data, setData]= useState<PropertyProps|null>(null);

    const fetchPropertyDetails = async () => {
        if (!property_id) return;
        const res = await controller.viewProperty(property_id);
        setData(res.data);
    };
    
    useEffect(()=>{
        fetchPropertyDetails()
    },[property_id])

    if(!data || !property_id) return;

    const handleCreateUnit = () => {
        showModal({
            title:'New Unit',
            size:'xl',
            body:<CreateUnitForm
                property_id={property_id}
                onSuccess={() => {
                    fetchPropertyDetails()
                    closeModal()
                }}
            />,
            loading:false
        })
    }

    const handleUpdateProperty = () => {
        showModal({
            title:'Edit Property Detail',
            size:'xl',
            body:<CreatePropertyForm
                data={data}
                onSuccess={() => {
                    fetchPropertyDetails()
                    closeModal()
                }}
            />,
            loading:false
        })
    }

    const handleViewUnit = (id:string) => {
        
    }
    
    const stats = [
        { label: 'Total Units',  value: data.units_count,             color: 'text-gray-900',   icon: <Home  className="w-4 h-4" /> },
        { label: 'Occupied',     value: data.occupied_count,          color: 'text-green-600',  icon: <Users className="w-4 h-4" /> },
        { label: 'Vacant',       value: data.vacant_count,            color: 'text-orange-500', icon: <Key className="w-4 h-4" /> },
        { label: 'Maintenance',  value: data.under_maintenance_count, color: 'text-red-500',    icon: <Wrench className="w-4 h-4" /> },
    ]

    const details = [
        { label: "Property Manager", value: data.landlord?.name },
        { label: "Description", value: data.description ?? "—" },
    ];

    const occupancyRate = data.units_count > 0? Math.round((data.occupied_count / data.units_count) * 100): 0

    return (
        <div className="max-w-5xl mx-auto p-6 min-h-screen">
            <div className="bg-white mb-5 rounded-xl">
                {/* Header */}
                <div className=" backdrop-blur-md border-b border-gray-100 rounded-xl">
                    <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
                        <button
                        onClick={() => navigate(ROUTES.LANDLORD.PROPERTIES)}
                        className="flex items-center text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors"
                        >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Properties
                        </button>
                        <Button 
                            className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all"
                            onClick={handleUpdateProperty}
                        >
                        <Edit3 className="w-4 h-4 mr-2" /> Edit Details
                        </Button>
                    </div>
                </div>

                <div className="max-w-6xl mx-auto px-6 py-8">
                    {/* Photo Gallery */}
                    {data.photos?.length > 0 ? (
                        <Swiper
                            modules={[Navigation, Pagination]}
                            navigation
                            pagination={{ clickable: true }}
                            className="w-full h-[400px] rounded-xl mb-8"
                        >
                            {data.photos.map((photo, index) => (
                                <SwiperSlide key={index}>
                                    <img
                                        src={`${import.meta.env.VITE_STORAGE_URL}/${photo}`}
                                        alt={`${data.name} photo ${index + 1}`}
                                        className="w-full h-full object-cover"
                                    />
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    ) : (
                        // Correct — give it the same height as the swiper
                        <div className="w-full h-[400px] bg-gray-50 rounded-xl border border-gray-100 
                            flex flex-col items-center justify-center mb-8">
                            <Home className="w-12 h-12 text-gray-200 mx-auto mb-2" />
                            <p className="text-gray-400 font-medium">No photos available</p>
                        </div>
                    )}

                    {/* Info + Stats */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        {/* Property Info */}
                        <div className="lg:col-span-2">
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                            {data.name}
                            </h1>
                            <span
                                className={`px-3 py-1 text-xs font-bold rounded-full border uppercase tracking-wider
                                ${
                                    data.is_active
                                    ? "bg-green-50 text-green-600 border-green-100"
                                    : "bg-red-50 text-red-500 border-red-100"
                                }`}
                            >
                            {data.is_active ? "Active" : "Inactive"}
                            </span>
                        </div>
                        <p className="text-gray-500 text-lg mb-8">
                            {data.address}, {data.city}
                        </p>

                        <div className="grid grid-cols-1 gap-y-6 border-t border-gray-100 pt-8">
                            {details.map((item) => (
                            <div key={item.label}>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
                                {item.label}
                                </p>
                                <p className="text-gray-900 font-medium">{item.value}</p>
                            </div>
                            ))}
                        </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="bg-gray-50 rounded-xl p-8 border border-gray-100 shadow-sm">
                        <div className="flex items-center gap-2 mb-6">
                            <TrendingUp className="w-5 h-5 text-blue-600" />
                            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-widest">
                            Quick Stats
                            </h2>
                        </div>
                        <div className="space-y-4">
                            {stats.map((stat) => (
                            <div
                                key={stat.label}
                                className="flex justify-between items-center text-sm"
                            >
                                <div className="flex items-center gap-2 text-gray-500 font-medium">
                                {stat.icon}
                                {stat.label}
                                </div>
                                <span className={`font-bold ${stat.color}`}>
                                {stat.value}
                                </span>
                            </div>
                            ))}
                            {/* Occupancy Rate */}
                            <div className="pt-4 mt-4 border-t border-gray-200">
                            <div className="flex justify-between items-end">
                                <span className="text-sm text-gray-500">
                                Occupancy Rate
                                </span>
                                <span className="text-2xl font-black text-blue-600">
                                {occupancyRate}%
                                </span>
                            </div>
                            <div className="w-full bg-gray-200 h-1.5 rounded-full mt-2">
                                <div
                                className="bg-blue-600 h-1.5 rounded-full transition-all"
                                style={{ width: `${occupancyRate}%` }}
                                />
                            </div>
                            </div>
                        </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Units Table */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                {/* Header */}
                <div className="px-8 py-5 flex items-center justify-between border-b border-gray-100">
                    <h2 className="text-base font-bold text-gray-800">Units</h2>
                    <Button variant="primary" onClick={() => handleCreateUnit()}>
                        + Add Unit
                    </Button>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                                {unitHeader.map((col) => (
                                    <th
                                        key={col}
                                        className="px-8 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest"
                                    >
                                        {col}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {data.units?.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="px-8 py-10 text-center text-gray-400 text-sm"
                                    >
                                        No units found
                                    </td>
                                </tr>
                            ) : (
                                data.units.map((unit: UnitProps) => (
                                    <tr
                                        key={unit.id}
                                        className="hover:bg-gray-50/50 transition-colors"
                                    >
                                        {/* Unit number */}
                                        <td className="px-8 py-4">
                                            <p className="text-sm font-bold text-gray-800">
                                                {unit.unit_number}
                                            </p>
                                            {unit.floor_area && (
                                                <p className="text-xs text-gray-400 mt-0.5">
                                                    {unit.floor_area} sqm
                                                </p>
                                            )}
                                        </td>

                                        {/* Rent */}
                                        <td className="px-8 py-4 text-sm font-bold text-gray-900">
                                            ₱{Number(unit.rent_price).toLocaleString('en-PH', {
                                                minimumFractionDigits: 2
                                            })}
                                            <span className="text-xs font-medium text-gray-400 ml-1">/mo</span>
                                        </td>

                                        {/* Status */}
                                        <td className="px-8 py-4">
                                            <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold border uppercase tracking-wider
                                                ${unitStatusStyle[unit.status] ?? 'bg-gray-50 text-gray-500 border-gray-100'}`}>
                                                {unit.status.replace('_', ' ')}
                                            </span>
                                        </td>

                                        {/* Tenant */}
                                        <td className="px-8 py-4">
                                            {unit.leases?.[0]?.tenant?.name ? (
                                                <div className="flex items-center gap-2">
                                                    <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">
                                                        {unit.leases[0].tenant.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <span className="text-sm font-medium text-gray-700">
                                                        {unit.leases[0].tenant.name}
                                                    </span>
                                                </div>
                                            ) : (
                                                <span className="text-sm text-gray-400">—</span>
                                            )}
                                        </td>

                                        {/* Actions */}
                                        <td className="px-8 py-4">
                                            <button
                                                onClick={() => handleViewUnit(unit.id)}
                                                className="px-3 py-1.5 text-xs font-medium text-blue-600
                                                    bg-blue-50 hover:bg-blue-100 rounded-lg transition"
                                            >
                                                View Details
                                            </button>
                                        </td>

                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}


export default PropertyDetailPage;