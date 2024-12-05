import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logoutUser } from "../features/auth/authSlice";
import { verifyAdminOTP, loginUser } from "../features/auth/authActions";
import { resetSuccess, resetError } from "../features/auth/authSlice";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
// import AutographLogo from "../assets/images/autograghLogo.png";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { handleGoogleLogin } from "../features/auth/authActions";
import { setCredentials } from "../features/auth/authSlice";

const Login = () => {
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [showPassword, setShowPassword] = useState(false);
  const [googleError, setGoogleError] = useState(null);
  const [formError, setFormError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const { userInfo, error, isOtpRequired, tempUserId } = useSelector(
    (state) => state.auth
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") return;
    setOpenSnackbar(false);
  };

  useEffect(() => {
    if (userInfo && (!userInfo.role === "admin" || !isOtpRequired)) {
      const timer = setTimeout(() => {
        navigate(userInfo.role === "admin" ? "/Admin/DashBoard" : "/");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [userInfo, isOtpRequired, navigate]);

  const onSubmit = async (data) => {
    setIsLoading(true);
    setFormError(null);

    try {
      const result = await dispatch(loginUser(data)).unwrap();

      if (result.requireOTP) {
        setFormError({
          type: "info",
          message: "OTP sent to your email. Please verify.",
        });
      } else {
        reset();
        navigate(result.user.role === "admin" ? "/Admin/DashBoard" : "/");
      }
    } catch (err) {
      setFormError({
        type: "error",
        message: err.message || "Login failed. Please check your credentials.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = (otp) => {
    if (!tempUserId) {
      setSnackbarMessage("User ID not found. Please try logging in again.");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      dispatch(resetError());
      return;
    }

    dispatch(verifyAdminOTP({ userId: tempUserId, otp }))
      .unwrap()
      .then((response) => {
        setSnackbarMessage("OTP verified successfully!");
        setSnackbarSeverity("success");
        setOpenSnackbar(true);
        dispatch(resetSuccess());
      })
      .catch((error) => {
        setSnackbarMessage(error || "OTP verification failed");
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
      });
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setIsGoogleLoading(true);
    setGoogleError(null);

    try {
      const response = await handleGoogleLogin(credentialResponse.credential);
      // Check if response contains an error message
      if (response.error) {
        setGoogleError({
          type: "error",
          message: response.message || "Google login failed",
        });
        // Show the error in Snackbar
        setSnackbarMessage(response.message || "Google login failed");
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
        return;
      }

      dispatch(setCredentials(response));
      navigate(response.user.role === "admin" ? "/Admin/DashBoard" : "/");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || "Google login failed";
      setGoogleError({
        type: "error",
        message: errorMessage,
      });
      // Show the error in Snackbar
      setSnackbarMessage(errorMessage);
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleGoogleError = (error) => {
    console.error("Google Sign-In Error:", error);
    let errorMessage = "Google Sign-In failed. ";

    if (error.error === "origin_mismatch") {
      errorMessage +=
        "The app's domain is not authorized in Google Cloud Console.";
    } else if (error.error === "popup_closed_by_user") {
      errorMessage += "Sign-in window was closed.";
    } else if (error.error === "access_denied") {
      errorMessage += "Access was denied.";
    } else {
      errorMessage += "Please try again later.";
    }

    setGoogleError({
      type: "error",
      message: errorMessage,
    });
  };

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
          <div className="text-center">
            {/* <img src={AutographLogo} alt="Autograph Logo" /> */}
            <p className="mt-2 font-bold text-lg text-gray-600">
              Sign in to your account
            </p>
          </div>

          {!isOtpRequired ? (
            <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="email" className="sr-only">
                    Email address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      {...register("email", {
                        required: "Email is required",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Invalid email address",
                        },
                      })}
                      id="email"
                      type="email"
                      autoComplete="email"
                      className="appearance-none relative block w-full px-3 py-3 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-btColour focus:border-btColour focus:z-10 sm:text-sm"
                      placeholder="Email address"
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="password" className="sr-only">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      {...register("password", {
                        required: "Password is required",
                        minLength: {
                          value: 6,
                          message: "Password must be at least 6 characters",
                        },
                      })}
                      id="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      className="appearance-none relative block w-full px-3 py-3 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-btColour focus:border-btColour focus:z-10 sm:text-sm"
                      placeholder="Password"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.password.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <Link
                    to="/signup"
                    className="font-medium text-btColour hover:text-blue-500"
                  >
                    Don't have an account?
                  </Link>
                </div>
                <div className="text-sm">
                  <Link
                    to="/ForgotPassword"
                    className="font-medium text-btColour hover:text-blue-500"
                  >
                    Forgot your password?
                  </Link>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-red-500 to-NavClr hover:bg-gradient-to-bl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-btColour transition-all duration-200 ease-in-out "
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin" />
                  ) : (
                    "Sign in"
                  )}
                </button>
              </div>

              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Or continue with
                </span>
              </div>

              <div className="mt-6">
                <div className="w-full flex justify-center">
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={handleGoogleError}
                    useOneTap
                    disabled={isGoogleLoading}
                    theme="outline"
                    shape="rectangular"
                    locale="en"
                  />
                </div>
                {isGoogleLoading && (
                  <div className="flex justify-center mt-4">
                    <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
              </div>
            </form>
          ) : (
            <OtpVerification onSubmit={handleOtpSubmit} />
          )}
        </div>

        <Snackbar
          open={openSnackbar}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
        >
          <MuiAlert
            onClose={handleCloseSnackbar}
            severity={snackbarSeverity}
            sx={{ width: "100%" }}
          >
            {snackbarMessage}
          </MuiAlert>
        </Snackbar>
      </div>
    </GoogleOAuthProvider>
  );
};

export default Login;

const OtpVerification = ({ onSubmit }) => {
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (otp.length !== 6) {
      setOtpError("OTP must be 6 characters long");
      return;
    }
    setOtpError("");
    onSubmit(otp);
  };

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
      <div>
        <label
          htmlFor="otp"
          className="block text-sm font-medium text-gray-700"
        >
          Enter OTP
        </label>
        <div className="mt-1">
          <input
            type="text"
            id="otp"
            maxLength={6}
            className="appearance-none block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-btColour focus:border-btColour sm:text-sm"
            placeholder="Enter 6-digit OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />
          {otpError && <p className="mt-2 text-sm text-red-600">{otpError}</p>}
        </div>
      </div>
      <div>
        <button
          type="submit"
          className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-red-500 to-NavClr hover:bg-gradient-to-bl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-btColour transition-all duration-200 ease-in-out "
        >
          Verify OTP
        </button>
      </div>
    </form>
  );
};
