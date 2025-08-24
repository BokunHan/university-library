import React from "react";
import { Session } from "next-auth";
import Link from "next/link";

const Header = ({ session }: { session: Session }) => {
  return (
    <header className="admin-header">
      <div>
        <h2 className="text-2xl font-semibold text-dark-400">
          Welcome, {session?.user?.name}
        </h2>
        <p className="text-base text-slate-500">
          Monitor all of your users and books here.
        </p>
      </div>
      <div>
        <Link href="/">
          <button className="view-btn">Back to Overview</button>
        </Link>
      </div>
    </header>
  );
};
export default Header;
