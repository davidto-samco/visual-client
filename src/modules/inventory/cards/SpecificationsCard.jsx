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

  if (loading) {
    return (
      <div className="text-sm text-gray-500 mt-3">Loading specifications…</div>
    );
  }
  if (error) {
    return <div className="text-sm text-red-600 mt-3">{error}</div>;
  }
  if (!text) {
    return (
      <div className="text-sm text-gray-400 mt-3">
        No specifications on file for this part.
      </div>
    );
  }

  return (
    <div className="border rounded p-4 mt-3 bg-white">
      <h3 className="font-semibold text-sm mb-2">Specifications</h3>
      <pre className="whitespace-pre-wrap text-sm font-sans text-gray-800">
        {text}
      </pre>
    </div>
  );
}
