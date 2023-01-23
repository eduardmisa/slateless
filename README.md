<sub><sup>NOTE: Still Under Development.</sup></sub>
### A *React* Minimal Rich Text Editor based on Slate.
##### *Slate but Less*. [*Demo*](https://emisa.me/npm/slateless)
Dealing with Slate can be a very tedious task for most of us.
So here is a *plug and play* __Editor__ and a __Renderer__.
```
The idea is simple:
- input a state
- outputs a result (save it somewhere)
- render where you need it
```
----
#### Usage
###### Import components:
```
import { SlateEditor, SlateContent } from "slateless";
```
###### Create a State and OnChange handler:
```
const [value, setValueChange] = useState("");
const onValueChange = (val: string) => {
    setValueChange(val);
};
```
###### Bind the state and handler into the Editor:
```
<SlateEditor value={value} onChange={onValueChange} />
```
###### Bind the state into the Content Renderer:
```
It's completely up to you when you want to re-render this component.
```
```
Let's assume you want to render this everytime you are editing the editor.
code:

<SlateContent value={value} key={Date.now()} />
```
