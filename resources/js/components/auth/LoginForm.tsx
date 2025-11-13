import Checkbox from '@/components/forms/Checkbox';
import InputLabel from '@/components/forms/InputLabel';
import PrimaryButton from '@/components/buttons/PrimaryButton';
import TextInput from '@/components/forms/TextInput';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

interface LoginFormProps {
    data: {
        email: string;
        password: string;
        remember: boolean;
    };
    setData: (key: string, value: string | boolean) => void;
    processing: boolean;
    onSubmit: (e: React.FormEvent) => void;
    onEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function LoginForm({ 
    data, 
    setData, 
    processing, 
    onSubmit, 
    onEmailChange, 
    onPasswordChange 
}: LoginFormProps) {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <form onSubmit={onSubmit} className="space-y-3">
            {/* Email Field */}
            <div>
                <InputLabel htmlFor="email" value="Email Address" className="text-sm font-semibold text-gray-700" />
                <TextInput
                    id="email"
                    type="email"
                    name="email"
                    value={data.email}
                    className="mt-2 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    autoComplete="username"
                    isFocused={true}
                    placeholder="Enter your email"
                    onChange={onEmailChange}
                />
            </div>

            {/* Password Field */}
            <div>
                <InputLabel htmlFor="password" value="Password" className="text-sm font-semibold text-gray-700" />
                <div className="relative mt-2">
                    <TextInput
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={data.password}
                        className="block w-full rounded-lg border-gray-300 pr-10 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        autoComplete="current-password"
                        placeholder="Enter your password"
                        onChange={onPasswordChange}
                    />
                    {data.password.length > 0 && (
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                        >
                            {showPassword ? (
                                <EyeOff className="h-5 w-5" />
                            ) : (
                                <Eye className="h-5 w-5" />
                            )}
                        </button>
                    )}
                </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center">
                <Checkbox
                    name="remember"
                    checked={data.remember}
                    onChange={(e) => setData('remember', e.target.checked || false)}
                    className="rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500"
                />
                <span className="ml-2 text-sm text-gray-600">
                    Keep me signed in
                </span>
            </div>

            {/* Submit Button */}
            <div>
                <PrimaryButton 
                    className="w-full justify-center rounded-lg bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2" 
                    disabled={processing}
                >
                    {processing ? 'Signing in...' : 'Sign In'}
                </PrimaryButton>
            </div>
        </form>
    );
}
