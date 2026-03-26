import React, { useState, useCallback } from 'react';
import { ConfirmDialog } from '../components/ConfirmDialog';

interface DialogState {
  message: string;
  resolve: (value: boolean) => void;
}

interface UseConfirmReturn {
  confirm: (message: string) => Promise<boolean>;
  ConfirmUI: React.ReactNode;
}

export const useConfirm = (): UseConfirmReturn => {
  const [dialog, setDialog] = useState<DialogState | null>(null);

  const confirm = useCallback((message: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setDialog({ message, resolve });
    });
  }, []);

  const handleConfirm = () => {
    dialog!.resolve(true);
    setDialog(null);
  };

  const handleCancel = () => {
    dialog!.resolve(false);
    setDialog(null);
  };

  const ConfirmUI = dialog ? (
    <ConfirmDialog
      message={dialog.message}
      onConfirm={handleConfirm}
      onCancel={handleCancel}
    />
  ) : null;

  return { confirm, ConfirmUI };
};
