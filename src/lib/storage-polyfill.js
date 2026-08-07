// Polyfills the `window.storage` key/value API that this component was
// originally written against (Claude.ai artifact persistent storage), using
// plain browser localStorage instead. No Claude-specific runtime involved.
//
// Supported methods, matching the original API shape:
//   get(key, shared?)    -> { key, value, shared } | null
//   set(key, value, shared?) -> { key, value, shared } | null
//   delete(key, shared?) -> { key, deleted, shared } | null
//   list(prefix?, shared?) -> { keys, prefix?, shared } | null
//
// `shared` is accepted for API compatibility but ignored — everything is
// stored locally in the browser's localStorage under a namespaced prefix.

const NAMESPACE = "habit-tracker:";

function namespacedKey(key) {
  return `${NAMESPACE}${key}`;
}

async function get(key, shared = false) {
  try {
    const raw = window.localStorage.getItem(namespacedKey(key));
    if (raw === null) return null;
    return { key, value: raw, shared };
  } catch (e) {
    console.error("storage.get failed:", e);
    return null;
  }
}

async function set(key, value, shared = false) {
  try {
    window.localStorage.setItem(namespacedKey(key), value);
    return { key, value, shared };
  } catch (e) {
    console.error("storage.set failed:", e);
    return null;
  }
}

async function del(key, shared = false) {
  try {
    window.localStorage.removeItem(namespacedKey(key));
    return { key, deleted: true, shared };
  } catch (e) {
    console.error("storage.delete failed:", e);
    return null;
  }
}

async function list(prefix = "", shared = false) {
  try {
    const keys = [];
    for (let i = 0; i < window.localStorage.length; i++) {
      const fullKey = window.localStorage.key(i);
      if (fullKey && fullKey.startsWith(NAMESPACE)) {
        const bareKey = fullKey.slice(NAMESPACE.length);
        if (!prefix || bareKey.startsWith(prefix)) keys.push(bareKey);
      }
    }
    return { keys, prefix, shared };
  } catch (e) {
    console.error("storage.list failed:", e);
    return null;
  }
}

if (typeof window !== "undefined" && !window.storage) {
  window.storage = { get, set, delete: del, list };
}

export default { get, set, delete: del, list };
