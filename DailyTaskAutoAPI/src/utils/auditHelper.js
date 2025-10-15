
export function attachAuditContext(doc, req) {
  if (!doc || !req) return;
  // Prefer an authenticated identifier (jwt subject or user id), fallback to "unknown"
  doc._performedBy =
    (req.user && (req.user.id || req.user._id || req.user.email)) ||
    req.userId ||
    "unknown";
  doc._ip = req.ip || req.headers["x-forwarded-for"] || "unknown";
  doc._userAgent =
    (req.headers && (req.headers["user-agent"] || req.headers["User-Agent"])) ||
    undefined;
}
