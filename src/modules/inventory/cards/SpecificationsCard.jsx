import { useEffect, useState } from "react";
import { inventoryApi } from "@/services/api";

export default function SpecificationsCard({ part }) {
  const [state, setState] = useState({
    text: null,
    loading: false,
    error: null,
  });

  useEffect(() => {
    if (!part?.partNumber) return;
    let cancelled = false;

    const fetchSpecifications = async () => {
      if (cancelled) return;
      setState({ text: null, loading: true, error: null });
      try {
        const data = await inventoryApi.getSpecifications(part.partNumber);
        if (!cancelled) setState({ text: data, loading: false, error: null });
      } catch (err) {
        if (!cancelled)
          setState({
            text: null,
            loading: false,
            error: err.message || "Failed to load specifications",
          });
      }
    };

    queueMicrotask(fetchSpecifications);

    return () => {
      cancelled = true;
    };
  }, [part?.partNumber]);

  const { text, loading, error } = state;

  // if (loading) {
  //   return (
  //     <div className="text-sm text-gray-500 mt-3">Loading specifications…</div>
  //   );
  // }
  // if (error) {
  //   return <div className="text-sm text-red-600 mt-3">{error}</div>;
  // }
  // if (!text) {
  //   return (
  //     <div className="text-sm text-gray-400 mt-3">
  //       No specifications on file for this part.
  //     </div>
  //   );
  // }

  // return (
  //   <div className="border rounded p-4 space-y-2 text-sm">
  //     <h3 className="font-semibold">Specifications</h3>
  //     <p className="whitespace-pre-wrap text-gray-800">{text}</p>
  //   </div>
  // );
  return (
    <div className="border rounded p-4 space-y-2 text-sm">
      <h3 className="font-semibold">Specifications</h3>
      {loading && <div className="text-gray-500">Loading…</div>}
      {error && <div className="text-red-600">{error}</div>}
      {!loading && !error && !text && (
        <div className="text-gray-400">No specifications on file.</div>
      )}
      {!loading && !error && text && (
        <p className="whitespace-pre-wrap text-gray-800">{text}</p>
      )}
    </div>
  );
}
