// Test page to debug authentication issues
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import { login, logout } from "../slices/authSlice";
import { authenticateUser, generateToken } from "../slices/authSlice";

const DebugAuth: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const auth = useSelector(
    (state: { auth: { token: string | null; isAuthenticated: boolean } }) =>
      state.auth,
  );

  const [debugInfo, setDebugInfo] = useState<{
    localStorage: { token: string | null; hasToken: boolean };
    currentURL: string;
    pathname: string;
    authState: typeof auth;
    environment: { NODE_ENV?: string; DEV?: boolean };
  }>({
    localStorage: { token: null, hasToken: false },
    currentURL: "",
    pathname: "",
    authState: auth,
    environment: {},
  });

  useEffect(() => {
    // Collect debug information
    const info = {
      localStorage: {
        token: localStorage.getItem("token"),
        hasToken: !!localStorage.getItem("token"),
      },
      currentURL: window.location.href,
      pathname: window.location.pathname,
      authState: auth,
      environment: {
        NODE_ENV: import.meta.env.NODE_ENV,
        DEV: import.meta.env.DEV,
      },
    };
    setDebugInfo(info);
    console.log("🔍 Debug Info:", info);
  }, [auth]);

  const handleAutoLogin = () => {
    const user = authenticateUser("Hawary", "Alfa404");
    if (user) {
      const token = generateToken(user.username);
      dispatch(login({ token, user }));
    }
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleGoHome = () => {
    navigate("/home");
  };

  const handleGoLogin = () => {
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <Card className="max-w-4xl mx-auto">
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-6">
            🔍 Authentication Debug Page
          </h1>

          <div className="space-y-6">
            {/* Current State */}
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <h2 className="text-lg font-semibold mb-3">Current State</h2>
              <pre className="text-sm overflow-x-auto">
                {JSON.stringify(debugInfo, null, 2)}
              </pre>
            </div>

            {/* Auth Controls */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button
                onClick={handleAutoLogin}
                variant="primary"
                className="w-full"
              >
                🔑 Auto Login (Debug)
              </Button>

              <Button
                onClick={handleLogout}
                variant="secondary"
                className="w-full"
              >
                🚪 Logout
              </Button>

              <Button
                onClick={handleGoHome}
                variant="outline"
                className="w-full"
              >
                🏠 Go to Home
              </Button>

              <Button
                onClick={handleGoLogin}
                variant="outline"
                className="w-full"
              >
                🔐 Go to Login
              </Button>
            </div>

            {/* Instructions */}
            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">📋 Instructions:</h3>
              <ol className="list-decimal list-inside space-y-1 text-sm">
                <li>
                  Check the debug info above to see current authentication state
                </li>
                <li>Click "Auto Login" to simulate authentication</li>
                <li>Try navigating to different pages to test routing</li>
                <li>Use browser dev tools to check localStorage changes</li>
              </ol>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default DebugAuth;
