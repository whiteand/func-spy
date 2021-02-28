# func-spy

Exports function `spy(fn, arg)`. Which returns `{ result: fn(arg), metadata: <Metadata>}`

Metadata contains definition of all parts of arg which was used in `fn` during calculatino of `fn(arg)`.

## Example

```javascript
import { spy, typeToStringTypes, iterate } from 'func-spy';

const { result, metadata } = spy(state => state?.users?.[0]?.name, {
  users: [{ name: 'andrew' }],
});

console.log(result); // 'andrew'
iterate(node => {
  console.log(node.path, typeToStringTypes(node.type).join('|'));
}, metadata);
// [] object
// ['users'] array
// ['users', '0'] object
// ['users', '0', 'name'] string
```
