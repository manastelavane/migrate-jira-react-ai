"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ROUTES } from "@/config";
import { NavbarLeft } from "./navbar-left";
import { useProjectQuery } from "@/hooks/use-project-query";

const sidebarLinks = [
  { name: "Kanban Board", url: ROUTES.BOARD, icon: "board" },
  { name: "Project Settings", url: ROUTES.SETTINGS, icon: "cog" },
  { name: "Releases", url: null, icon: "ship" },
  { name: "Issues and filters", url: null, icon: "filters" },
  { name: "Pages", url: null, icon: "page" },
  { name: "Reports", url: null, icon: "report" },
  { name: "Components", url: null, icon: "component" },
] as const;

function SidebarIcon({ name }: { name: (typeof sidebarLinks)[number]["icon"] }) {
  if (name === "board") {
    return (
      <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current" aria-hidden="true">
        <path d="M4 18h16.008C20 18 20 6 20 6H3.992C4 6 4 18 4 18zM2 5.994C2 4.893 2.898 4 3.99 4h16.02C21.108 4 22 4.895 22 5.994v12.012A1.997 1.997 0 0120.01 20H3.99A1.994 1.994 0 012 18.006V5.994z" />
        <path d="M8 6v12h2V6zm6 0v12h2V6z" />
      </svg>
    );
  }

  if (name === "cog") {
    return (
      <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current" aria-hidden="true">
        <path d="M11.701 16.7a5.002 5.002 0 110-10.003 5.002 5.002 0 010 10.004m8.368-3.117a1.995 1.995 0 01-1.346-1.885c0-.876.563-1.613 1.345-1.885a.48.48 0 00.315-.574 8.947 8.947 0 00-.836-1.993.477.477 0 00-.598-.195 2.04 2.04 0 01-1.29.08 1.988 1.988 0 01-1.404-1.395 2.04 2.04 0 01.076-1.297.478.478 0 00-.196-.597 8.98 8.98 0 00-1.975-.826.479.479 0 00-.574.314 1.995 1.995 0 01-1.885 1.346 1.994 1.994 0 01-1.884-1.345.482.482 0 00-.575-.315c-.708.2-1.379.485-2.004.842a.47.47 0 00-.198.582A2.002 2.002 0 014.445 7.06a.478.478 0 00-.595.196 8.946 8.946 0 00-.833 1.994.48.48 0 00.308.572 1.995 1.995 0 011.323 1.877c0 .867-.552 1.599-1.324 1.877a.479.479 0 00-.308.57 8.99 8.99 0 00.723 1.79.477.477 0 00.624.194c.595-.273 1.343-.264 2.104.238.117.077.225.185.302.3.527.8.512 1.58.198 2.188a.473.473 0 00.168.628 8.946 8.946 0 002.11.897.474.474 0 00.57-.313 1.995 1.995 0 011.886-1.353c.878 0 1.618.567 1.887 1.353a.475.475 0 00.57.313 8.964 8.964 0 002.084-.883.473.473 0 00.167-.631c-.318-.608-.337-1.393.191-2.195.077-.116.185-.225.302-.302.772-.511 1.527-.513 2.125-.23a.477.477 0 00.628-.19 8.925 8.925 0 00.728-1.793.478.478 0 00-.314-.573" />
      </svg>
    );
  }

  if (name === "ship") {
    return (
      <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current" aria-hidden="true">
        <path d="M6 12h8v-2H6v2zM4 8.99C4 8.445 4.456 8 5.002 8h9.996C15.55 8 16 8.451 16 8.99V14H4V8.99zM6 7.005C6 5.898 6.898 5 7.998 5h2.004C11.106 5 12 5.894 12 7.005V10H6V7.005zm4 0V7H7.999c.005 0 .002.003.002.005V8h2v-.995zM4.5 17h13.994l1.002-3H4.14l.36 3zm-2.495-4.012A.862.862 0 012.883 12h18.393c.55 0 .857.417.681.944l-1.707 5.112c-.174.521-.758.944-1.315.944H3.725a1.149 1.149 0 01-1.118-.988l-.602-5.024z" />
      </svg>
    );
  }

  if (name === "filters") {
    return (
      <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current" aria-hidden="true">
        <path d="M5 12.991c0 .007 14.005.009 14.005.009C18.999 13 19 5.009 19 5.009 19 5.002 4.995 5 4.995 5 5.001 5 5 12.991 5 12.991zM3 5.01C3 3.899 3.893 3 4.995 3h14.01C20.107 3 21 3.902 21 5.009v7.982c0 1.11-.893 2.009-1.995 2.009H4.995A2.004 2.004 0 013 12.991V5.01zM19 19c-.005 1.105-.9 2-2.006 2H7.006A2.009 2.009 0 015 19h14zm1-3a2.002 2.002 0 01-1.994 2H5.994A2.003 2.003 0 014 16h16z" />
        <path d="M10.674 11.331c.36.36.941.36 1.3 0l2.758-2.763a.92.92 0 00-1.301-1.298l-2.108 2.11-.755-.754a.92.92 0 00-1.3 1.3l1.406 1.405z" />
      </svg>
    );
  }

  if (name === "page") {
    return (
      <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current" aria-hidden="true">
        <path d="M8 6h8a1 1 0 010 2H8a1 1 0 010-2zm0 3h8a1 1 0 010 2H8a1 1 0 010-2zm0 3h4a1 1 0 010 2H8a1 1 0 010-2z" />
        <path d="M7 4v16h10V4H7zm-2-.01C5 2.892 5.897 2 7.006 2h9.988C18.102 2 19 2.898 19 3.99v16.02c0 1.099-.897 1.99-2.006 1.99H7.006A2.003 2.003 0 015 20.01V3.99z" />
      </svg>
    );
  }

  if (name === "report") {
    return (
      <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current" aria-hidden="true">
        <path d="M21 17H4.995C4.448 17 4 16.548 4 15.991V6a1 1 0 10-2 0v9.991A3.004 3.004 0 004.995 19H21a1 1 0 000-2zm-3-8v3a1 1 0 002 0V8a1 1 0 00-1-1h-4a1 1 0 000 2h3z" />
        <path d="M13.293 13.707a1 1 0 001.414 0l4-4a1 1 0 10-1.414-1.414L14 11.586l-2.293-2.293a1 1 0 00-1.414 0l-4 4a1 1 0 001.414 1.414L11 11.414l2.293 2.293z" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current" aria-hidden="true">
      <path d="M5 17.991c0 .007 14.005.009 14.005.009-.006 0-.005-7.991-.005-7.991C19 10.002 4.995 10 4.995 10 5.001 10 5 17.991 5 17.991zM3 10.01C3 8.899 3.893 8 4.995 8h14.01C20.107 8 21 8.902 21 10.009v7.982c0 1.11-.893 2.009-1.995 2.009H4.995A2.004 2.004 0 013 17.991V10.01z" />
      <path d="M7 8.335c0-.002 2.002-.002 2.002-.002C9 8.333 9 6.665 9 6.665c0 .002-2.002.002-2.002.002C7 6.667 7 8.335 7 8.335zm-2-1.67C5 5.745 5.898 5 6.998 5h2.004C10.106 5 11 5.749 11 6.665v1.67C11 9.255 10.102 10 9.002 10H6.998C5.894 10 5 9.251 5 8.335v-1.67zm10 1.67c0-.002 2.002-.002 2.002-.002C17 8.333 17 6.665 17 6.665c0 .002-2.002.002-2.002.002.002 0 .002 1.668.002 1.668zm-2-1.67C13 5.745 13.898 5 14.998 5h2.004C18.106 5 19 5.749 19 6.665v1.67c0 .92-.898 1.665-1.998 1.665h-2.004C13.894 10 13 9.251 13 8.335v-1.67z" />
    </svg>
  );
}

export function ProjectSidebar() {
  const pathname = usePathname();
  const { data: project } = useProjectQuery();

  return (
    <div className="flex h-full shrink-0">
      <NavbarLeft />

      <div className="w-[240px] h-full bg-[#f4f5f7] relative">
        <div className="h-full absolute top-0 left-0 w-full min-w-[240px] overflow-x-hidden px-4">
          <div className="flex px-1 py-6">
          <img
            src="https://res.cloudinary.com/dvujyxh7e/image/upload/c_scale,w_256/v1593097745/angular-vietnam-transparent_iwfwxa.png"
            alt="Project"
            title="Angular Vietnam"
            className="w-[45px] h-[45px] rounded-none"
          />
            <div className="pl-2">
              <div className="font-medium text-[#172b4d] text-[15px]">
                {project?.name ?? "Jira Clone"}
              </div>
              <div className="text-[#5e6c84] text-[13px]">{project?.category ?? "Software"} Project</div>
            </div>
          </div>

          <nav className="py-0 overflow-y-auto">
            {sidebarLinks.map((link, idx) => {
              const isActive = link.url ? pathname.startsWith(link.url) : false;

              if (!link.url) {
                return (
                  <div key={link.name}>
                    {idx === 2 ? <div className="mt-4 pt-4 border-t-2 border-[#dfe1e6]" /> : null}
                    <div className="relative flex items-center py-2 px-3 rounded-sm text-[#172b4d] cursor-not-allowed group">
                      <span className="mr-4">
                        <SidebarIcon name={link.icon} />
                      </span>
                      <span className="pt-px text-[15px]">{link.name}</span>
                      <span className="absolute top-[7px] left-10 w-[140px] py-[5px] pl-2 rounded-sm bg-[#dfe1e6] text-[#172b4d] opacity-0 uppercase text-xs font-bold group-hover:opacity-100">
                        Not implemented
                      </span>
                    </div>
                  </div>
                );
              }

              return (
                <Link
                  key={link.name}
                  href={link.url}
                  className={`flex items-center relative py-2 px-3 rounded-sm text-[15px] ${
                    isActive ? "text-[#0052cc] bg-[#ebecf0]" : "text-[#172b4d] hover:bg-[#ebecf0]"
                  }`}
                >
                  <span className="mr-4">
                    <SidebarIcon name={link.icon} />
                  </span>
                  <span className="pt-px">{link.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
}
