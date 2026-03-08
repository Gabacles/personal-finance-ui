"use client";

// Re-export the hook from the provider so the auth module has a single
// import point, keeping the rest of the app decoupled from the provider path.
export { useAuth } from "@/providers/AuthProvider";
