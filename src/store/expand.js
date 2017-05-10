function onEach(items, mapper) {
  if (Array.isArray(items)) {
    return items.map(mapper)
  }

  if (items) {
    return mapper(items)
  }
}

export default function(getKey, getRecord) {
  function expand(getKey) {
    return record => {
      var linked = _.mapValues(record.relationships, rel =>
        onEach(rel.data, link => hydrate(getKey(link)))
      )

      return Object.assign(
        {
          id: record.id,
          type: record.type
        },
        record.attributes,
        linked
      )
    }
  }

  const hydrate = key => expand(getRecord(key))

  return hydrate
}
