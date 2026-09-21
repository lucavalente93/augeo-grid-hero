// This is a file with a demo for your component
// That's what users will see in the preview
// Create new files in this directory to add more demos

import KineticMatrix from "@/components/ui/kinetic-matrix";

// ONLY DEFAULT EXPORT WILL BE TREATED AS A DEMO
export default function DemoOne() {
  return (
    <div className="flex min-h-dvh w-full items-center justify-center bg-neutral-100 p-4 sm:p-6 dark:bg-neutral-950">
      {/* Constrained Centered Card Container */}
      <div className="relative h-[min(600px,85dvh)] w-full max-w-5xl overflow-hidden rounded-3xl border border-neutral-300 shadow-2xl dark:border-neutral-800">
        <KineticMatrix className="h-full w-full rounded-3xl" />
      </div>
    </div>
  );
}
