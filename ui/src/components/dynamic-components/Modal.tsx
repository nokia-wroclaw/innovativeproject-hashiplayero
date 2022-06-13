import { Button } from "@mui/material";
import { useEffect, useState, useRef } from "react";

const Modal = ({
  show,
  password,
  setModal,
}: {
  show: boolean;
  password: String;
  setModal: any;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [showOpen, setShowOpen] = useState(show);

  const handleClose = () => {
    setTimeout(() => {
      setShowOpen(false);
    }, 1000);
    setTimeout(() => {
      setModal({ show: false, password: "" });
    }, 3000);
  };

  useEffect(() => {
    function handleClickOutside(event: any) {
      if (ref.current && !ref.current.contains(event.target)) {
        handleClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);

  return (
    <>
      {
        <div id="modal-container" className={`two ${showOpen ? "" : "out"}`}>
          <div className="modal-background">
            <div className="modal" ref={ref}>
              <h2>I'm a Modal with bigger text</h2>
              <p>Hear me roar.</p>
              <p>Hear me roar.</p>

              <Button onClick={handleClose}>guzik</Button>
            </div>
          </div>
        </div>
      }
    </>
  );
};

export default Modal;
