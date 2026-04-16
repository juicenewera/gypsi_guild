/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("_pb_users_auth_")

  // add field
  collection.fields.addAt(11, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text3709889147",
    "max": 0,
    "min": 0,
    "name": "bio",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
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

  // add field
  collection.fields.addAt(13, new Field({
    "hidden": false,
    "id": "number2599078931",
    "max": null,
    "min": 1,
    "name": "level",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  // add field
  collection.fields.addAt(14, new Field({
    "hidden": false,
    "id": "number4131033149",
    "max": null,
    "min": 0,
    "name": "xp",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  // add field
  collection.fields.addAt(15, new Field({
    "hidden": false,
    "id": "number68964648",
    "max": null,
    "min": 0,
    "name": "xp_to_next",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  // add field
  collection.fields.addAt(16, new Field({
    "hidden": false,
    "id": "number3255964535",
    "max": null,
    "min": null,
    "name": "attr_ai",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  // add field
  collection.fields.addAt(17, new Field({
    "hidden": false,
    "id": "number878100126",
    "max": null,
    "min": null,
    "name": "attr_automacao",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  // add field
  collection.fields.addAt(18, new Field({
    "hidden": false,
    "id": "number1052561361",
    "max": null,
    "min": null,
    "name": "attr_vendas",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  // add field
  collection.fields.addAt(19, new Field({
    "hidden": false,
    "id": "number1182850278",
    "max": null,
    "min": null,
    "name": "attr_database",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  // add field
  collection.fields.addAt(20, new Field({
    "hidden": false,
    "id": "number1973012784",
    "max": null,
    "min": null,
    "name": "attr_conteudo",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  // add field
  collection.fields.addAt(21, new Field({
    "hidden": false,
    "id": "number28440624",
    "max": null,
    "min": null,
    "name": "attr_marketing",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  // add field
  collection.fields.addAt(22, new Field({
    "hidden": false,
    "id": "number145010849",
    "max": null,
    "min": null,
    "name": "adventures_count",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  // add field
  collection.fields.addAt(23, new Field({
    "hidden": false,
    "id": "number1594106200",
    "max": null,
    "min": null,
    "name": "missions_count",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  // add field
  collection.fields.addAt(24, new Field({
    "hidden": false,
    "id": "number2326406872",
    "max": null,
    "min": null,
    "name": "streak_days",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  // add field
  collection.fields.addAt(25, new Field({
    "hidden": false,
    "id": "date3088861482",
    "max": "",
    "min": "",
    "name": "last_seen_at",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "date"
  }))

  // add field
  collection.fields.addAt(26, new Field({
    "hidden": false,
    "id": "bool2566954599",
    "name": "is_founder",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "bool"
  }))

  // add field
  collection.fields.addAt(27, new Field({
    "hidden": false,
    "id": "bool3304254982",
    "name": "is_admin",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "bool"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("_pb_users_auth_")

  // remove field
  collection.fields.removeById("text3709889147")

  // remove field
  collection.fields.removeById("select190089999")

  // remove field
  collection.fields.removeById("number2599078931")

  // remove field
  collection.fields.removeById("number4131033149")

  // remove field
  collection.fields.removeById("number68964648")

  // remove field
  collection.fields.removeById("number3255964535")

  // remove field
  collection.fields.removeById("number878100126")

  // remove field
  collection.fields.removeById("number1052561361")

  // remove field
  collection.fields.removeById("number1182850278")

  // remove field
  collection.fields.removeById("number1973012784")

  // remove field
  collection.fields.removeById("number28440624")

  // remove field
  collection.fields.removeById("number145010849")

  // remove field
  collection.fields.removeById("number1594106200")

  // remove field
  collection.fields.removeById("number2326406872")

  // remove field
  collection.fields.removeById("date3088861482")

  // remove field
  collection.fields.removeById("bool2566954599")

  // remove field
  collection.fields.removeById("bool3304254982")

  return app.save(collection)
})
