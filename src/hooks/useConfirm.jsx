import { useState, useCallback } from 'react';
import { ConfirmDialog } from '../components/ConfirmDialog';

export const useConfirm = () => {
  const [dialog, setDialog] = useState(null);

  const confirm = useCallback((message) => {
    return new Promise((resolve) => {
      setDialog({ message, resolve });
    });
  }, []);

  const handleConfirm = () => {
    dialog.resolve(true);
    setDialog(null);
  };

  const handleCancel = () => {
    dialog.resolve(false);
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
