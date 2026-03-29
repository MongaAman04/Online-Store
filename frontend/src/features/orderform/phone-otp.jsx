import { useState, useRef, useEffect } from "react";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { Auth } from "../../config/firebaseConfig";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, ShieldCheck, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";

export const PhoneOTPVerifier = ({ phone, onVerified }) => {
    const [step, setStep] = useState("idle");
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [confirmResult, setConfirmResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [timer, setTimer] = useState(30);
    const inputRefs = useRef([]);
    const timerRef = useRef(null);
    const recaptchaRef = useRef(null); // ✅ Use ref instead of window

    // ✅ Cleanup on unmount
    useEffect(() => {
        return () => {
            clearRecaptcha();
            clearInterval(timerRef.current);
        };
    }, []);

    // ✅ Centralized cleanup function
    const clearRecaptcha = () => {
        try {
            if (recaptchaRef.current) {
                recaptchaRef.current.clear();
                recaptchaRef.current = null;
            }
        } catch (e) {}

        // Also clear window reference if exists
        try {
            if (window.recaptchaVerifier) {
                window.recaptchaVerifier.clear();
                window.recaptchaVerifier = null;
            }
        } catch (e) {}

        // ✅ Clear DOM manually
        const container = document.getElementById("recaptcha-container");
        if (container) container.innerHTML = "";
    };

    // ✅ Setup Recaptcha
    const setupRecaptcha = () => {
        clearRecaptcha(); // always clear before creating new

        const verifier = new RecaptchaVerifier(
            Auth,
            "recaptcha-container",
            {
                size: "invisible",
                callback: () => {},
                "expired-callback": () => {
                    clearRecaptcha();
                    toast.error("reCAPTCHA expired. Please try again.");
                    setStep("idle");
                }
            }
        );

        recaptchaRef.current = verifier;
        window.recaptchaVerifier = verifier; // keep for compatibility
        return verifier;
    };

    // ✅ Send OTP
    const sendOTP = async () => {
        if (!phone || phone.length !== 10) {
            toast.error("Enter a valid 10-digit phone number first.");
            return;
        }
        setLoading(true);
        try {
            const verifier = setupRecaptcha();
            const phoneWithCode = `+91${phone}`;
            const result = await signInWithPhoneNumber(Auth, phoneWithCode, verifier);
            setConfirmResult(result);
            setStep("otp");
            toast.success(`OTP sent to +91 ${phone}`);
            startTimer();
        } catch (error) {
            console.error("OTP send error:", error);
            clearRecaptcha();

            // ✅ Specific error messages
            if (error.code === "auth/invalid-phone-number") {
                toast.error("Invalid phone number format.");
            } else if (error.code === "auth/too-many-requests") {
                toast.error("Too many attempts. Please try later.");
            } else if (error.code === "auth/billing-not-enabled") {
                toast.error("Phone auth not enabled. Contact support.");
            } else {
                toast.error("Failed to send OTP. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    // ✅ Countdown timer
    const startTimer = () => {
        setTimer(30);
        clearInterval(timerRef.current);
        timerRef.current = setInterval(() => {
            setTimer(prev => {
                if (prev <= 1) {
                    clearInterval(timerRef.current);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    // ✅ Handle OTP input
    const handleOtpChange = (index, value) => {
        if (!/^\d*$/.test(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value.slice(-1);
        setOtp(newOtp);
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    // ✅ Handle backspace
    const handleKeyDown = (index, e) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    // ✅ Paste OTP support
    const handlePaste = (e) => {
        e.preventDefault();
        const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
        if (pasted.length === 6) {
            const newOtp = pasted.split("");
            setOtp(newOtp);
            inputRefs.current[5]?.focus(); // focus last box
        }
    };

    // ✅ Verify OTP
    const verifyOTP = async () => {
        const otpString = otp.join("");
        if (otpString.length !== 6) {
            toast.error("Enter all 6 digits.");
            return;
        }
        setLoading(true);
        try {
            await confirmResult.confirm(otpString);
            setStep("verified");
            clearInterval(timerRef.current);
            toast.success("Phone verified successfully!");
            onVerified();
        } catch (error) {
            console.error("OTP verify error:", error);
            if (error.code === "auth/invalid-verification-code") {
                toast.error("Wrong OTP. Please check and try again.");
            } else if (error.code === "auth/code-expired") {
                toast.error("OTP expired. Please request a new one.");
                handleResend();
            } else {
                toast.error("Verification failed. Try again.");
            }
            setOtp(["", "", "", "", "", ""]);
            inputRefs.current[0]?.focus();
        } finally {
            setLoading(false);
        }
    };

    // ✅ Resend handler
    const handleResend = () => {
        clearRecaptcha();
        clearInterval(timerRef.current);
        setStep("idle");
        setOtp(["", "", "", "", "", ""]);
        setConfirmResult(null);
        setTimer(30);
    };

    return (
        <div className="space-y-3">
            {/* ✅ Invisible recaptcha container */}
            <div id="recaptcha-container" />

            <AnimatePresence mode="wait">

                {/* ── Step 1: Send OTP ── */}
                {step === "idle" && (
                    <motion.button
                        key="send"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        type="button"
                        onClick={sendOTP}
                        disabled={loading || phone?.length !== 10}
                        className="w-full flex items-center justify-center gap-2 py-3 border-2 border-rose-200 text-rose-500 rounded-2xl text-xs font-bold tracking-widest uppercase hover:bg-rose-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <div className="w-4 h-4 border-2 border-rose-300 border-t-rose-500 rounded-full animate-spin" />
                        ) : (
                            <><Phone size={14} /> Send OTP to +91 {phone}</>
                        )}
                    </motion.button>
                )}

                {/* ── Step 2: OTP Input ── */}
                {step === "otp" && (
                    <motion.div
                        key="otp"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="bg-rose-50/50 rounded-2xl p-4 border border-rose-100 space-y-4"
                    >
                        <p className="text-xs text-gray-500 text-center">
                            Enter the 6-digit OTP sent to{" "}
                            <span className="font-bold text-gray-900">+91 {phone}</span>
                        </p>

                        {/* OTP Boxes */}
                        <div className="flex gap-2 justify-center">
                            {otp.map((digit, index) => (
                                <input
                                    key={index}
                                    ref={el => inputRefs.current[index] = el}
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) => handleOtpChange(index, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                    onPaste={index === 0 ? handlePaste : undefined} // ✅ paste on first box
                                    className={`w-10 h-12 text-center text-lg font-bold border-2 rounded-xl outline-none transition-all
                                        ${digit
                                            ? "border-gray-900 bg-gray-900 text-white"
                                            : "border-rose-200 bg-white text-gray-900 focus:border-rose-400"
                                        }`}
                                />
                            ))}
                        </div>

                        {/* Verify button */}
                        <button
                            type="button"
                            onClick={verifyOTP}
                            disabled={loading || otp.join("").length !== 6}
                            className="w-full py-3 bg-gray-900 text-white rounded-2xl text-xs font-bold tracking-widest uppercase hover:bg-rose-500 transition-colors disabled:opacity-40 flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <><ShieldCheck size={14} /> Verify OTP</>
                            )}
                        </button>

                        {/* Resend */}
                        <div className="text-center">
                            {timer > 0 ? (
                                <p className="text-xs text-gray-400">
                                    Resend in{" "}
                                    <span className="font-bold text-rose-500">{timer}s</span>
                                </p>
                            ) : (
                                <button
                                    type="button"
                                    onClick={handleResend}
                                    className="text-xs text-rose-500 font-bold flex items-center gap-1 mx-auto hover:underline"
                                >
                                    <RefreshCw size={12} /> Resend OTP
                                </button>
                            )}
                        </div>
                    </motion.div>
                )}

                {/* ── Step 3: Verified ── */}
                {step === "verified" && (
                    <motion.div
                        key="verified"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-2xl px-4 py-3"
                    >
                        <ShieldCheck size={16} className="text-green-500" />
                        <span className="text-xs font-bold text-green-600 uppercase tracking-widest">
                            Phone Verified ✅
                        </span>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};