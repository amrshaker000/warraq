import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, User, Lock } from "lucide-react";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Card from "../components/ui/Card";
import {
  login,
  loginStart,
  loginFailure,
  authenticateUser,
  generateToken,
} from "../slices/authSlice";
import { useToastContext } from "../hooks/useToastContext";
import { useTheme } from "../hooks/useTheme";

interface LoginFormData {
  username: string;
  password: string;
}

const Login: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { success, error: showError } = useToastContext();
  const [showPassword, setShowPassword] = useState(false);
  const { theme } = useTheme();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginFormData>({
    mode: 'onChange',
  });

  const onSubmit = async (data: LoginFormData) => {
    console.log("🚀 Login form submitted with data:", data);
    console.log("📋 Form validation state:", {
      isValid: Object.keys(errors).length === 0,
      errors,
      isFormValid: isValid
    });

    dispatch(loginStart());

    try {
      // التحقق من صحة بيانات تسجيل الدخول
      const user = authenticateUser(data.username, data.password);

      if (user) {
        // إنشاء توكن فريد للمستخدم
        const token = generateToken(user.username);

        // تسجيل الدخول بنجاح
        dispatch(login({ token, user }));
        console.log("✅ Login successful for user:", user.username);
        success(
          t("messages.loginSuccessTitle"),
          t("messages.loginSuccessMessage"),
        );
        navigate("/home");
      } else {
        dispatch(loginFailure(t("messages.loginInvalid")));
        console.warn("❌ Invalid login attempt for username:", data.username);
        showError(t("messages.errorOccurred"), t("messages.loginInvalid"));
      }
    } catch (error) {
      console.error("❌ Login error:", error);
      dispatch(loginFailure(t("messages.loginFailed")));
      showError(t("messages.errorOccurred"), t("messages.loginFailed"));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark-background-primary py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <img
            src={theme === "dark" ? "/Gold logo.png" : "/colourfull logo.png"}
            alt="party-logo"
            className="mx-auto mb-6 drop-shadow-lg h-40 w-40 sm:h-56 sm:w-56 lg:h-72 lg:w-72 object-contain"
          />
          <h2 className="text-3xl font-bold text-gray-900 dark:text-dark-text-primary text-center">
            {t("app.title")}
          </h2>
        </div>

        {/* Login Form */}
        <Card className="w-full">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Input
              label={t("common.username")}
              type="text"
              placeholder={t("common.username")}
              leftIcon={
                <div className="p-1.5 rounded-lg bg-red-50 dark:bg-red-900/30">
                  <User className="h-5 w-5 text-red-600 dark:text-red-400" />
                </div>
              }
              fullWidth
              {...register("username", {
                required: t("forms.validation.required"),
                minLength: {
                  value: 3,
                  message: t("forms.validation.minLength", { min: 3 }),
                },
              })}
              error={errors.username?.message}
            />

            <Input
              label={t("common.password")}
              type={showPassword ? "text" : "password"}
              placeholder={t("common.password")}
              leftIcon={
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setShowPassword(!showPassword);
                    }}
                    className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                  <div className="w-px h-4 bg-gray-300 dark:bg-gray-600"></div>
                  <div className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/30">
                    <Lock className="h-4 w-4 text-primary-600 dark:text-primary-400" />
                  </div>
                </div>
              }
              fullWidth
              {...register("password", {
                required: t("forms.validation.required"),
                minLength: {
                  value: 6,
                  message: t("forms.validation.minLength", { min: 6 }),
                },
              })}
              error={errors.password?.message}
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              leftIcon={<Lock className="h-5 w-5" />}
            >
              {t("app.login")}
            </Button>
          </form>
        </Card>

        {/* Footer */}
        <div className="text-center">
          <p className="text-sm text-gray-600 dark:text-dark-text-muted text-center">
            {t("footer.copyright")} {t("footer.partyName")}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
