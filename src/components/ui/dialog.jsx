'use client';
import {
    createContext,
    useContext,
    useEffect,
    useId,
    useRef,
    useState,
} from 'react';
import { AnimatePresence, MotionConfig, motion } from 'motion/react';
import { createPortal } from 'react-dom';
import { XIcon } from 'lucide-react';

const DialogContext = createContext(null);

function useDialog() {
    const ctx = useContext(DialogContext);
    if (!ctx) throw new Error('useDialog must be used within <Dialog>');
    return ctx;
}

export function Dialog({ children, transition }) {
    const [isOpen, setIsOpen] = useState(false);
    const uniqueId = useId();
    const triggerRef = useRef(null);

    return (
        <DialogContext.Provider value={{ isOpen, setIsOpen, uniqueId, triggerRef }}>
            <MotionConfig transition={transition ?? { type: 'spring', bounce: 0.05, duration: 0.3 }}>
                {children}
            </MotionConfig>
        </DialogContext.Provider>
    );
}

export function DialogTrigger({ children, className, style }) {
    const { setIsOpen, uniqueId, triggerRef } = useDialog();
    return (
        <motion.div
            ref={triggerRef}
            layoutId={`dialog-${uniqueId}`}
            onClick={() => setIsOpen(true)}
            className={`cursor-pointer ${className ?? ''}`}
            style={style}
        >
            {children}
        </motion.div>
    );
}

export function DialogContainer({ children }) {
    const { isOpen, setIsOpen, uniqueId } = useDialog();
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);
    if (!mounted) return null;

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        key={`backdrop-${uniqueId}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsOpen(false)}
                        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
                    />
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        {children}
                    </div>
                </>
            )}
        </AnimatePresence>,
        document.body
    );
}

export function DialogContent({ children, className, style }) {
    const { uniqueId } = useDialog();
    return (
        <motion.div
            layoutId={`dialog-${uniqueId}`}
            className={`relative z-50 ${className ?? ''}`}
            style={style}
        >
            {children}
        </motion.div>
    );
}

export function DialogTitle({ children, className }) {
    const { uniqueId } = useDialog();
    return (
        <motion.p layoutId={`dialog-title-${uniqueId}`} className={className}>
            {children}
        </motion.p>
    );
}

export function DialogImage({ src, alt, className, style }) {
    const { uniqueId } = useDialog();
    return (
        <motion.img
            layoutId={`dialog-img-${uniqueId}`}
            src={src}
            alt={alt}
            className={className}
            style={style}
        />
    );
}

export function DialogDescription({ children, className, variants, disableLayoutAnimation }) {
    return (
        <motion.div
            initial="initial"
            animate="animate"
            exit="exit"
            variants={variants}
            className={className}
        >
            {children}
        </motion.div>
    );
}

export function DialogClose({ className }) {
    const { setIsOpen } = useDialog();
    return (
        <button
            onClick={() => setIsOpen(false)}
            className={className}
            aria-label="Close"
        >
            <XIcon size={16} />
        </button>
    );
}