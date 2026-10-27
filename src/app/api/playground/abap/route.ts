import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const source = String(body?.source ?? "");
    const timeoutMs = Math.min(Math.max(Number(body?.timeoutMs) || 15_000, 1_000), 30_000);

    const started = Date.now();
    const { runAbap } = await import("@/lib/playground/abap-runner");
    const runPromise = runAbap(source);
    const timeoutPromise = new Promise<{ status: "timeout"; output: string; error: string; timeMs: number }>(
      (resolve) =>
        setTimeout(
          () =>
            resolve({
              status: "timeout",
              output: "",
              error: `Stopped: the program ran longer than ${timeoutMs / 1000}s (possible infinite loop).`,
              timeMs: Date.now() - started,
            }),
          timeoutMs,
        ),
    );

    const result = await Promise.race([runPromise, timeoutPromise]);
    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      {
        status: "runtime_error",
        output: "",
        error: `ABAP execution failed: ${message}`,
        timeMs: 0,
      },
      { status: 500 },
    );
  }
}
