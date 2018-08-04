export default {
    data: {
        "name": "company",
        "enum": [{
            "name": "COMPANY_STATUS_LIST",
            "choices": [
                {
                    "name": "COMPANY_STATUS_DISABLED",
                    "value": 0,
                    "disname": "启用"
                },{
                    "name": "COMPANY_STATUS_ENABLED",
                    "value": 1,
                    "disname": "禁用"
                }
            ]
        }],
        "setting": [
            {
                "name": "name",
                "type": "String",
                "parmas": {
                    "max_length": "100",
                    "required": true
                },
                "setting": {
                    "union": true,
                    "editable": true,
                    "indexes": false,
                    "check": "all"
                }
            },
            {
                "name": "address",
                "type": "String",
                "parmas": {
                    "max_length": "100"
                },
                "setting": {
                    "union": false,
                    "editable": true,
                    "indexes": false,
                    "check": "all"
                }
            },
            {
                "name": "url",
                "type": "String",
                "parmas": {
                    "max_length": "100"
                },
                "setting": {
                    "union": false,
                    "editable": true,
                    "indexes": false,
                    "check": "all"
                }
            },
            {
                "name": "tel",
                "type": "String",
                "parmas": {
                    "max_length": "20"
                },
                "setting": {
                    "union": false,
                    "editable": true,
                    "indexes": false,
                    "check": "phone_common"
                }
            },
            {
                "name": "status",
                "type": "Int",
                "parmas": {
                    "choices": "enum.COMPANY_STATUS_LIST",
                    "default": "enum.COMPANY_STATUS_ENABLED"
                },
                "setting": {
                    "union": false,
                    "editable": true,
                    "indexes": false,
                    "check": "all"
                }
            },
            {
                "name": "created",
                "type": "DateTime",
                "parmas": {
                    "default": "datetime.datetime.now"
                },
                "setting": {
                    "union": false,
                    "editable": false,
                    "indexes": false,
                    "check": "all"
                }
            },
            {
                "name": "updated",
                "type": "DateTime",
                "parmas": {
                    "default": "datetime.datetime.now"
                },
                "setting": {
                    "union": false,
                    "editable": false,
                    "indexes": false,
                    "check": "all"
                }
            }
        ]
    }
}