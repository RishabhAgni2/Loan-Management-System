import { ReactNode } from 'react';
import Button from './Button';

interface ModalProps {
  title: string;
  children: ReactNode;
  open: boolean;
  onClose: () => void;
}

export default function Modal({ title, children, open, onClose }: ModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl">
        <div className="mb-4 flex items-center justify-between gap-4">
          <h3 className="text-lg font-bold text-gray-800">{title}</h3>
          <Button variant="ghost" className="h-8 w-8 p-0" onClick={onClose} aria-label="Close modal">
            x
          </Button>
        </div>
        {children}
      </div>
    </div>
  );
}
