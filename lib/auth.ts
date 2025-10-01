import type { User, UserRole } from "@/types"

const PERMISSIONS = {
  admin: [
    "view_buying_price",
    "edit_batches",
    "delete_batches",
    "create_batches",
    "view_profit",
    "override_locks",
    "manage_users",
    "view_all_bookings",
    "confirm_sales",
    "system_settings",
  ],
  manager: ["view_tickets", "create_bookings", "confirm_sales", "view_all_bookings"],
  staff: ["view_tickets", "create_bookings", "partial_payments"],
}

export function hasPermission(user: User | null, permission: string): boolean {
  if (!user) return false
  return PERMISSIONS[user.role]?.includes(permission) || false
}

export function isRole(user: User | null, role: UserRole): boolean {
  return user?.role === role
}
