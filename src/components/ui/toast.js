"use client";

import { useState } from "react";

let toastSetter = null;

export function ToastContainer() {
  const [toast, setToast] = useState(null);
  toastSetter = setToast;
  if (!toast) return null;
  return (
    <div className="fixed top-8 right-8 z-[100]">
      <div className="bg-black text-white px-6 py-3 rounded-full shadow-md text-lg font-medium dark:bg-white dark:text-black">
        {toast}
      </div>
    </div>
  );
}
export function showToast(message, duration = 2200) {
  if (toastSetter) {
    toastSetter(message);
    setTimeout(() => toastSetter(null), duration);
  }
}
