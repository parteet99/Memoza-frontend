import { toast } from "sonner";

export const notify = {
    success: (message, options = {}) => {
        toast.success(message, options);
    },

    error: (message, options = {}) => {
        toast.error(message, options);
    },

    info: (message, options = {}) => {
        toast.info(message, options);
    },

    warning: (message, options = {}) => {
        toast.warning(message, options);
    },

    loading: (message, options = {}) => {
        return toast.loading(message, options);
    },

    dismiss: (toastId) => {
        toast.dismiss(toastId);
    },
};