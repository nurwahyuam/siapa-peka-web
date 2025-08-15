import Checkbox from "@/Components/Checkbox";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import GuestLayout from "@/Layouts/GuestLayout";
import { Head, Link, useForm } from "@inertiajs/react";

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        username: "",
        password: "",
    });

    const submit = (e) => {
        e.preventDefault();

        post(route("login"), {
            onFinish: () => reset("password"),
        });
    };

    return (
        <>
            <div className="min-h-screen bg-white w-full block sm:flex items-center justify-center">
                <Head title="Log in" />

                {status && (
                    <div className="mb-4 text-sm font-medium text-green-600">
                        {status}
                    </div>
                )}

                <div className="w-full lg:w-3/4 flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8 bg-indigo-50">
                    <div className="flex items-center justify-center mb-6 sm:mb-8">
                        <h1 className="font-bold text-xl sm:text-2xl lg:text-3xl text-gray-800 text-center leading-tight">
                            Selamat Datang <br /> 
                            <span className="text-2xl font-bold text-indigo-700">Silahkan Masuk</span>
                        </h1>
                    </div>
                    
                    <form onSubmit={submit} className="w-full max-w-md sm:max-w-lg space-y-4 sm:space-y-6">
                        <div className="space-y-2">
                            <InputLabel
                                htmlFor="email"
                                value="Username"
                                className="block text-sm font-medium text-gray-700"
                            />
                            <TextInput
                                id="email"
                                type="text"
                                name="email"
                                value={data.email}
                                className="w-full px-4 py-3 sm:py-2 border-2 border-indigo-300 rounded-full shadow-sm bg-white 
                                        transition-all duration-200 ease-in-out
                                        focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
                                        hover:border-indigo-400"
                                autoComplete="username"
                                isFocused={true}
                                onChange={(e) => setData("email", e.target.value)}
                            />
                            <InputError message={errors.email} className="mt-2" />
                        </div>

                        <div className="space-y-2">
                            <InputLabel
                                htmlFor="password"
                                value="Password"
                                className="block text-sm font-medium text-gray-700"
                            />
                            <TextInput
                                id="password"
                                type="password"
                                name="password"
                                value={data.password}
                                className="w-full px-4 py-3 sm:py-2 border-2 border-indigo-300 rounded-3xl shadow-sm bg-white 
                                        transition-all duration-200 ease-in-out
                                        focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
                                        hover:border-indigo-400"
                                autoComplete="current-password"
                                onChange={(e) => setData("password", e.target.value)}
                            />
                            <InputError message={errors.password} className="mt-2" />
                        </div>

                        <div className="pt-4">
                            <PrimaryButton
                                className="w-full flex justify-center py-3 sm:py-2 px-4 border border-transparent 
                                        rounded-3xl shadow-lg text-sm font-semibold text-white 
                                        bg-gradient-to-r from-indigo-600 to-indigo-700 
                                        hover:from-indigo-700 hover:to-indigo-800 
                                        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 
                                        active:from-indigo-800 active:to-indigo-900
                                        transition-all duration-200 ease-in-out
                                        disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={processing}
                            >
                                {processing ? 'Loading...' : 'Login'}
                            </PrimaryButton>
                        </div>

                        <div className="text-center pt-2">
                            <p className="text-sm text-gray-600">
                                Don't have an account?{" "}
                                <Link
                                    href={route("register")}
                                    className="font-medium text-indigo-600 hover:text-indigo-500 
                                            transition-colors duration-200 ease-in-out
                                            focus:outline-none focus:underline"
                                >
                                    Register
                                </Link>
                            </p>
                        </div>
                    </form>
                </div>
                <div className="w-full sm:w-2/5 bg-gradient-to-br from-indigo-300 via-indigo-400 to-indigo-500 h-screen flex items-center justify-center p-10">
                    <div className="text-center max-w-md space-y-6">
                        <h1 className="text-white text-3xl font-bold">Siapa peka</h1>
                        <p className="text-white leading-relaxed">
                        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Molestias illum rerum ipsa quae ex libero pariatur nobis repellendus laboriosam eum corporis nemo rem, id, laudantium magnam architecto officia nam sint.
                        </p>
                        <div className="flex justify-center">
                            <img src="/assets/dp3ak.png" alt="logo kominfo" />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
