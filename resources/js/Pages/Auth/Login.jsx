import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { Head, useForm } from "@inertiajs/react";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import ReCAPTCHA from "react-google-recaptcha";

export default function Login({ status }) {
    const [eyePassword, setEyePassword] = useState(false);
    const [captcha, setCaptcha] = useState(null);
    const [error, setError] = useState("");

    const { data, setData, post, processing, errors, reset } = useForm({
        username: "",
        password: "",
        "g-recaptcha-response": "",
    });

    const submit = (e) => {
        e.preventDefault();

        if (!captcha) {
            setError("Silakan selesaikan CAPTCHA terlebih dahulu.");
            return;
        }

        setData("g-recaptcha-response", captcha);

        post(route("login"), {
            onFinish: () => reset("password"),
        });
    };

    return (
        <>
            <Head title="Login" />
            <div className="h-screen bg-white w-full block sm:flex items-center justify-center">
                <Head title="Login - SIAPA PEKA" />

                {status && (
                    <div className="mb-4 text-sm font-medium text-green-600">
                        {status}
                    </div>
                )}

                <div className="w-full lg:w-3/4 flex flex-col items-center justify-center h-screen px-4 sm:px-6 lg:px-8 bg-indigo-50">
                    <img
                        alt="dekorasi"
                        src="/assets/PIC1.png"
                        className="absolute bottom-0 left-0 w-64 z-0"
                    />
                    <div className="flex items-center justify-center mb-6 sm:mb-8">
                        <h1 className="font-bold text-2xl sm:text-3xl lg:text-3xl text-gray-800 text-center">
                            Selamat Datang
                            <br />
                            <span className="text-xl sm:text-2xl lg:text-2xl font-bold text-indigo-700">
                                SIAPA PEKA
                            </span>
                        </h1>
                    </div>

                    <form
                        onSubmit={submit}
                        className="w-2/5 max-w-md sm:max-w-lg space-y-4 sm:space-y-6 z-0"
                    >
                        <div className="space-y-2">
                            <InputLabel
                                htmlFor="username"
                                value="Username"
                            />
                            <TextInput
                                id="username"
                                type="text"
                                name="username"
                                value={data.username}
                                className="w-full px-4 py-3 border-2 border-indigo-300 rounded-full shadow-sm bg-white
                                    transition-all duration-200 ease-in-out
                                    focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500
                                    hover:border-indigo-400"
                                autoComplete="username"
                                isFocused={true}
                                onChange={(e) =>
                                    setData("username", e.target.value)
                                }
                            />
                            <InputError message={errors.username} />
                        </div>

                        <div className="space-y-2">
                            <InputLabel
                                htmlFor="password"
                                value="Password"
                            />
                            <div className="relative">
                                <TextInput
                                    id="password"
                                    type={eyePassword ? "text" : "password"}
                                    name="password"
                                    value={data.password}
                                    className="w-full px-4 py-3 border-2 border-indigo-300 rounded-full shadow-sm bg-white
                                        transition-all duration-200 ease-in-out
                                        focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500
                                        hover:border-indigo-400 pr-12"
                                    autoComplete="current-password"
                                    onChange={(e) =>
                                        setData("password", e.target.value)
                                    }
                                />

                                <button
                                    type="button"
                                    onClick={() => setEyePassword(prev => !prev)}
                                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-indigo-600"
                                >
                                    {eyePassword ? (
                                        <EyeOff className="w-5 h-5" />
                                    ) : (
                                        <Eye className="w-5 h-5" />
                                    )}
                                </button>
                            </div>
                            <InputError message={errors.password} />
                        </div>

                        {/* CAPTCHA */}
                        <div className="flex justify-center pt-2">
                            <ReCAPTCHA
                                sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
                                onChange={(value) => setCaptcha(value)}
                            />
                        </div>
                        <InputError message={errors["g-recaptcha-response"] || error} />

                        <div className="pt-3">
                            <PrimaryButton
                                className="w-full flex justify-center py-3 rounded-full shadow-lg text-sm font-semibold text-white
                                    bg-gradient-to-r from-indigo-600 to-indigo-700
                                    hover:from-indigo-700 hover:to-indigo-800
                                    focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
                                    disabled:opacity-50"
                                disabled={processing}
                            >
                                {processing ? "Memuat..." : "Masuk"}
                            </PrimaryButton>
                        </div>
                    </form>
                </div>

                <div className="w-full sm:w-2/5 bg-gradient-to-br from-indigo-400 via-indigo-300 to-indigo-200 h-screen flex items-center justify-center p-10">
                    <div className="text-center max-w-md space-y-8">
                        <h1 className="text-white text-4xl font-bold">SIAPA PEKA</h1>
                        <p className="text-white leading-relaxed">
                            Sistem aplikasi berbasis digital yang mampu
                            memantau, menyajikan data terkait pencegahan
                            perkawinan anak di Provinsi Jawa Timur secara
                            berkelanjutan serta menjadi media Komunikasi
                            Informasi dan Edukasi (KIE).
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
