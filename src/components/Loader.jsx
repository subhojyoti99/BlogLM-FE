export default function Loader({ message = "Loading..." }) {
    return (
        <div className="flex items-center justify-center py-6">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600 mr-3"></div>
            <span className="text-blue-600 font-medium">{message}</span>
        </div>
    );
}
