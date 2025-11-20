import React, { useState, type ReactNode } from "react";
import styles from "./dialog.module.css";

interface DialogProps {
  title?: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  children: ReactNode; // trigger button
  onConfirm: () => Promise<void> | void;
}

const Dialog: React.FC<DialogProps> = ({
  title = "Are you sure?",
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  children,
  onConfirm,
}) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    try {
      setLoading(true);
      await onConfirm();
      setOpen(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        type="button"
        className={styles.trigger}
        onClick={(e) => {
          e.stopPropagation();
          setOpen(true);
        }}
      >
        {children}
      </button>

      {open && (
        <div
          className={styles.backdrop}
          onClick={() => {
            if (!loading) setOpen(false);
          }}
        >
          <div
            className={styles.dialog}
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            {title && <h2 className={styles.title}>{title}</h2>}
            {description && <p className={styles.description}>{description}</p>}

            <div className={styles.footer}>
              <button
                type="button"
                className={styles.cancelButton}
                onClick={() => {
                  if (!loading) setOpen(false);
                }}
                disabled={loading}
              >
                {cancelLabel}
              </button>
              <button
                type="button"
                className={styles.confirmButton}
                onClick={handleConfirm}
                disabled={loading}
              >
                {loading ? "Please wait..." : confirmLabel}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Dialog;
