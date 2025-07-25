import React from "react";

export function Dialog({ open, onOpenChange, children }) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
      onClick={() => onOpenChange(false)}
    >
      <div
        className="bg-white rounded shadow p-4 min-w-[300px]"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}

export function DialogContent({ children }) {
  return <div>{children}</div>;
}
export function DialogHeader({ children }) {
  return <div className="mb-2 font-bold">{children}</div>;
}
export function DialogTitle({ children }) {
  return <h3 className="text-lg">{children}</h3>;
}
