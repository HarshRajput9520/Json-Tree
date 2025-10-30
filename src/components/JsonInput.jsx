// src/components/JsonInput.jsx
import { useState } from "react";
import { tryParse } from "../lib/jsonUtils";

/**
 * Default placeholder JSON.
 */
const SAMPLE_JSON = `{
  "user": { "id": 1, "name": "John", "address": { "city": "New York", "country": "USA" } },
  "items": [ { "name": "item1" }, { "name": "item2" } ]
}`;

/**
 * JsonInput
 * Handles user JSON input, validation, and triggering tree generation.
 *
 * Props:
 *  - onGenerate: (parsedJson | null) => void
 */
export default function JsonInput({ onGenerate }) {
  const [text, setText] = useState(SAMPLE_JSON);
  const [error, setError] = useState("");

  /** Validate JSON and notify parent */
  const handleGenerate = () => {
    const result = tryParse(text);

    if (result.ok) {
      setError("");
      onGenerate(result.value);
    } else {
      setError(result.error || "Invalid JSON");
    }
  };

  /** Clear input and reset visualization */
  const handleClear = () => {
    setText("");
    setError("");
    onGenerate(null);
  };

  return (
    <section className="json-input">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={18}
        spellCheck={false}
        placeholder="Paste or type JSON here..."
      />

      {error && <p className="err">{error}</p>}

      <div className="button-group">
        <button onClick={handleGenerate}>Generate Tree</button>
        <button onClick={handleClear}>Clear</button>
      </div>
    </section>
  );
}
