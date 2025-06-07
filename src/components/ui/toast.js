"use client";

import { useState, useCallback } from "react";

let toastSetter = null;

export function ToastContainer() {
  const [toast, setToast] = useState(null);
  toastSetter = setToast;

  if (!toast) return null;

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="bg-black text-white px-4 py-2 rounded shadow-lg animate-fadein">
        {toast}
      </div>
    </div>
  );
}

export function showToast(message, duration = 2500) {
  if (toastSetter) {
    toastSetter(message);
    setTimeout(() => toastSetter(null), duration);
  }
}
