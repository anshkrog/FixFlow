import {
    CheckCircle2,
    CircleAlert,
    Info,
    X
} from "lucide-react";

function Toast({
    message,
    type = "success",
    onClose
}) {

    const Icon =
        type === "success"
            ? CheckCircle2
            : type === "error"
                ? CircleAlert
                : Info;

    return (
        <div className={`fixflow-toast toast-${type}`}>

            <div className="toast-icon-wrap">
                <Icon size={18} />
            </div>

            <div className="toast-content">
                <strong>
                    {type === "success"
                        ? "Success"
                        : type === "error"
                            ? "Something went wrong"
                            : "Notice"}
                </strong>

                <span>
                    {message}
                </span>
            </div>

            <button
                className="toast-close"
                onClick={onClose}
                aria-label="Close notification"
            >
                <X size={15} />
            </button>

        </div>
    );
}

export default Toast;