"use client";

import { create } from "zustand";

type BookingFormUiState = {
  isDirty: boolean;
  isSubmitting: boolean;
  markDirty: () => void;
  reset: () => void;
  setSubmitting: (isSubmitting: boolean) => void;
};

export const useBookingFormUi = create<BookingFormUiState>()((set) => ({
  isDirty: false,
  isSubmitting: false,
  markDirty: () => set({ isDirty: true }),
  reset: () => set({ isDirty: false, isSubmitting: false }),
  setSubmitting: (isSubmitting) => set({ isSubmitting }),
}));
