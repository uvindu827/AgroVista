// Centralized role normalization and display helpers
export function normalizeRole(role) {
  if (!role) return "";
  const r = String(role).toLowerCase().trim();
  if (r.includes("inspect") || r.includes("agri")) return "agricultural inspector";
  if (r.includes("tool") && r.includes("dealer")) return "tool dealer";
  if (r.includes("admin")) return "admin";
  if (r === "buyer") return "buyer";
  if (r === "farmer") return "farmer";
  if (r === "customer") return "customer";
  // fallback to raw lowercased value
  return r;
}

export function prettyRole(role) {
  const norm = normalizeRole(role);
  if (!norm) return "";
  // title-case each word for display
  return norm
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

const RoleUtils = { normalizeRole, prettyRole };
export default RoleUtils;
