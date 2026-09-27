'use client';
import React, { useEffect, useCallback } from 'react';

type ModalProps = {
    children: React.ReactNode;
    /** Modal title displayed in the header */
    title: string;
    /** Unique id for the modal */
    id: string;
    /** Optional subtitle shown below the title (e.g. price) */
    subtitle?: string;
    /** Controls whether the modal is open */
    isOpen: boolean;
    /** Callback to close the modal */
    onClose: () => void;
    /** Optional: show Edit button and handle click */
    onEdit?: () => void;
    /** Optional: show Preview button and handle click */
    onPreview?: () => void;
    /** Optional: show Delete button and handle click */
    onDelete?: () => void;
    /** Optional: custom label for the Edit button */
    editLabel?: string;
    /** Optional: custom label for the Preview button */
    previewLabel?: string;
    /** Optional: custom label for the Delete button */
    deleteLabel?: string;
    /** Max width class (default: max-w-xl) */
    maxWidth?: string;
};

const Modal = ({
    children,
    title,
    id,
    subtitle,
    isOpen,
    onClose,
    onEdit,
    onPreview,
    onDelete,
    editLabel = 'Editar',
    previewLabel = 'Vista previa',
    deleteLabel = 'Eliminar',
    maxWidth = 'max-w-xl',
}: ModalProps) => {
    // Close on Escape key
    const handleKeyDown = useCallback(
        (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        },
        [onClose]
    );

    useEffect(() => {
        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = '';
        };
    }, [isOpen, handleKeyDown]);

    if (!isOpen) return null;

    const hasActions = onEdit || onPreview || onDelete;

    return (
        <>
            {/* Backdrop overlay */}
            <div
                className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity"
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Modal container */}
            <div
                id={id}
                tabIndex={-1}
                role="dialog"
                aria-modal="true"
                aria-labelledby={`${id}-title`}
                className="fixed inset-0 z-50 flex justify-center items-center w-full p-4 overflow-y-auto"
            >
                <div className={`relative w-full ${maxWidth}`}>
                    {/* Modal content */}
                    <div className="relative bg-white rounded-lg shadow dark:bg-gray-800 p-4 sm:p-5 animate-fade-in-up">
                        {/* Modal header */}
                        <div className="flex justify-between mb-4 rounded-t sm:mb-5">
                            <div className="text-lg text-gray-900 md:text-xl dark:text-white">
                                <h3
                                    id={`${id}-title`}
                                    className="font-semibold"
                                >
                                    {title}
                                </h3>
                                {subtitle && (
                                    <p className="font-bold">{subtitle}</p>
                                )}
                            </div>
                            <div>
                                <button
                                    type="button"
                                    className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 inline-flex dark:hover:bg-gray-600 dark:hover:text-white transition-colors cursor-pointer"
                                    onClick={onClose}
                                    aria-label="Cerrar modal"
                                >
                                    <svg
                                        aria-hidden="true"
                                        className="w-5 h-5"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    <span className="sr-only">Cerrar modal</span>
                                </button>
                            </div>
                        </div>

                        {/* Modal body — your custom content goes here */}
                        {children}

                        {/* Action buttons (CRUD style) */}
                        {hasActions && (
                            <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                                <div className="flex items-center space-x-3 sm:space-x-4">
                                    {onEdit && (
                                        <button
                                            type="button"
                                            className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 transition-colors cursor-pointer"
                                            onClick={onEdit}
                                        >
                                            <svg
                                                aria-hidden="true"
                                                className="mr-1 -ml-1 w-5 h-5"
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                                                <path
                                                    fillRule="evenodd"
                                                    d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                            {editLabel}
                                        </button>
                                    )}
                                    {onPreview && (
                                        <button
                                            type="button"
                                            className="py-2.5 px-5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 transition-colors cursor-pointer"
                                            onClick={onPreview}
                                        >
                                            {previewLabel}
                                        </button>
                                    )}
                                </div>
                                {onDelete && (
                                    <button
                                        type="button"
                                        className="inline-flex items-center text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-red-500 dark:hover:bg-red-600 dark:focus:ring-red-900 transition-colors cursor-pointer"
                                        onClick={onDelete}
                                    >
                                        <svg
                                            aria-hidden="true"
                                            className="w-5 h-5 mr-1.5 -ml-1"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                        {deleteLabel}
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Modal;
