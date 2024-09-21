// utils/popupUtils.js
import { createPortal } from 'react-dom';
import { useState, useEffect, useCallback } from 'react';
import Popup from '../components/Popup'; // Adjust the path if necessary

let setPopupProps = null;

export const initializePopup = (setPopupCallback) => {
  setPopupProps = setPopupCallback;
};

export const showPopup = (props) => {
  if (setPopupProps) {
    setPopupProps(props);
  } else {
  }
};

export const PopupProvider = ({ children }) => {
  const [popupProps, setPopupPropsState] = useState(null);

  const setPopupProps = useCallback((props) => {
    setPopupPropsState(props);
  }, []);

  useEffect(() => {
    initializePopup(setPopupProps);
  }, [setPopupProps]);

  const handleConfirm = () => {
    if (popupProps?.onConfirm) popupProps.onConfirm();
    setPopupPropsState(null); // Close popup after confirm
  };

  const handleCancel = () => {
    if (popupProps?.onCancel) popupProps.onCancel();
    setPopupPropsState(null); // Close popup after cancel
  };

  return (
    <>
      {children}
      {popupProps && createPortal(
        <Popup
          title={popupProps.title}
          message={popupProps.message}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
          confirmText={popupProps.confirmText}
          cancelText={popupProps.cancelText}
          isOpen={!!popupProps}
          type={popupProps.type} // Pass the type to Popup component
        />,
        document.body
      )}
    </>
  );
};
