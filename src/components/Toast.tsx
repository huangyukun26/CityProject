import React, { createContext, useCallback, useContext, useState } from "react";
import { nanoid } from "nanoid";

interface ToastMessage {
  id: string;
  text: string;
  type: "success" | "error" | "info";
}

interface ToastContextValue {
  notify: (text: string, type?: ToastMessage["type"]) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const [messages, setMessages] = useState<ToastMessage[]>([]);

  const notify = useCallback((text: string, type: ToastMessage["type"] = "info") => {
    const id = nanoid();
    setMessages((prev) => [...prev, { id, text, type }]);
    setTimeout(() => {
      setMessages((prev) => prev.filter((item) => item.id !== id));
    }, 3000);
  }, []);

  return (
    <ToastContext.Provider value={{ notify }}>
      {children}
      <div className="fixed right-4 top-4 z-50 space-y-2">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`rounded px-4 py-2 text-sm shadow-lg text-white ${
              message.type === "success"
                ? "bg-emerald-500"
                : message.type === "error"
                ? "bg-rose-500"
                : "bg-slate-700"
            }`}
          >
            {message.text}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
};
