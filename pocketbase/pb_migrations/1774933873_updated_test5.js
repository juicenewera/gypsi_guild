/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1184474640")

  // remove field
  collection.fields.removeById("geoPoint3146698607")

  // remove field
  collection.fields.removeById("geoPoint1542800728")

  // add field
  collection.fields.addAt(2, new Field({
    "hidden": false,
    "id": "select3146698607",
    "maxSelect": 1,
    "name": "mysel",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "mago",
      "guerreiro"
    ]
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1184474640")

  // add field
  collection.fields.addAt(2, new Field({
    "hidden": false,
    "id": "geoPoint3146698607",
    "name": "mysel",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "geoPoint"
  }))

  // add field
  collection.fields.addAt(3, new Field({
    "hidden": false,
    "id": "geoPoint1542800728",
    "name": "field",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "geoPoint"
  }))

  // remove field
  collection.fields.removeById("select3146698607")

  return app.save(collection)
})
