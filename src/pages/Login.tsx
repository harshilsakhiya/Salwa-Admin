import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ClipboardEvent,
  type FormEvent,
  type InputHTMLAttributes,
  type KeyboardEvent,
  type MutableRefObject
} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../components/ToastProvider";
import leftPanelImg from "../assets/leftPanelImg.svg";

const VERIFY_ID_ENDPOINT = "https://apisalwa.rushkarprojects.in/api/SuperAdmin/VerifySuperAdminByIDNumber";
const VERIFY_MOBILE_ENDPOINT = "https://apisalwa.rushkarprojects.in/api/SuperAdmin/VerifySuperAdminMobile";
const VERIFY_OTP_ENDPOINT = "https://apisalwa.rushkarprojects.in/api/SuperAdmin/SuperAdminVerifyOtp";
const SET_PASSWORD_ENDPOINT = "https://apisalwa.rushkarprojects.in/api/SuperAdmin/SetSuperAdminPasswordByMobile";
const LOGIN_ENDPOINT = "https://apisalwa.rushkarprojects.in/api/SuperAdmin/SuperAdminLogin";

type Step = "verifyId" | "mobile" | "otp" | "setPassword" | "success" | "login";

type VerifyResponse = {
  status: number;
  message: string;
  superAdminId: number;
  adminName: string;
  adminMobileNo: string;
  isPasswordSet: 0 | 1;
  isOtpVerify: 0 | 1;
  isMobileNoVerify: boolean;
};

type BasicApiResponse = {
  status?: number;
  message?: string;
};

const COUNTRY_OPTIONS = [
  { code: "+966", label: "Saudi Arabia (+966)" },
  { code: "+971", label: "United Arab Emirates (+971)" },
  { code: "+965", label: "Kuwait (+965)" },
  { code: "+974", label: "Qatar (+974)" },
  { code: "+91", label: "India (+91)" },
];

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, token } = useAuth();
  const { showToast } = useToast();

  const [step, setStep] = useState<Step>("verifyId");
  const [idNumber, setIdNumber] = useState("");
  const [verification, setVerification] = useState<VerifyResponse | null>(null);

  const [verifyLoading, setVerifyLoading] = useState(false);
  const [mobileLoading, setMobileLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [creatingPassword, setCreatingPassword] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);

  const [mobileDialCode, setMobileDialCode] = useState(COUNTRY_OPTIONS[0].code);
  const [mobileLocalNumber, setMobileLocalNumber] = useState("");
  const [mobileForOtp, setMobileForOtp] = useState("");

  const [otpValues, setOtpValues] = useState<string[]>(() => Array(6).fill(""));
  const otpRefs = useRef<Array<HTMLInputElement | null>>([]) as MutableRefObject<Array<HTMLInputElement | null>>;

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  useEffect(() => {
    if (token) {
      navigate("/dashboard", { replace: true });
    }
  }, [token, navigate]);

  useEffect(() => {
    const initialId = (location.state as { idNumber?: string } | null)?.idNumber;
    if (initialId) {
      setIdNumber(initialId);
      setStep("login");
    }
  }, [location.state]);

  const countryOptions = useMemo(() => {
    const map = new Map(COUNTRY_OPTIONS.map((option) => [option.code, option]));
    if (mobileDialCode && !map.has(mobileDialCode)) {
      map.set(mobileDialCode, { code: mobileDialCode, label: `${mobileDialCode}` });
    }
    return Array.from(map.values());
  }, [mobileDialCode]);

  const formatMobileForDisplay = (raw: string) => {
    if (!raw) {
      return "";
    }
    const digitsOnly = raw.replace(/[^0-9]/g, "");
    if (!digitsOnly) {
      return raw;
    }
    return `+${digitsOnly}`;
  };

  const applyMobileFromVerification = (raw?: string) => {
    if (!raw) {
      return;
    }
    const cleaned = raw.replace(/[^0-9+]/g, "");
    if (!cleaned) {
      return;
    }
    const knownOption = COUNTRY_OPTIONS.find((option) => cleaned.startsWith(option.code));
    if (knownOption) {
      setMobileDialCode(knownOption.code);
      setMobileLocalNumber(cleaned.slice(knownOption.code.length));
      return;
    }
    const match = cleaned.match(/^(\+\d{1,3})(\d{6,})$/);
    if (match) {
      setMobileDialCode(match[1]);
      setMobileLocalNumber(match[2]);
      return;
    }
    if (cleaned.startsWith("+")) {
      setMobileDialCode(cleaned.slice(0, 4));
      setMobileLocalNumber(cleaned.slice(1));
      return;
    }
    setMobileLocalNumber(cleaned);
  };

  const readResponsePayload = async (response: Response) => {
    const raw = await response.text();
    if (!raw) {
      return "";
    }
    try {
      return JSON.parse(raw);
    } catch {
      return raw;
    }
  };

  const verifyIdViaApi = async (rawId: string) => {
    const trimmed = rawId.trim();
    if (!trimmed) {
      throw new Error("Please enter your ID / IQAMA number.");
    }

    const response = await fetch(VERIFY_ID_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify({ idNumber: trimmed, IDNumber: trimmed }),
    });

    if (!response.ok) {
      const payload = await readResponsePayload(response);
      const message = typeof payload === "string" ? payload : payload?.message;
      throw new Error(message || "Unable to verify ID number. Please try again.");
    }

    const data = (await response.json()) as VerifyResponse;
    if (data.status !== 200) {
      throw new Error(data.message ?? "Unable to verify ID number.");
    }
    return data;
  };

  const verifyMobileViaApi = async (mobileNumber: string) => {
    const response = await fetch(VERIFY_MOBILE_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        accept: "*/*",
      },
      body: JSON.stringify({ mobileNumber }),
    });

    const payload = await readResponsePayload(response);
    if (!response.ok) {
      const message = typeof payload === "string" ? payload : payload?.message;
      throw new Error(message || "Unable to verify mobile number.");
    }

    if (typeof payload === "object" && payload && "status" in payload && payload.status !== 200) {
      throw new Error((payload as BasicApiResponse).message || "Unable to verify mobile number.");
    }

    const message =
      (typeof payload === "object" && payload && "message" in payload && payload.message) ||
      (typeof payload === "string" && payload) ||
      "Mobile number verified.";

    return message;
  };

  const verifyOtpViaApi = async (mobile: string, otp: string) => {
    const response = await fetch(VERIFY_OTP_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        accept: "*/*",
      },
      body: JSON.stringify({ mobileNo: mobile, otp }),
    });

    const payload = await readResponsePayload(response);
    if (!response.ok) {
      const message = typeof payload === "string" ? payload : payload?.message;
      throw new Error(message || "Unable to verify OTP.");
    }

    if (typeof payload === "object" && payload && "status" in payload && payload.status !== 200) {
      throw new Error((payload as BasicApiResponse).message || "Unable to verify OTP.");
    }

    const message =
      (typeof payload === "object" && payload && "message" in payload && payload.message) ||
      (typeof payload === "string" && payload) ||
      "OTP verified successfully.";

    return message;
  };

  const setPasswordViaApi = async (id: string, passwordValue: string, confirmValue: string) => {
    const response = await fetch(SET_PASSWORD_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        accept: "text/plain",
      },
      body: JSON.stringify({ idNumber: id, password: passwordValue, confirmPassword: confirmValue }),
    });

    const payload = await readResponsePayload(response);
    if (!response.ok) {
      const message = typeof payload === "string" ? payload : payload?.message;
      throw new Error(message || "Unable to set password.");
    }

    if (typeof payload === "object" && payload && "status" in payload && payload.status !== 200) {
      throw new Error((payload as BasicApiResponse).message || "Unable to set password.");
    }

    const message =
      (typeof payload === "object" && payload && "message" in payload && payload.message) ||
      (typeof payload === "string" && payload) ||
      "Password set successfully.";

    return message;
  };

  const loginViaApi = async (id: string, passwordValue: string) => {
    const response = await fetch(LOGIN_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        accept: "text/plain",
      },
      body: JSON.stringify({ idNumber: id, password: passwordValue }),
    });

    const payload = await readResponsePayload(response);
    if (!response.ok) {
      const message = typeof payload === "string" ? payload : payload?.message;
      throw new Error(message || "Login failed.");
    }

    if (typeof payload === "object" && payload && "status" in payload && payload.status !== 200) {
      throw new Error((payload as BasicApiResponse).message || "Login failed.");
    }

    const token =
      (typeof payload === "object" && payload && "token" in payload && payload.token) ||
      (typeof payload === "string" && payload) ||
      `token-${Date.now()}`;

    return String(token);
  };

  const resetOtpInputs = () => {
    setOtpValues(Array(6).fill(""));
    otpRefs.current.forEach((input) => input?.blur());
  };

  const goToStep = (next: Step) => {
    setStep(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleVerifySubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setVerifyLoading(true);
    try {
      const data = await verifyIdViaApi(idNumber);
      setVerification(data);
      applyMobileFromVerification(data.adminMobileNo);
      const readyForLogin = data.isPasswordSet === 1 && data.isOtpVerify === 1 && data.isMobileNoVerify;

      if (readyForLogin) {
        goToStep("login");
        showToast("ID verified. Please enter your password to continue.", "success");
      } else {
        const sanitized = data.adminMobileNo?.replace(/[^0-9]/g, "");
        if (sanitized) {
          setMobileForOtp(sanitized);
        }
        goToStep("mobile");
        showToast("ID verified. Continue with mobile verification.", "info");
      }
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Unable to verify ID number.", "error");
    } finally {
      setVerifyLoading(false);
    }
  };

  const handleMobileSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const digits = mobileLocalNumber.replace(/\D/g, "");
    if (!digits) {
      showToast("Please enter your mobile number.", "error");
      return;
    }

    const sanitizedDial = mobileDialCode.replace(/\D/g, "");
    const requestValue = `${sanitizedDial}${digits}`;

    setMobileLoading(true);
    try {
      const message = await verifyMobileViaApi(requestValue);
      setMobileForOtp(requestValue);
      resetOtpInputs();
      goToStep("otp");
      showToast(message, "success");
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Unable to verify mobile number.", "error");
    } finally {
      setMobileLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    const sanitized = value.replace(/\D/g, "");
    const updated = [...otpValues];
    updated[index] = sanitized.slice(-1);
    setOtpValues(updated);

    if (sanitized && index < otpRefs.current.length - 1) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Backspace" && !otpValues[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
    if (event.key === "ArrowLeft" && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
    if (event.key === "ArrowRight" && index < otpRefs.current.length - 1) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpPaste = (event: ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    const pasted = event.clipboardData.getData("text").replace(/\D/g, "");
    if (!pasted) {
      return;
    }
    const updated = [...otpValues];
    for (let i = 0; i < updated.length; i += 1) {
      updated[i] = pasted[i] ?? "";
    }
    setOtpValues(updated);
    const focusIndex = Math.min(pasted.length, updated.length - 1);
    otpRefs.current[focusIndex]?.focus();
  };

  const handleOtpSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const otp = otpValues.join("");

    if (otp.length !== 6) {
      showToast("Please enter the 6-digit OTP.", "error");
      return;
    }

    if (!mobileForOtp) {
      showToast("Mobile number missing. Please verify again.", "error");
      goToStep("mobile");
      return;
    }

    setOtpLoading(true);
    try {
      const message = await verifyOtpViaApi(mobileForOtp, otp);
      goToStep("setPassword");
      showToast(message, "success");
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Unable to verify OTP.", "error");
    } finally {
      setOtpLoading(false);
    }
  };

  const handleSetPasswordSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (newPassword.length < 8) {
      showToast("Password must be at least 8 characters.", "error");
      return;
    }

    if (newPassword !== confirmPassword) {
      showToast("Passwords do not match.", "error");
      return;
    }

    const trimmedId = idNumber.trim();
    if (!trimmedId) {
      showToast("ID number missing. Please start again.", "error");
      goToStep("verifyId");
      return;
    }

    setCreatingPassword(true);
    try {
      const message = await setPasswordViaApi(trimmedId, newPassword, confirmPassword);
      setVerification((current) =>
        current
          ? {
              ...current,
              isPasswordSet: 1,
              isOtpVerify: 1,
              isMobileNoVerify: true,
            }
          : current,
      );
      setLoginPassword(newPassword);
      goToStep("success");
      showToast(message, "success");
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Unable to set password.", "error");
    } finally {
      setCreatingPassword(false);
    }
  };

  const handleLoginSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedId = idNumber.trim();
    if (!trimmedId) {
      showToast("Please enter your ID number.", "error");
      return;
    }
    if (!loginPassword.trim()) {
      showToast("Please enter your password.", "error");
      return;
    }

    setLoginLoading(true);
    try {
      const tokenValue = await loginViaApi(trimmedId, loginPassword.trim());
      login(tokenValue);
      showToast("Login successful.", "success");
      const redirectPath = (location.state as { from?: { pathname: string } } | null)?.from?.pathname ?? "/dashboard";
      navigate(redirectPath, { replace: true });
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Login failed.", "error");
    } finally {
      setLoginLoading(false);
    }
  };

  const renderVerificationSummary = useMemo(() => {
    if (!verification) {
      return null;
    }

    const items: Array<{ label: string; active: boolean }> = [
      { label: "Mobile Verified", active: Boolean(verification.isMobileNoVerify) },
      { label: "OTP Verified", active: verification.isOtpVerify === 1 },
      { label: "Password Set", active: verification.isPasswordSet === 1 },
    ];

    return (
      <div className="rounded-2xl border border-primary/20 bg-primary/5 px-5 py-4 text-sm text-primary">
        <p className="text-xs uppercase tracking-[0.18em] text-primary/70">ID NUMBER</p>
        <p className="text-lg font-semibold text-primary">{idNumber}</p>
        <p className="mt-3 text-sm font-medium text-primary/80">{verification.adminName}</p>
        {verification.adminMobileNo && (
          <p className="text-xs text-primary/60">Mobile: {formatMobileForDisplay(verification.adminMobileNo)}</p>
        )}
        <div className="mt-4 flex flex-wrap gap-2">
          {items.map((item) => (
            <StatusBadge key={item.label} label={item.label} active={item.active} />
          ))}
        </div>
      </div>
    );
  }, [verification, idNumber]);

  return (
    <div className="min-h-screen bg-white text-gray-900 lg:grid lg:grid-cols-[1.1fr_1fr]">
      <ArtworkPanel />
      <section className="flex items-center justify-center px-6 py-16 sm:px-12">
        <div className="w-full max-w-md space-y-12">
          <header className="space-y-4 text-left">
            <h1 className="text-4xl font-semibold text-[#070B68]">Login</h1>
            <p className="text-lg text-gray-500">
              {step === "verifyId"
                ? "Access your account to get started today."
                : step === "mobile"
                ? "Verify your registered mobile number."
                : step === "otp"
                ? "Enter the OTP sent to your mobile."
                : step === "setPassword"
                ? "Create your password to finish setup."
                : step === "success"
                ? "Your password has been set successfully."
                : "Sign in with your ID number and password."}
            </p>
          </header>

          {step === "verifyId" && (
            <form onSubmit={handleVerifySubmit} className="space-y-6">
              <InputField
                id="idNumber"
                label="ID Number / IQAMA Number"
                value={idNumber}
                onChange={(event) => setIdNumber(event.target.value)}
                placeholder="ID number / IQAMA number"
                hideLabel
                inputClassName="placeholder:text-[#A0A3BD]"
                autoFocus
              />
              <button
                type="submit"
                disabled={verifyLoading}
                className="w-full rounded-[18px] bg-[#070B68] py-4 text-lg font-semibold text-white shadow-[0_20px_40px_rgba(7,11,104,0.25)] transition hover:bg-[#030447] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#070B68]/60 disabled:cursor-not-allowed disabled:bg-[#070B68]/70"
              >
                {verifyLoading ? "Verifying..." : "Continue"}
              </button>
              <p className="text-center text-sm text-gray-500">
                Already verified?
                <button
                  type="button"
                  className="ml-2 font-semibold text-primary hover:underline"
                  onClick={() => goToStep("login")}
                >
                  Go to login
                </button>
              </p>
            </form>
          )}

          {step === "mobile" && (
            <form onSubmit={handleMobileSubmit} className="space-y-6">
              <InputField
                id="verified-id"
                label="ID Number / IQAMA Number"
                value={idNumber}
                placeholder="ID number / IQAMA number"
                readOnly
                hideLabel
                inputClassName="bg-[#F7F8FC] text-[#1F1F1F]"
              />
              <label className="block text-left">
                <span className="sr-only">Registered mobile number</span>
                <div className="flex overflow-hidden rounded-[18px] border border-[#E4E6EF] bg-white shadow-sm">
                  <select
                    value={mobileDialCode}
                    onChange={(event) => setMobileDialCode(event.target.value)}
                    className="bg-white px-4 text-sm font-medium text-[#070B68] focus:outline-none"
                  >
                    {countryOptions.map((option) => (
                      <option key={option.code} value={option.code}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <input
                    type="tel"
                    value={mobileLocalNumber}
                    onChange={(event) => setMobileLocalNumber(event.target.value.replace(/\D/g, ""))}
                    placeholder="987 772 299"
                    className="flex-1 border-l border-[#E4E6EF] px-5 py-4 text-base text-[#1F1F1F] placeholder:text-[#A0A3BD] focus:outline-none"
                  />
                </div>
              </label>
              <div className="flex items-center justify-between text-sm">
                <button
                  type="button"
                  className="font-semibold text-[#070B68] hover:underline"
                  onClick={() => goToStep("verifyId")}
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={mobileLoading || !mobileLocalNumber}
                  className="rounded-[18px] bg-[#070B68] px-8 py-3 text-sm font-semibold text-white shadow-[0_20px_40px_rgba(7,11,104,0.25)] transition hover:bg-[#030447] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#070B68]/60 disabled:cursor-not-allowed disabled:bg-[#070B68]/70"
                >
                  {mobileLoading ? "Sending..." : "Send OTP"}
                </button>
              </div>
            </form>
          )}

          {step === "otp" && (
            <div className="space-y-6">
              {renderVerificationSummary}
              <form onSubmit={handleOtpSubmit} className="space-y-6">
                <div className="space-y-3 text-sm text-gray-500">
                  <p>
                    Enter the 6-digit code sent to
                    <span className="ml-1 font-semibold text-primary">{mobileForOtp ? `+${mobileForOtp}` : " your mobile"}</span>.
                  </p>
                  <button
                    type="button"
                    className="text-sm font-semibold text-primary hover:underline"
                    onClick={() => showToast("OTP resend feature coming soon.", "info")}
                  >
                    Resend OTP
                  </button>
                </div>
                <OtpInputGroup
                  values={otpValues}
                  refs={otpRefs}
                  onChange={handleOtpChange}
                  onKeyDown={handleOtpKeyDown}
                  onPaste={handleOtpPaste}
                />
                <div className="flex items-center justify-between text-sm">
                  <button
                    type="button"
                    className="font-semibold text-primary hover:underline"
                    onClick={() => goToStep("mobile")}
                  >
                    Edit Mobile Number
                  </button>
                  <button
                    type="submit"
                    disabled={otpLoading}
                    className="rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white shadow transition hover:bg-[#030447] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 disabled:cursor-not-allowed disabled:bg-primary/70"
                  >
                    {otpLoading ? "Verifying..." : "Verify OTP"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {step === "setPassword" && (
            <div className="space-y-6">
              {renderVerificationSummary}
              <form onSubmit={handleSetPasswordSubmit} className="space-y-6">
                <InputField
                  id="new-password"
                  label="New Password"
                  type="password"
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                  autoFocus
                />
                <InputField
                  id="confirm-password"
                  label="Confirm Password"
                  type="password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                />
                <div className="flex items-center justify-between text-sm">
                  <button
                    type="button"
                    className="font-semibold text-primary hover:underline"
                    onClick={() => goToStep("otp")}
                  >
                    Back to OTP
                  </button>
                  <button
                    type="submit"
                    disabled={creatingPassword}
                    className="rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white shadow transition hover:bg-[#030447] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 disabled:cursor-not-allowed disabled:bg-primary/70"
                  >
                    {creatingPassword ? "Saving..." : "Set Password"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {step === "success" && (
            <div className="space-y-8">
              <div className="flex flex-col items-center gap-6 rounded-3xl border border-gray-200 bg-white px-8 py-12 shadow-[0_20px_60px_rgba(7,11,104,0.12)]">
                <div className="grid h-20 w-20 place-items-center rounded-full bg-primary text-white">
                  <CheckIcon />
                </div>
                <div className="space-y-2 text-center">
                  <h2 className="text-2xl font-semibold text-primary">Successfully Protected</h2>
                  <p className="text-sm text-gray-500">Your password has been set successfully.</p>
                </div>
                <button
                  type="button"
                  className="rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white shadow transition hover:bg-[#030447]"
                  onClick={() => goToStep("login")}
                >
                  Go to Login
                </button>
              </div>
            </div>
          )}

          {step === "login" && (
            <div className="space-y-6">
              {renderVerificationSummary}
              <form onSubmit={handleLoginSubmit} className="space-y-6">
                <InputField
                  id="login-id"
                  label="ID Number / IQAMA Number"
                  value={idNumber}
                  onChange={(event) => setIdNumber(event.target.value)}
                />
                <InputField
                  id="login-password"
                  label="Password"
                  type="password"
                  value={loginPassword}
                  onChange={(event) => setLoginPassword(event.target.value)}
                  autoFocus
                />
                <div className="flex items-center justify-between text-sm">
                  <button
                    type="button"
                    className="font-semibold text-primary hover:underline"
                    onClick={() => goToStep("verifyId")}
                  >
                    Verify ID again
                  </button>
                  <button type="button" className="font-semibold text-primary/60 hover:text-primary">
                    Forgot Password?
                  </button>
                </div>
                <button
                  type="submit"
                  disabled={loginLoading}
                  className="w-full rounded-xl bg-primary py-3.5 text-lg font-semibold text-white shadow-[0_20px_40px_rgba(7,11,104,0.25)] transition hover:bg-[#030447] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 disabled:cursor-not-allowed disabled:bg-primary/70"
                >
                  {loginLoading ? "Signing in..." : "Login"}
                </button>
              </form>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

const StatusBadge = ({ label, active }: { label: string; active: boolean }) => (
  <span
    className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${
      active
        ? "border-primary/30 bg-primary/10 text-primary"
        : "border-gray-200 bg-gray-100 text-gray-500"
    }`}
  >
    <span className={`h-2 w-2 rounded-full ${active ? "bg-primary" : "bg-gray-300"}`} />
    {label}
  </span>
);

type InputFieldProps = {
  label: string;
  id: string;
  hideLabel?: boolean;
  containerClassName?: string;
  inputClassName?: string;
} & InputHTMLAttributes<HTMLInputElement>;

const InputField = ({
  label,
  id,
  hideLabel = false,
  containerClassName = "",
  inputClassName = "",
  className = "",
  ...props
}: InputFieldProps) => (
  <label className={`block text-left ${containerClassName}`}>
    <span
      className={
        hideLabel
          ? "sr-only"
          : "mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-gray-400"
      }
    >
      {label}
    </span>
    <input
      id={id}
      {...props}
      className={
        `w-full rounded-[18px] border border-[#E4E6EF] bg-white px-6 py-4 text-base text-[#1F1F1F] placeholder:text-[#A0A3BD] shadow-[0_12px_40px_rgba(7,11,104,0.08)] outline-none transition focus:border-[#070B68] focus:ring-2 focus:ring-[#070B68]/15 disabled:cursor-not-allowed disabled:bg-[#F4F5F9] disabled:text-[#A0A3BD] ${className} ${inputClassName}`
      }
    />
  </label>
);

const OtpInputGroup = ({
  values,
  refs,
  onChange,
  onKeyDown,
  onPaste,
}: {
  values: string[];
  refs: MutableRefObject<Array<HTMLInputElement | null>>;
  onChange: (index: number, value: string) => void;
  onKeyDown: (index: number, event: KeyboardEvent<HTMLInputElement>) => void;
  onPaste: (event: ClipboardEvent<HTMLInputElement>) => void;
}) => (
  <div className="flex items-center justify-between gap-2">
    {values.map((value, index) => (
      <input
        key={`otp-${index}`}
        ref={(input) => {
          refs.current[index] = input;
        }}
        value={value}
        onChange={(event) => onChange(index, event.target.value)}
        onKeyDown={(event) => onKeyDown(index, event)}
        onPaste={onPaste}
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        maxLength={1}
        autoComplete="one-time-code"
        className="h-14 w-14 rounded-xl border border-gray-200 bg-white text-center text-2xl font-semibold tracking-widest text-primary shadow-sm transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15"
      />
    ))}
  </div>
);

const ArtworkPanel = () => (
  <section className="relative hidden overflow-hidden lg:flex">
    <img src={leftPanelImg} alt="Salwa graphic" className="absolute inset-0 h-full w-full object-cover" />
    <div className="absolute inset-0 bg-[#03024C]/70" />
    <div className="relative z-10 flex h-full w-full flex-col items-center justify-between px-12 py-16 text-white">
      <div className="flex flex-1 flex-col items-center justify-center gap-6 text-center">
        <img src="/theme-icons/salwa_icon.svg" alt="Salwa" className="h-24 w-24" />
        <div className="space-y-3">
          <h2 className="text-5xl font-semibold text-[#2ED3C6]">Salwa</h2>
          <p className="text-lg text-[#2ED3C6]">Towards a Comprehensive Healthcare Future</p>
        </div>
        <div className="mt-6 flex flex-col items-center gap-3 text-xs font-semibold uppercase tracking-[0.28em] text-white/80">
          <span className="flex items-center gap-2 rounded-full border border-white/40 px-5 py-2">
            <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 fill-current"><path d="M2 3.5v17l14-8.5L2 3.5Zm16.5 4.28-1.36.78 1.36.78 3.5-2.06-3.5-2.06ZM17.14 12l-1.64.99 1.64.99 3.36-2.02L17.14 12ZM15.5 16.22l1.36.78 3.5-2.06-1.36-.78-3.5 2.06Z"/></svg>
            Download it from Google Play
          </span>
          <span className="flex items-center gap-2 rounded-full border border-white/40 px-5 py-2">
            <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 fill-current"><path d="M16.365 1.43c0 1.14-.422 2.072-1.267 2.795-.845.723-1.886 1.14-3.125 1.25-.02-.124-.03-.31-.03-.56 0-1.09.39-2.023 1.172-2.8.78-.78 1.77-1.172 2.97-1.172.025 0 .072.012.14.03.027.006.053.01.07.01.046.004.086.006.12.006zM21.2 17.25c-.3.91-.7 1.755-1.2 2.53-.67 1.07-1.215 1.812-1.64 2.23-.65.68-1.35 1.032-2.11 1.06-.54 0-1.195-.154-1.96-.47-.77-.312-1.477-.47-2.12-.47-.66 0-1.387.158-2.18.47-.792.316-1.43.48-1.91.49-.73.03-1.44-.32-2.13-1.05-.45-.43-1.02-1.2-1.72-2.31-.74-1.16-1.35-2.503-1.82-4.03-.51-1.66-.77-3.26-.77-4.8 0-1.77.38-3.3 1.16-4.58.57-.98 1.33-1.75 2.28-2.31.95-.55 1.98-.84 3.08-.86.61 0 1.41.18 2.38.53.97.35 1.6.53 1.9.53.26 0 .93-.2 2.02-.6.99-.35 1.83-.5 2.5-.46 1.85.15 3.25.88 4.2 2.19-1.66 1.01-2.49 2.43-2.49 4.28 0 1.43.52 2.62 1.55 3.55.46.45.98.8 1.57 1.06-.13.2-.27.4-.4.61z"/></svg>
            Download it from App Store
          </span>
        </div>
      </div>
      <p className="text-xs text-white/70">Copyright © 2025 Bridge Health Business Service. All Rights Reserved.</p>
    </div>
  </section>
);

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="h-10 w-10">
    <path fill="currentColor" d="M20.6 31.2 15 25.6l2.8-2.8 2.8 2.8L30.2 16l2.8 2.8Z" />
  </svg>
);

export default Login;


