import { prisma } from "@/lib/prisma";

export default async function TestPage() {
  const dbTime = await prisma.$queryRaw<
    { now: Date }[]
  >`SELECT NOW() as now`;

  return (
    <main className="min-h-screen bg-slate-100 flex items-center justify-center p-10">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-2xl">

        <h1 className="text-3xl font-bold mb-8">
          🫀 Cardio Rehab
        </h1>

        <div className="space-y-4">

          <div className="rounded-lg bg-green-100 border border-green-300 p-4">
            ✅ Next.js funcionando
          </div>

          <div className="rounded-lg bg-green-100 border border-green-300 p-4">
            ✅ Prisma conectado
          </div>

          <div className="rounded-lg bg-green-100 border border-green-300 p-4">
            🕒 Hora de la base de datos:
            <br />
            <strong>{dbTime[0].now.toString()}</strong>
          </div>

        </div>

      </div>
    </main>
  );
}