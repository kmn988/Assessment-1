import React, { useEffect } from "react";
import ReactDOM from "react-dom";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}
const Modal = ({ isOpen, onClose, children }: ModalProps) => {
  useEffect(() => {
    const closeOnEscapeKey = (e: KeyboardEvent) =>
      e.key === "Escape" ? onClose() : null;
    document.body.addEventListener("keydown", closeOnEscapeKey);
    return () => {
      document.body.removeEventListener("keydown", closeOnEscapeKey);
    };
  }, [onClose]); //

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div
      className="absolute z-100 inset-0 flex items-center justify-center bg-black/50 rounded-xl "
      style={{ animation: "fadeIn 0.5s ease" }}
      onClick={onClose}
    >
      <div
        className="bg-black rounded-xl w-100 max-w-[90%] shadow-xl overflow-hidden p-4"
        style={{ animation: "slideUp 0.18s cubic-bezier(0.4,0,0.2,1)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>,
    document.body,
  );
};

export default Modal;
