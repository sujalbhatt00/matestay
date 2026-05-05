function isPlainObject(value) {
  return (
    value !== null &&
    typeof value === "object" &&
    (Object.getPrototypeOf(value) === Object.prototype || Object.getPrototypeOf(value) === null)
  );
}

function toSafeKey(key, replaceWith) {
  // Also block prototype pollution vectors
  if (key === "__proto__" || key === "prototype" || key === "constructor") {
    return null;
  }

  // Mongo/NoSQL operator & dot-notation injection
  if (key.startsWith("$") || key.includes(".")) {
    return key.replace(/[.$]/g, replaceWith);
  }

  return key;
}

function ensureUniqueKey(obj, desiredKey) {
  if (!(desiredKey in obj)) return desiredKey;
  let candidate = desiredKey;
  let i = 1;
  while (candidate in obj) {
    candidate = `${desiredKey}_${i}`;
    i += 1;
  }
  return candidate;
}

function sanitizeInPlace(target, replaceWith) {
  if (Array.isArray(target)) {
    for (const item of target) sanitizeInPlace(item, replaceWith);
    return;
  }

  if (!isPlainObject(target)) return;

  for (const originalKey of Object.keys(target)) {
    const safeKeyOrNull = toSafeKey(originalKey, replaceWith);

    // Drop dangerous keys
    if (safeKeyOrNull === null) {
      delete target[originalKey];
      continue;
    }

    const value = target[originalKey];

    if (safeKeyOrNull !== originalKey) {
      const uniqueKey = ensureUniqueKey(target, safeKeyOrNull);
      target[uniqueKey] = value;
      delete target[originalKey];
      sanitizeInPlace(target[uniqueKey], replaceWith);
      continue;
    }

    sanitizeInPlace(value, replaceWith);
  }
}

/**
 * Express 5-safe sanitizer middleware.
 * - Mutates req.body/req.params/req.query in place (no reassignment)
 * - Prevents NoSQL operator injection ($) and dot-notation (.) keys
 */
export default function sanitizeRequest(options = {}) {
  const replaceWith = typeof options.replaceWith === "string" ? options.replaceWith : "_";
  const onSanitize = typeof options.onSanitize === "function" ? options.onSanitize : null;

  return function (req, res, next) {
    // body + params can be reassigned safely, but we still mutate for consistency
    if (req.body) {
      const before = JSON.stringify(req.body);
      sanitizeInPlace(req.body, replaceWith);
      if (onSanitize && before !== JSON.stringify(req.body)) onSanitize({ req, key: "body" });
    }

    if (req.params) {
      const before = JSON.stringify(req.params);
      sanitizeInPlace(req.params, replaceWith);
      if (onSanitize && before !== JSON.stringify(req.params)) onSanitize({ req, key: "params" });
    }

    // Express 5: req.query is a getter (read-only property). Mutate the returned object.
    try {
      const queryObj = req.query;
      if (queryObj) {
        const before = JSON.stringify(queryObj);
        sanitizeInPlace(queryObj, replaceWith);
        if (onSanitize && before !== JSON.stringify(queryObj)) onSanitize({ req, key: "query" });
      }
    } catch {
      // If query parsing throws for any reason, ignore sanitization.
    }

    next();
  };
}
