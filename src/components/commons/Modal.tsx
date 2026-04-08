"use client";

import { ComponentProps, createContext, useContext, useState, useEffect, ReactNode } from "react";
import { cn } from "@/libs/utils";
import { X } from "lucide-react";

interface ModalContextType {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

function useModal() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
}

interface ModalProps {
  children: ReactNode;
}

export function Modal({ children }: ModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);
  const toggle = () => setIsOpen((prev) => !prev);

  return (
    <ModalContext.Provider value={{ isOpen, open, close, toggle }}>
      {children}
    </ModalContext.Provider>
  );
}

interface ModalTriggerProps extends ComponentProps<"button"> {
  asChild?: boolean;
}

export function ModalTrigger({ children, onClick, ...props }: ModalTriggerProps) {
  const { toggle } = useModal();
  return (
    <button
      onClick={(e) => {
        toggle();
        onClick?.(e);
      }}
      {...props}
    >
      {children}
    </button>
  );
}

interface ModalContentProps extends ComponentProps<"div"> {}

export function ModalContent({ children, className, ...props }: ModalContentProps) {
  const { isOpen, close } = useModal();
  const [mounted, setMounted] = useState(false);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setMounted(true);
      // 브라우저가 DOM을 그릴 시간을 준 후 애니메이션 상태값 변화
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setShow(true));
      });
    } else {
      setShow(false);
    }
  }, [isOpen]);

  const handleTransitionEnd = () => {
    if (!isOpen) {
      setMounted(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className={cn(
          "bg-surface/80 absolute inset-0 backdrop-blur-sm transition-opacity duration-300 ease-in-out",
          show ? "opacity-100" : "opacity-0"
        )}
        onClick={close}
      />
      {/* Dialog */}
      <div
        onTransitionEnd={handleTransitionEnd}
        className={cn(
          "bg-surface-container-high relative z-10 w-full max-w-lg rounded-xl p-6 shadow-[0_0_48px_rgba(0,0,0,0.4)] transition-all duration-300 ease-out",
          show ? "translate-y-0 scale-100 opacity-100" : "translate-y-4 scale-95 opacity-0",
          className
        )}
        {...props}
      >
        {children}
      </div>
    </div>
  );
}

interface ModalHeaderProps extends ComponentProps<"div"> {}

function ModalHeader({ children, className, ...props }: ModalHeaderProps) {
  const { close } = useModal();
  return (
    <div className={cn("mb-6 flex items-center justify-between", className)} {...props}>
      <h2 className="font-display text-on-surface text-xl font-bold tracking-tight">{children}</h2>
      <button
        onClick={close}
        className="text-on-surface-variant hover:bg-surface-variant hover:text-on-surface rounded-full p-2 transition-colors"
      >
        <X className="h-5 w-5" />
      </button>
    </div>
  );
}

Modal.Trigger = ModalTrigger;
Modal.Content = ModalContent;
Modal.Header = ModalHeader;
