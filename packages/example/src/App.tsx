import { useState } from "react";
import { SlateEditor, SlateContent } from "slateless"

function App() {
  const [value, setValueChange] = useState("");
  const onValueChange = (val: string) => {
      setValueChange(val);
  }

  return (
    <>
      <SlateEditor value={value} onChange={onValueChange} />
      <br /><br />
      <SlateContent value={value} key={Date.now()} />
      <br /><br />
      <div>
        {value && <pre className="text-xs">{JSON.stringify(JSON.parse(value), undefined, 2)}</pre>}
      </div>
    </>
  );
}

export default App;
