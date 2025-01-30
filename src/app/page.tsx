import Image from "next/image";

export default function LandingPage() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
       <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right, #e5e5e5_1px, transparent_1px), linear-gradient(to_bottom, #e5e5e5_1px, transparent_1px)] bg-[size:6rem_4rem]"/>
      </main>
    </div>
  );
}
