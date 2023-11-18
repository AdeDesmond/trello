import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import localfont from "next/font/local";

const headingFont = localfont({
  src: "../public/font.woff2",
});

export const Logo = () => {
  return (
    <Link href={"/"}>
      <div className="hover:opacity-75 transition items-center gap-x-2 hidden md:flex">
        <Image src={"/logo.svg"} alt="logo" height={30} width={30} />
        <p
          className={cn("text-l text-neutral-700 pb-1", headingFont.className)}
        >
          Taskify
        </p>
      </div>
    </Link>
  );
};
