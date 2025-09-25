"use client";

import Link from "next/link";
import Image from "next/image";
import { signOut } from "@/auth";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn, getInitials } from "@/lib/utils";
import { Session } from "next-auth";
import { usePathname } from "next/navigation";
import { logOut } from "@/lib/admin/actions/auth";

const Header = ({
  session,
  isAdmin,
}: {
  session: Session;
  isAdmin: boolean;
}) => {
  const pathname = usePathname();

  return (
    <header className="my-10 flex items-center justify-between gap-5 w-full">
      <div className="flex gap-3 items-center">
        <Image src="/icons/logo.svg" alt="logo" width={40} height={32} />
        <p className="text-[28px] text-white font-semibold hidden lg:block">
          BookWise
        </p>
      </div>

      <ul className="flex flex-row items-center gap-0 sm:gap-3">
        {isAdmin && (
          <li>
            <Link href="/admin">
              <Button
                variant="link"
                className="text-sm sm:text-lg text-blue-100"
              >
                Admin Panel
              </Button>
            </Link>
          </li>
        )}
        <li>
          <Link href="/">
            <Button
              variant="link"
              className={cn(
                "text-sm sm:text-lg",
                pathname === "/" ? "text-primary" : "text-white",
              )}
            >
              Home
            </Button>
          </Link>
        </li>
        <li>
          <Link href="/search">
            <Button
              variant="link"
              className={cn(
                "text-sm sm:text-lg",
                pathname === "/search" ? "text-primary" : "text-white",
              )}
            >
              Search
            </Button>
          </Link>
        </li>
        <li className="px-3">
          <Link href="/my-profile">
            <Avatar>
              <AvatarFallback
                className={cn(
                  "hover:bg-primary",
                  pathname === "/my-profile" ? "bg-primary" : "bg-light-100",
                )}
              >
                <span className="font-serif font-semibold text-sm">
                  {getInitials(session?.user?.name || "IN")}
                </span>
              </AvatarFallback>
            </Avatar>
          </Link>
        </li>
        <li>
          <form action={logOut}>
            <Button variant="link" className="text-sm text-white sm:text-lg">
              Logout
            </Button>
          </form>
        </li>
      </ul>
    </header>
  );
};
export default Header;
