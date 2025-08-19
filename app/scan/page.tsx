"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
  url: z.string().url("Enter a valid URL"),
});

type FormValues = z.infer<typeof schema>;

export default function ScanPage() {
  const { register, handleSubmit, formState, reset } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { url: "" },
  });

  const onSubmit = async (data: FormValues) => {
    const res = await fetch("/api/scan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: data.url }),
    });
    const json = await res.json();
    alert(`Scan started: ${json.jobId}\nStatus: ${json.status}`);
    reset();
  };

  return (
    <section className="max-w-xl">
      <h1 className="text-2xl font-semibold mb-4">Scan a URL</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Target URL</label>
          <input
            type="url"
            placeholder="https://example.com"
            {...register("url")}
            className="w-full rounded-xl border px-3 py-2 outline-none focus:ring"
          />
          {formState.errors.url && (
            <p className="mt-1 text-sm text-red-600">{formState.errors.url.message}</p>
          )}
        </div>
        <button
          disabled={formState.isSubmitting}
          className="rounded-xl px-4 py-2 border hover:bg-gray-50 transition disabled:opacity-50"
        >
          {formState.isSubmitting ? "Submitting..." : "Start Scan"}
        </button>
      </form>
    </section>
  );
}
