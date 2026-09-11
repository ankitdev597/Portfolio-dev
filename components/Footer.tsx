import { profile } from "@/data/profile";

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.08] px-4 py-8 text-center text-xs text-muted sm:px-6 lg:px-8">
      © {new Date().getFullYear()} {profile.fullName}. All rights reserved.
    </footer>
  );
}
