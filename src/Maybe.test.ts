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
    expect(maybeC.unwrap()).toEqual(42);
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

  it("should try to convert a some if no error is thrown", () => {
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

    const maybeC = Maybe.some(value).try(it => it.a!.b!.c);
    expect(maybeC.isSome()).toBeTruthy();
    expect(maybeC.unwrap()).toEqual(42);
  });

  it("should try to convert to a none if an error is thrown", () => {
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

    const maybeC = Maybe.some(value).try(it => it.a!.b!.c);
    expect(maybeC.isNone()).toBeTruthy();
  });

  it("should unwrap the value if some and throw error if none", () => {
    expect(Maybe.some(5).unwrap()).toEqual(5);
    expect(() => Maybe.none().unwrap()).toThrowError(
      "Provided value must not be empty"
    );
  });

  it("should unwrap the value if some and use the default value if none", () => {
    expect(Maybe.some(5).unwrapOr(4)).toEqual(5);
    expect(Maybe.none().unwrapOr(4)).toEqual(4);
    expect(Maybe.none().unwrapOr(() => 4)).toEqual(4);
  });

  it("should unwrap the value if some and throw a custom error if none", () => {
    const customErrorMsg = "My Error";
    expect(Maybe.some(5).expect(customErrorMsg)).toEqual(5);
    expect(() => Maybe.none().expect(customErrorMsg)).toThrowError(
      customErrorMsg
    );
  });

  it("should map the value be a new type wrapped in a maybe", () => {
    expect(
      Maybe.some(5)
        .map(num => num + 1)
        .equals(Maybe.some(6))
    ).toBeTruthy();

    expect(
      Maybe.some(5)
        .map(num => Maybe.some(num + 1))
        .equals(Maybe.some(6))
    ).toBeTruthy();
  });

  it("should return the maybe on map if it is none", () => {
    const maybe = Maybe.none<number>();
    expect(maybe.map(num => num.toString())).toEqual(maybe);
  });

  it("should map the value be a new type if some or use the default value if none", () => {
    expect(Maybe.some(5).mapOr(num => num + 1, 0)).toEqual(6);
    expect(Maybe.some(1).mapOr(num => ["0", "1"][num], "0")).toEqual("1");
    expect(Maybe.none<number>().mapOr(num => num + 1, 5)).toEqual(5);
    expect(Maybe.none<number>().mapOr(num => num + 1, () => 5)).toEqual(5);
  });

  it("should filter the contained value", () => {
    expect(
      Maybe.some(5)
        .filter(num => num === 5)
        .unwrap()
    ).toEqual(5);
    expect(
      Maybe.some(5)
        .filter(num => num === 4)
        .isNone()
    ).toBeTruthy();
    expect(
      Maybe.none<number>()
        .filter(num => num === 5)
        .isNone()
    ).toBeTruthy();
  });

  it("should and 2 maybes", () => {
    expect(
      Maybe.some(5)
        .and(4)
        .unwrap()
    ).toEqual(4);
    expect(
      Maybe.some(5)
        .and(undefined)
        .isNone()
    ).toBeTruthy();
    expect(
      Maybe.none<number>()
        .and(4)
        .isNone()
    ).toBeTruthy();
    expect(
      Maybe.none()
        .and(undefined)
        .isNone()
    ).toBeTruthy();
    expect(
      Maybe.some(5)
        .and(() => 4)
        .unwrap()
    ).toEqual(4);
  });

  it("should or 2 maybes", () => {
    expect(
      Maybe.some(5)
        .or(4)
        .unwrap()
    ).toEqual(5);
    expect(
      Maybe.some(5)
        .or(undefined)
        .unwrap()
    ).toEqual(5);
    expect(
      Maybe.none<number>()
        .or(4)
        .unwrap()
    ).toEqual(4);
    expect(
      Maybe.none()
        .or(undefined)
        .isNone()
    ).toBeTruthy();
    expect(
      Maybe.none<number>()
        .or(() => 4)
        .unwrap()
    ).toEqual(4);
  });

  it("should xor 2 maybes", () => {
    expect(
      Maybe.some(5)
        .xor(4)
        .isNone()
    ).toBeTruthy();
    expect(
      Maybe.some(5)
        .xor(undefined)
        .unwrap()
    ).toEqual(5);
    expect(
      Maybe.none<number>()
        .xor(4)
        .unwrap()
    ).toEqual(4);
    expect(
      Maybe.none()
        .xor(undefined)
        .isNone()
    ).toBeTruthy();
    expect(
      Maybe.none<number>()
        .xor(() => 4)
        .unwrap()
    ).toEqual(4);
  });

  it("should test contains", () => {
    expect(Maybe.some(5).contains(5)).toBeTruthy();
    expect(Maybe.some(5).contains(4)).toBeFalsy();
    expect(Maybe.none().contains(5)).toBeFalsy();
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
