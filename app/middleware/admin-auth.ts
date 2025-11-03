import { redirect, type MiddlewareFunction } from "react-router";
import { authenticate, setUserContext } from "./common";

/**
 * Admin authentication middleware for admin pages
 * Supports two authentication methods:
 * 1. Header authentication (preferred) - uses ADMIN_AUTH_HEADER and ADMIN_AUTH_SECRET
 * 2. Session authentication (fallback) - uses session from Cookie
 * 
 * Redirects to /unauthorized page on authentication failure
 */
export const adminAuthMiddleware: MiddlewareFunction = async ({
  request,
  context,
}) => {
  // Execute common authentication logic
  const authResult = await authenticate(request, context);

  if (!authResult.success) {
    // Authentication failed, redirect to unauthorized page
    throw redirect("/unauthorized");
  }

  // Verify user is admin (Header auth automatically is admin, session auth needs check)
  if (authResult.user.role !== "admin") {
    // Non-admin user, redirect to unauthorized page
    throw redirect("/unauthorized");
  }

  // Authentication successful, set user context
  setUserContext(context, authResult.user);
};
