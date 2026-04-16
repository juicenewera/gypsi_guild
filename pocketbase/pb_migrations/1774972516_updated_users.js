/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("_pb_users_auth_")

  // add field
  collection.fields.addAt(28, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text1167487527",
    "max": 0,
    "min": 0,
    "name": "revenue_range",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(29, new Field({
    "hidden": false,
    "id": "json3720658931",
    "maxSize": 0,
    "name": "pain_points",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "json"
  }))

  // add field
  collection.fields.addAt(30, new Field({
    "hidden": false,
    "id": "json2682122461",
    "maxSize": 0,
    "name": "hardskills",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "json"
  }))

  // add field
  collection.fields.addAt(31, new Field({
    "hidden": false,
    "id": "json394195535",
    "maxSize": 0,
    "name": "softskills",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "json"
  }))

  // add field
  collection.fields.addAt(32, new Field({
    "hidden": false,
    "id": "date2380486097",
    "max": "",
    "min": "",
    "name": "onboarding_completed_at",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "date"
  }))

  // update field
  collection.fields.addAt(12, new Field({
    "hidden": false,
    "id": "select190089999",
    "maxSelect": 0,
    "name": "path",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "ladino",
      "mago",
      "mercador"
    ]
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("_pb_users_auth_")

  // remove field
  collection.fields.removeById("text1167487527")

  // remove field
  collection.fields.removeById("json3720658931")

  // remove field
  collection.fields.removeById("json2682122461")

  // remove field
  collection.fields.removeById("json394195535")

  // remove field
  collection.fields.removeById("date2380486097")

  // update field
  collection.fields.addAt(12, new Field({
    "hidden": false,
    "id": "select190089999",
    "maxSelect": 0,
    "name": "path",
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
})
