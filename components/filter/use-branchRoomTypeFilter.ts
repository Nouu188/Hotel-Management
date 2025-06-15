// src/hooks/useRoomTypeFilter.ts
"use client";

import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { api } from '@/lib/api';
import { AppDispatch, RootState } from '@/store/store';
import { addSelectedHotelRoomTypes } from '@/store/slices/selectedHotelRoomTypesSlice';
import { HotelBranchRoomTypeItem, HotelBranchRoomTypeItemWithStatus } from '@/types/roomType';
import { ActionResponseForArray } from '@/types/global';
import { calculateNights } from '../bill/BillSearchingSection';

export interface EnrichedHotelBranchRoomTypeItem extends HotelBranchRoomTypeItemWithStatus {
  countSelected: number;
  isFullySelected: boolean;
}

export const useRoomTypeFilter = () => {
  const [roomTypes, setRoomTypes] = useState<HotelBranchRoomTypeItemWithStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const dispatch: AppDispatch = useDispatch();
  const selectedHotelRoomTypes = useSelector((state: RootState) => state.selectedHotelRoomTypes.selectedInstances);
  const dateRange = useSelector((state: RootState) => state.filterHotelRoomType.dateRange);

  const branch = searchParams.get('branch');
  const fromDate = searchParams.get("fromDate");
  const toDate = searchParams.get("toDate");

  useEffect(() => {
    setLoading(true);
    setError(null);

    const items: { adults: number; children: number; infants: number }[] = [];
    for (const [key, value] of searchParams.entries()) {
      const match = key.match(/^items\[(\d+)]\[(\w+)]$/);
      if (match) {
        const index = parseInt(match[1]);
        const field = match[2] as keyof typeof items[number];
        if (!items[index]) items[index] = { adults: 0, children: 0, infants: 0 };
        items[index][field] = Number(value) || 0;
      }
    }

    if (!branch || items.length === 0 || !dateRange?.from || !dateRange?.to) {
      setRoomTypes([]);
      setLoading(false);
      return;
    }

    const fetchRooms = async () => {
      try {
        const res = await api.roomsType.getByFilter(branch, items, dateRange) as ActionResponseForArray<HotelBranchRoomTypeItemWithStatus>;
        if (res.success && res.data) {
          setRoomTypes(res.data);
        } else {
          setError("API call failed or returned no data.");
          setRoomTypes([]);
        }
      } catch (err: any) {
        console.error("Error fetching rooms:", err);
        setError("Error fetching rooms: " + err.message);
        setRoomTypes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, [searchParams, dateRange]);

  const numberOfNights = fromDate && toDate ? calculateNights(fromDate, toDate) : 0;

  const handleAddSelectedHotelRoomTypes = (value: HotelBranchRoomTypeItem) => {
    dispatch(addSelectedHotelRoomTypes(value));
  };
  
  const handleOnSelect = (roomId: string): boolean => {
    return selectedHotelRoomTypes.some(item => item.originalRoomData.id === roomId);
  };

  const enrichedRoomTypes: EnrichedHotelBranchRoomTypeItem[] = useMemo(() => {
    return roomTypes.map(item => {
      const countSelected = selectedHotelRoomTypes.filter(selectedRoomType => selectedRoomType.originalRoomData.id === item.id).length;
      const isFullySelected = item.remainingQuantity > 0 && countSelected >= item.remainingQuantity;
      return {
        ...item,
        countSelected,
        isFullySelected,
      };
    });
  }, [roomTypes, selectedHotelRoomTypes]);

  return {
    roomTypes: enrichedRoomTypes,
    loading,
    fromDate, 
    toDate,
    error,
    selectedHotelRoomTypes,
    numberOfNights,
    handleOnSelect,
    handleAddSelectedHotelRoomTypes
  };
};