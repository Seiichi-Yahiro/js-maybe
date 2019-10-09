import Maybe from "./Maybe";

describe("Maybe", () => {
  it("should create a maybe", () => {
    expect(Maybe.some(5)).toBeInstanceOf(Maybe);
    expect(Maybe.none()).toBeInstanceOf(Maybe);
  });

  it("should throw an error and not create a maybe some", () => {
    const errorMessage = "Provided value must not be empty";
    expect(() => Maybe.some(null)).toThrowError(errorMessage);
    expect(() => Maybe.some(undefined)).toThrowError(errorMessage);
  });

  it("should return true for maybe some and false for maybe none", () => {
    expect(Maybe.some(5).isSome()).toBeTruthy();
    expect(Maybe.none().isSome()).toBeFalsy();
  });

  it("should return true for maybe none and false for maybe some", () => {
    expect(Maybe.none().isNone()).toBeTruthy();
    expect(Maybe.some(5).isNone()).toBeFalsy();
  });

  it("should create a some", () => {
    [
      Maybe.of(5),
      Maybe.of(0),
      Maybe.of(-5),
      Maybe.of(""),
      Maybe.of("test"),
      Maybe.of([]),
      Maybe.of([1, 2, 3]),
      Maybe.of({}),
      Maybe.of({ test: "test" }),
      Maybe.of(() => 5)
    ].forEach(maybe => expect(maybe.isSome()).toBeTruthy());
  });

  it("should create a none", () => {
    [Maybe.of(null), Maybe.of(undefined), Maybe.none()].forEach(maybe =>
      expect(maybe.isNone()).toBeTruthy()
    );
  });

  it("should create a some if no error is thrown", () => {
    interface Value {
      a?: {
        b?: {
          c?: number;
        };
      };
    }

    const value: Value = {
      a: {
        b: {
          c: 42
        }
      }
    };

    const maybeC = Maybe.tryOf(() => value.a!.b!.c);
    expect(maybeC.isSome()).toBeTruthy();
    expect(maybeC.get()).toEqual(42);
  });

  it("should catch the error and return a none", () => {
    interface Value {
      a?: {
        b?: {
          c?: number;
        };
      };
    }

    const value: Value = {
      a: {
        b: undefined
      }
    };

    const maybeC = Maybe.tryOf(() => value.a!.b!.c);
    expect(maybeC.isNone()).toBeTruthy();
  });

  it("should get the value if some and throw error if none", () => {
    expect(Maybe.some(5).get()).toEqual(5);
    expect(() => Maybe.none().get()).toThrowError(
      "Provided value must not be empty"
    );
  });

  it("should get the value if some and use the default value if none", () => {
    expect(Maybe.some(5).getOr(4)).toEqual(5);
    expect(Maybe.none().getOr(4)).toEqual(4);
    expect(Maybe.none().getOr(() => 4)).toEqual(4);
  });

  it("should let the value be a new type wrapped in a maybe", () => {
    expect(
      Maybe.some(5)
        .let(num => num + 1)
        .equals(Maybe.some(6))
    ).toBeTruthy();

    expect(
      Maybe.some(5)
        .let(num => Maybe.some(num + 1))
        .equals(Maybe.some(6))
    ).toBeTruthy();
  });

  it("should fallback if is none", () => {
    const v1 = true ? undefined : 5;
    const v2 = true ? "v2" : undefined;

    expect(
      Maybe.of(v1)
        .or(v2)
        .orGet({ a: 5 })
    ).toEqual("v2");
    expect(Maybe.of(v1).orGet("v2")).toEqual("v2");
    expect(Maybe.of(v1).orGet(() => "v2")).toEqual("v2");
  });

  it("should not use the fallback if is some", () => {
    const v1 = true ? 5 : undefined;
    const v2 = true ? "v2" : undefined;

    expect(
      Maybe.of(v1)
        .or(v2)
        .orGet("v2")
    ).toEqual(5);
    expect(Maybe.of(v1).orGet("v2")).toEqual(5);
    expect(Maybe.of(v1).orGet(() => "v2")).toEqual(5);
  });

  it("should return the maybe on let if it is none", () => {
    const maybe = Maybe.none<number>();
    expect(maybe.let(num => num.toString())).toEqual(maybe);
  });

  it("should let the value be a new type if some or use the default value if none", () => {
    expect(Maybe.some(5).letOr(num => num + 1, 0)).toEqual(6);
    expect(Maybe.some(1).letOr(num => ["0", "1"][num], "0")).toEqual("1");
    expect(Maybe.none<number>().letOr(num => num + 1, 5)).toEqual(5);
    expect(Maybe.none<number>().letOr(num => num + 1, () => 5)).toEqual(5);
  });

  it("should ifIsSome call the function", () => {
    const functions = {
      onSome: (value: number) => void 0
    };

    const spyOnSome = spyOn(functions, "onSome");

    Maybe.some(5).ifIsSome(functions.onSome);
    Maybe.none().ifIsSome(functions.onSome);

    expect(spyOnSome).toHaveBeenCalledTimes(1);
  });

  it("should ifIsNone call the function", () => {
    const functions = {
      onNone: () => void 0
    };

    const spyOnNone = spyOn(functions, "onNone");

    Maybe.none().ifIsNone(functions.onNone);
    Maybe.some(5).ifIsNone(functions.onNone);

    expect(spyOnNone).toHaveBeenCalledTimes(1);
  });

  it("should show that both maybes are equal", () => {
    const a = Maybe.none();
    const b = a;
    expect(a.equals(b)).toBeTruthy();

    const c = Maybe.none();
    const d = Maybe.none();

    expect(c.equals(d)).toBeTruthy();

    const e = Maybe.some(5);
    const f = Maybe.some(5);

    expect(e.equals(f));

    expect(a.equals(e)).toBeFalsy();
    expect(Maybe.some(6).equals(e)).toBeFalsy();
  });
});
