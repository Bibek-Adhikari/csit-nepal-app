const ADMIN_KEY = process.env.ADMIN_KEY || "";

export function validateAdminRequest(request: Request): boolean {
  const key = request.headers.get("x-admin-key") || "";
  if (key && key === ADMIN_KEY) return true;

  const cookieStr = request.headers.get("cookie") || "";
  const match = cookieStr.match(/(?:^|;\s*)admin_session=([^;]+)/);
  if (match && decodeURIComponent(match[1]) === ADMIN_KEY) return true;

  return false;
}
