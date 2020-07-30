# JS-Maybe
This library is inspired by the [Rust Option](https://doc.rust-lang.org/std/option/enum.Option.html) type.

## Examples
```
const myNullableNumber = null; 
const myNumber = Maybe.of(myNullableNumber);
myNumber.map(num => num + 1).unwrapOr(0); // returns 0
```

See Documentation for more details.