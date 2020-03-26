# Supported mapping operations

- [map](#map)
- [filter](#filter)
- [find](#find)
- [flat](#flat)

## map

Returns array populated with the results of the provided path.

```
[map(root.field)]
```

- `args` - Can be:
  1. String - A [path](README.md#path)

## filter

Returns all elements that equals to the value provided.

```
[filter(root.field, value)]
```

- `args` - Can be:
  1. String - A [path](README.md#path)
  2. String - A field value to filter by

## find

Returns the value of the first element in the provided array that equals to the value provided.

```
[find(root.field, value)]
```

- `args` - Can be:
  1. String - A [path](README.md#path)
  2. String - A field value to find by

## flat

Creates a new array with all sub-array elements concatenated into it recursively up to the 1 level depth.

```
[flat()]
```

