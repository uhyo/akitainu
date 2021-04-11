export function upsert<K, V>(map: Map<K, V>, key: K, create: (key: K) => V): V {
  if (map.has(key)) {
    return map.get(key) as V;
  } else {
    const value = create(key);
    map.set(key, value);
    return value;
  }
}
