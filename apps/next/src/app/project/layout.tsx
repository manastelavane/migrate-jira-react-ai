import { ProjectSidebar } from "@/components/layout/project-sidebar";

export default function ProjectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full h-full flex overflow-hidden">
      <ProjectSidebar />
      <main id="content" className="flex-1 overflow-auto bg-white">
        {children}
      </main>
    </div>
  );
}
