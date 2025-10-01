import React from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../store";

interface PermissionGuardProps {
  children: React.ReactNode;
  permissions?: string[];
  requireAll?: boolean; // إذا كان true، يحتاج المستخدم لجميع الصلاحيات، إذا كان false، يحتاج لواحدة فقط
  fallback?: React.ReactNode;
}

const PermissionGuard: React.FC<PermissionGuardProps> = ({
  children,
  permissions = [],
  requireAll = false,
  fallback = null,
}) => {
  const { user } = useSelector((state: RootState) => state.auth);

  if (!user) {
    return <>{fallback}</>;
  }

  // إذا لم تكن هناك صلاحيات مطلوبة، اعرض المحتوى
  if (permissions.length === 0) {
    return <>{children}</>;
  }

  // التحقق من الصلاحيات
  const hasPermission = requireAll
    ? permissions.every((permission) => user.permissions.includes(permission))
    : permissions.some((permission) => user.permissions.includes(permission));

  return hasPermission ? <>{children}</> : <>{fallback}</>;
};

export default PermissionGuard;
