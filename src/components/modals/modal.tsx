"use client";

import { useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";

interface ModalProps {
  isOpen: boolean;
  onChange: (open: boolean) => void;
  title: string;
  description: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onChange, title, description, children }) => {
  const [showModal, setShowModal] = useState(isOpen);

  useEffect(() => {
    setShowModal(isOpen);
  }, [isOpen]);

  const handleClose = () => {
    setShowModal(false);
    setTimeout(() => {
      onChange(false);
    }, 300); // Đợi animation kết thúc
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="
        fixed 
        inset-0 
        z-50 
        flex 
        justify-center 
        items-center 
        bg-neutral-900/90
        backdrop-blur-sm
        overflow-x-hidden
        overflow-y-auto
      "
      onClick={handleClose}
    >
      <div
        className="
          relative
          w-full
          md:w-4/6
          lg:w-3/6
          xl:w-2/5
          my-6
          mx-auto
          h-full
          md:h-auto
          lg:h-auto
        "
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className={`
            translate
            duration-300
            h-full
            ${showModal ? "translate-y-0" : "translate-y-full"}
            ${showModal ? "opacity-100" : "opacity-0"}
          `}
        >
          <div
            className="
              translate
              h-full
              md:h-auto
              lg:h-auto
              border-0
              rounded-lg
              shadow-lg
              relative
              flex
              flex-col
              w-full
              bg-neutral-800
              outline-none
              focus:outline-none
            "
          >
            {/* Header */}
            <div
              className="
                flex
                items-center
                justify-between
                p-6
                rounded-t
                border-b
                border-neutral-700
              "
            >
              <div className="text-lg font-semibold text-white">{title}</div>
              <button
                onClick={handleClose}
                className="
                  p-1
                  border-0
                  hover:opacity-70
                  transition
                  text-white
                "
              >
                <IoMdClose size={24} />
              </button>
            </div>

            {/* Description */}
            <div className="relative p-6 flex-auto">
              <p className="text-sm text-neutral-400 mb-4">{description}</p>
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
