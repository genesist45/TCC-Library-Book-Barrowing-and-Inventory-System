interface LoginHeaderProps {
    status?: string;
}

export function LoginHeader({ status }: LoginHeaderProps) {
    return (
        <>
            {/* Header Section */}
            <div className="mb-2 text-center">
                <h2 className="text-2xl font-bold text-gray-900">Welcome Back</h2>
                <p className="mt-2 text-sm text-gray-600">
                    Sign in to access the Library Management System
                </p>
            </div>

            {status && (
                <div className="mb-2 rounded-lg bg-green-50 p-4 text-sm font-medium text-green-600">
                    {status}
                </div>
            )}
        </>
    );
}
