    var factory = null;
    var clientId = getUrlParam('id') || 'client_id';
    var clientSecret = getUrlParam('secret') || 'client_secret';
    var useSimpleModule = getUrlParam('simple').toLowerCase() !== 'false';
    var dbuser = getUrlParam('dbuser') || '';
    var dbpwd = getUrlParam('dbpwd') || '';
    var sessionObj = null;
    var cognosRootURL = null;
    var tab = '&nbsp;&nbsp;&nbsp;&nbsp;';
    var validPropertiesToEncrypt = useSimpleModule ? ['source.jdbc.schema', 'source.user', 'source.password', 'source.jdbc.jdbcUrl', 'source.srcUrl.sourceUrl'] : ['dataSource.0.schema', 'dataSource.0.user', 'dataSource.0.password',
      'dataSource.0.jdbc.jdbcUrl', 'dataSource.0.csvUrl'
    ];
    var sampleSpec = {
      "name": "New dashboard",
      "layout": {
        "id": "page0",
        "items": [{
          "id": "page1",
          "items": [{
            "id": "model0000015f112a1b00_00000004",
            "style": {
              "left": "65px",
              "top": "21px",
              "height": "420px",
              "width": "500px"
            },
            "type": "widget"
          }],
          "type": "absolute",
          "title": "Tab 1",
          "templateName": "NoTemplate"
        }],
        "style": {
          "height": "100%"
        },
        "type": "tab"
      },
      "theme": "defaultTheme",
      "version": 1006,
      "eventGroups": [{
        "id": "page1:1",
        "widgetIds": ["model0000015f112a1b00_00000004"]
      }],
      "pageContext": [],
      "dataSources": {
        "version": "1.0",
        "sources": [{
          "id": "model0000015f1129e423_00000001",
          "assetId": "http://localhost:9080/temp-service/1606964b316d466fab46fc3240187044",
          "type": "url",
          "clientId": "myUniqueId123",
          "module": {
            "xsd": "https://ibm.com/daas/module/1.0/module.xsd",
            "source": {
              "id": "StringID",
              "jdbc": {
                "jdbcUrl": "jdbc:db2://dashdb-txn-flex-yp-dal09-300.services.dal.bluemix.net:50000/BLUDB",
                "driverClassName": "com.ibm.db2.jcc.DB2Driver",
                "schema": "GOSALEST"
              },
              "user": dbuser,
              "password": dbpwd
            },
            "table": {
              "name": "T1",
              "description": "description of the table for visual hints ",
              "column": [{
                "name": "Year",
                "description": "String",
                "datatype": "SMALLINT",
                "nullable": true,
                "label": "Year",
                "usage": "identifier",
                "regularAggregate": "countDistinct",
                "taxonomyFamily": "cYear"
              }, {
                "name": "Product line",
                "description": "String",
                "datatype": "VARCHAR(24)",
                "nullable": true,
                "label": "Product line",
                "usage": "identifier",
                "regularAggregate": "countDistinct"
              }, {
                "name": "Order method type",
                "datatype": "VARCHAR(11)",
                "nullable": true,
                "label": "Order method type",
                "usage": "identifier",
                "regularAggregate": "countDistinct"
              }, {
                "name": "Retailer country",
                "datatype": "VARCHAR(14)",
                "nullable": true,
                "label": "Retailer country",
                "usage": "identifier",
                "regularAggregate": "countDistinct",
                "taxonomyFamily": "cCountry"
              }, {
                "name": "Revenue",
                "datatype": "DECIMAL(11,2)",
                "nullable": true,
                "label": "Revenue",
                "usage": "fact",
                "regularAggregate": "total"
              }, {
                "name": "Quantity",
                "datatype": "SMALLINT",
                "nullable": true,
                "label": "Quantity",
                "usage": "fact",
                "regularAggregate": "total"
              }]
            },
            "label": "Module Name",
            "identifier": "moduleId"
          },
          "name": "Test Source",
          "shaping": {
            "embeddedModuleUpToDate": true
          }
        }]
      },
      "widgets": {
        "model0000015f112a1b00_00000004": {
          "id": "model0000015f112a1b00_00000004",
          "data": {
            "dataViews": [{
              "modelRef": "model0000015f1129e423_00000001",
              "dataItems": [{
                "id": "model0000015f112a1b00_00000000",
                "itemId": "T1.Product_line",
                "itemLabel": "Product Line"
              }, {
                "id": "model0000015f112a1b00_00000001",
                "itemId": "T1.Revenue",
                "itemLabel": "Revenue"
              }]
            }]
          },
          "slotmapping": {
            "slots": [{
              "name": "categories",
              "dataItems": ["model0000015f112a1b00_00000000"],
              "caption": "Bars"
            }, {
              "name": "values",
              "dataItems": ["model0000015f112a1b00_00000001"],
              "caption": "Length"
            }]
          },
          "type": "live",
          "name": "",
          "visId": "com.ibm.vis.rave2bundlecolumn"
        }
      }
    };
    var sampleBikeShareRidesDemographModule = {
  "xsd": "https://ibm.com/daas/module/1.0/module.xsd",
  "source": {
        "id": "StringID",
        "jdbc": {
          "jdbcUrl":"jdbc:postgresql://500aaa93-4b2a-4c61-92b5-d4d5932aadb0.0135ec03d5bf43b196433793c98e8bd5.databases.appdomain.cloud:31481/DATABASE=ibmclouddb",
          "driverClassName": "org.postgresql.Driver",
          "connectionProperties": "OPTIONAL=TRUE;LOGINTIMEOUT=0",
          "catalog": "PostgreSql",
          "schema": "public"
        },
        "user": "ibm_cloud_d2bc9c2b_1364_4764_93df_cc369faec116",
        "password": "695c7878f51ddc5efceaf683db523a9cc739074ed14516c8b3f6f5061f762ecc"
    },

  "table": {
    "name": "analysticar_patrones",
    "description": "description of the table for visual hints",
    "column": [
      {
        "name": "Cliente",
        "datatype": "NVARCHAR(50)",
        "nullable": true,
        "description": "identifier",
        "label": "Cliente",
        "usage": "attribute",
        "regularAggregate": "countDistinct"
      },
      {
        "name": "Fecha",
        "datatype": "NVARCHAR(256)",
        "nullable": true,
        "description": "Fecha",
        "label": "Fecha",
        "usage": "attribute",
        "regularAggregate": "countDistinct"
      },
      {
        "name": "Provincia",
        "datatype": "NVARCHAR(256)",
        "nullable": true,
        "description": "Provincia",
        "label": "Provincia",
        "usage": "attribute",
        "regularAggregate": "countDistinct"
      },
      {
        "name": "Ciudad",
        "datatype": "NVARCHAR(256)",
        "nullable": true,
        "description": "Ciudad",
        "label": "Ciudad",
        "usage": "attribute",
        "regularAggregate": "countDistinct"
      },
      {
        "name": "Sexo",
        "datatype": "NVARCHAR(256)",
        "nullable": true,
        "description": "Sexo",
        "label": "Sexo",
        "usage": "attribute",
        "regularAggregate": "countDistinct"
      },
      {
        "name": "Edad",
        "datatype": "BIGINT",
        "nullable": true,
        "description": "Edad",
        "label": "Edad",
        "usage": "fact",
        "regularAggregate": "total"
      },
      {
        "name": "Transporte-autobus",
        "datatype": "BIGINT",
        "nullable": true,
        "description": "Transporte-autobus",
        "label": "Uso de Transporte Publico (%)",
        "usage": "fact",
        "regularAggregate": "total"
      },
      {
        "name": "Transporte-bicicleta",
        "datatype": "BIGINT",
        "nullable": true,
        "description": "Transporte-bicicleta",
        "label": "Uso de la bicicleta (%)",
        "usage": "fact",
        "regularAggregate": "total"
      },
      {
        "name": "Transporte-caminando",
        "datatype": "BIGINT",
        "nullable": true,
        "description": "Transporte-caminando",
        "label": "Porcentaje caminando (%)",
        "usage": "fact",
        "regularAggregate": "total"
      },
      {
        "name": "Transporte-vehiculo",
        "datatype": "BIGINT",
        "nullable": true,
        "description": "Transporte-vehiculo (%)",
        "label": "Uso del vehiculo (%)",
        "usage": "fact",
        "regularAggregate": "total"
      },
      {
        "name": "Porcentaje_tráfico_vehicular",
        "datatype": "BIGINT",
        "nullable": true,
        "description": "Porcentaje_tráfico_vehicular",
        "label": "Índice de tráfico pesado",
        "usage": "fact",
        "regularAggregate": "total"
      },
      {
        "name": "Riesgo",
        "datatype": "BIGINT",
        "nullable": true,
        "description": "Prob_Riesgo(%)",
        "label": "Porcentaje de Riesgo",
        "usage": "fact",
        "regularAggregate": "total"
      }
    ]
  },
  "label": "analysticar_patrones",
  "identifier": "myUniqueId221"
};

var sampleBike = {
  "xsd": "https://ibm.com/daas/module/1.0/module.xsd",
  "source": {
    "id": "CSV_File",
    "srcUrl": {
      "sourceUrl": "https://analyticar-sbg.mybluemix.net/static/Data_Transport_Sensor_v3_2.csv",
      "mimeType": "text/csv",
      "property": [
        {
          "name": "separator",
          "value": ","
        },
        {
          "name": "ColumnNamesLine",
          "value": "true"
        }
      ]
    }
  },
  "table": {
    "name": "Data_Transport_Sensor_v3_2",
    "description": "description of the table for visual hints",
    "column": [
      {
        "name": "Cliente",
        "datatype": "NVARCHAR(256)",
        "nullable": true,
        "description": "identifier",
        "label": "Cliente",
        "usage": "attribute",
        "regularAggregate": "countDistinct"
      },
      {
        "name": "Fecha",
        "datatype": "NVARCHAR(256)",
        "nullable": true,
        "description": "Fecha",
        "label": "Fecha",
        "usage": "attribute",
        "regularAggregate": "countDistinct"
      },
      {
        "name": "Provincia",
        "datatype": "NVARCHAR(256)",
        "nullable": true,
        "description": "Provincia",
        "label": "Provincia",
        "usage": "attribute",
        "regularAggregate": "countDistinct"
      },
      {
        "name": "Ciudad",
        "datatype": "NVARCHAR(256)",
        "nullable": true,
        "description": "Ciudad",
        "label": "Ciudad",
        "usage": "attribute",
        "regularAggregate": "countDistinct"
      },
      {
        "name": "Sexo",
        "datatype": "NVARCHAR(256)",
        "nullable": true,
        "description": "Sexo",
        "label": "Sexo",
        "usage": "attribute",
        "regularAggregate": "countDistinct"
      },
      {
        "name": "Edad",
        "datatype": "BIGINT",
        "nullable": true,
        "description": "Edad",
        "label": "Edad",
        "usage": "fact",
        "regularAggregate": "total"
      },
      {
        "name": "Promedio_horas_uso_vehículo",
        "datatype": "DOUBLE",
        "nullable": true,
        "description": "Promedio_horas_uso_vehículo",
        "label": "Promedio de horas uso vehículo",
        "usage": "fact",
        "regularAggregate": "countDistinct"
      },
      {
        "name": "Uso_teléfono",
        "datatype": "BIGINT",
        "nullable": true,
        "description": "Uso_teléfono",
        "label": "Uso del teléfono (%)",
        "usage": "fact",
        "regularAggregate": "total"
      },
      {
        "name": "Eficiencia",
        "datatype": "BIGINT",
        "nullable": true,
        "description": "Eficiencia",
        "label": "Eficiencia (%)",
        "usage": "fact",
        "regularAggregate": "total"
      },
      {
        "name": "Promedio_Velocidad",
        "datatype": "BIGINT",
        "nullable": true,
        "description": "Promedio_Velocidad_(km-h)",
        "label": "Promedio de Velocidad",
        "usage": "fact",
        "regularAggregate": "total"
      },
      {
        "name": "Anticipación",
        "datatype": "BIGINT",
        "nullable": true,
        "description": "Anticipación",
        "label": "Anticipación (%)",
        "usage": "fact",
        "regularAggregate": "total"
      },
      {
        "name": "Legalidad",
        "datatype": "BIGINT",
        "nullable": true,
        "description": "Legalidad",
        "label": "Legalidad (%)",
        "usage": "fact",
        "regularAggregate": "total"
      },
      {
        "name": "Porcentaje_Riesgo",
        "datatype": "BIGINT",
        "nullable": true,
        "description": "Porcentaje de Probabilidad (%)",
        "label": "Porcentaje de Probabilidad (%)",
        "usage": "fact",
        "regularAggregate": "total"
      }
    ]
  },
  "label": "Module Name",
  "identifier": "moduleId"
};
  
  var DemographModule = {
  "xsd": "https://ibm.com/daas/module/1.0/module.xsd",
  "source": {
    "id": "CSV_File",
    "srcUrl": {
      "sourceUrl": "https://analyticar-sbg.mybluemix.net/static/modelo_data_sensor_sentimentv10.csv",
      "mimeType": "text/csv",
      "property": [
        {
          "name": "separator",
          "value": ","
        },
        {
          "name": "ColumnNamesLine",
          "value": "true"
        }
      ]
    }
  },
  "table": {
    "name": "Data_Transport_Sensor_v1",
    "description": "description of the table for visual hints",
    "column": [
      {
        "name": "Cliente",
        "datatype": "NVARCHAR(256)",
        "nullable": true,
        "description": "identifier",
        "label": "Cliente",
        "usage": "attribute",
        "regularAggregate": "countDistinct"
      },
      {
        "name": "Fecha",
        "datatype": "NVARCHAR(256)",
        "nullable": true,
        "description": "Fecha",
        "label": "Fecha",
        "usage": "attribute",
        "regularAggregate": "countDistinct"
      },
      {
        "name": "Porcentaje_de_Conversación_%",
        "datatype": "DOUBLE",
        "nullable": true,
        "description": "Porcentaje_de_Conversación_%",
        "label": "Porcentaje de Conversación en el Vehículo",
        "usage": "fact",
        "regularAggregate": "countDistinct"
      },
      {
        "name": "Porcentaje_de_Conversación",
        "datatype": "BIGINT",
        "nullable": true,
        "description": "Porcentaje_de_Conversación",
        "label": "Porcentaje de Conversación en el Vehículo",
        "usage": "fact",
        "regularAggregate": "total"
      },
      {
        "name": "Tono_de_voz",
        "datatype": "NVARCHAR(256)",
        "nullable": true,
        "description": "Tono_de_voz",
        "label": "Tono de voz",
        "usage": "attribute",
        "regularAggregate": "countDistinct"
      },
      {
        "name": "Tono_de_voz_%",
        "datatype": "BIGINT",
        "nullable": true,
        "description": "Tono_de_voz_%",
        "label": "Tono de voz %",
        "usage": "fact",
        "regularAggregate": "total"
      },
      {
        "name": "Tipo_de_música",
        "datatype": "NVARCHAR(256)",
        "nullable": true,
        "description": "Tipo_de_música",
        "label": "Tipo de música",
        "usage": "attribute",
        "regularAggregate": "countDistinct"
      },
      {
        "name": "Estado_de_sentimiento",
        "datatype": "NVARCHAR(256)",
        "nullable": true,
        "description": "Estado_de_sentimiento",
        "label": "Estado de sentimiento del conductor",
        "usage": "attribute",
        "regularAggregate": "countDistinct"
      },
      {
        "name": "Patrón_de_conducción",
        "datatype": "NVARCHAR(256)",
        "nullable": true,
        "description": "Patrón_de_conducción",
        "label": "Patrón de conducción",
        "usage": "attribute",
        "regularAggregate": "countDistinct"
      },
      {
        "name": "Número_de_casos",
        "datatype": "BIGINT",
        "nullable": true,
        "description": "Número_de_casos",
        "label": "Número de casos",
        "usage": "fact",
        "regularAggregate": "total"
      }
    ]
  },
  "label": "Module Name",
  "identifier": "moduleId"
};
    // Use the old module spec
    if (!useSimpleModule) {
      sampleSpec = {
        "name": "New dashboard",
        "layout": {
          "id": "page0",
          "items": [{
            "id": "page1",
            "items": [{
              "id": "model0000015f112a1b00_00000004",
              "style": {
                "left": "65px",
                "top": "21px",
                "height": "420px",
                "width": "500px"
              },
              "type": "widget"
            }],
            "type": "absolute",
            "title": "Tab 1",
            "templateName": "NoTemplate"
          }],
          "style": {
            "height": "100%"
          },
          "type": "tab"
        },
        "theme": "defaultTheme",
        "version": 1006,
        "eventGroups": [{
          "id": "page1:1",
          "widgetIds": ["model0000015f112a1b00_00000004"]
        }],
        "pageContext": [],
        "dataSources": {
          "version": "1.0",
          "sources": [{
            "id": "model0000015f1129e423_00000001",
            "assetId": "http://localhost:9080/temp-service/1606964b316d466fab46fc3240187044",
            "type": "url",
            "clientId": "myUniqueId123",
            "module": {
              "version": "4.0",
              "container": "A_DashDb.A_DashDb.null.GOSALEST",
              "dataSource": [{
                "schema": "GOSALEST",
                "jdbc": {
                  "jdbcUrl": "jdbc:db2://dashdb-txn-flex-yp-dal09-300.services.dal.bluemix.net:50000/BLUDB",
                  "driverClassName": "com.ibm.db2.jcc.DB2Driver"
                },
                "user": dbuser,
                "password": dbpwd,
                "table": [{
                  "tableItem": [{
                    "column": {
                      "datatype": "SMALLINT",
                      "nullable": true,
                      "vendorType": "SMALLINT",
                      "name": "Year"
                    }
                  }, {
                    "column": {
                      "datatype": "VARCHAR(24)",
                      "nullable": true,
                      "vendorType": "VARCHAR",
                      "name": "Product line"
                    }
                  }, {
                    "column": {
                      "datatype": "VARCHAR(11)",
                      "nullable": true,
                      "vendorType": "VARCHAR",
                      "name": "Order method type"
                    }
                  }, {
                    "column": {
                      "datatype": "VARCHAR(14)",
                      "nullable": true,
                      "vendorType": "VARCHAR",
                      "name": "Retailer country"
                    }
                  }, {
                    "column": {
                      "datatype": "DECIMAL(11,2)",
                      "nullable": true,
                      "vendorType": "DECIMAL",
                      "name": "Revenue"
                    }
                  }, {
                    "column": {
                      "datatype": "SMALLINT",
                      "nullable": true,
                      "vendorType": "SMALLINT",
                      "name": "Quantity"
                    }
                  }],
                  "name": "T1"
                }],
                "name": "A_DashDb..GOSALEST"
              }],
              "querySubject": [{
                "ref": ["T1"],
                "item": [{
                  "queryItem": {
                    "identifier": "Year_",
                    "label": "Year",
                    "expression": "Year",
                    "usage": "identifier",
                    "datatype": "SMALLINT",
                    "nullable": true,
                    "regularAggregate": "countDistinct",
                    "taxonomy": [{
                      "domain": "cognos",
                      "family": "cYear",
                      "class": "cTime"
                    }]
                  }
                }, {
                  "queryItem": {
                    "identifier": "Product_line",
                    "label": "Product Line",
                    "expression": "Product line",
                    "usage": "identifier",
                    "datatype": "VARCHAR(24)",
                    "nullable": true,
                    "regularAggregate": "countDistinct"
                  }
                }, {
                  "queryItem": {
                    "identifier": "Order_method_type",
                    "label": "Order Method Type",
                    "expression": "Order method type",
                    "usage": "identifier",
                    "datatype": "VARCHAR(11)",
                    "nullable": true,
                    "regularAggregate": "countDistinct"
                  }
                }, {
                  "queryItem": {
                    "identifier": "Retailer_country",
                    "label": "Retailer Country",
                    "expression": "Retailer country",
                    "usage": "identifier",
                    "datatype": "VARCHAR(14)",
                    "nullable": true,
                    "regularAggregate": "countDistinct",
                    "taxonomy": [{
                      "domain": "cognos",
                      "family": "cCountry",
                      "class": "cGeoLocation"
                    }]
                  }
                }, {
                  "queryItem": {
                    "identifier": "Revenue",
                    "label": "Revenue",
                    "expression": "Revenue",
                    "usage": "fact",
                    "datatype": "DECIMAL(11,2)",
                    "nullable": true,
                    "regularAggregate": "total"
                  }
                }, {
                  "queryItem": {
                    "identifier": "Quantity",
                    "label": "Quantity",
                    "expression": "Quantity",
                    "usage": "fact",
                    "datatype": "SMALLINT",
                    "nullable": true,
                    "regularAggregate": "total"
                  }
                }],
                "identifier": "T1",
                "label": "T1"
              }],
              "filter": [],
              "calculation": [],
              "relationship": [],
              "identifier": "Ab_Ab_nl_GT_pe.base",
              "label": "GOSALEST"
            },
            "name": "Test Source",
            "shaping": {
              "embeddedModuleUpToDate": true
            }
          }]
        },
        "widgets": {
          "model0000015f112a1b00_00000004": {
            "id": "model0000015f112a1b00_00000004",
            "data": {
              "dataViews": [{
                "modelRef": "model0000015f1129e423_00000001",
                "dataItems": [{
                  "id": "model0000015f112a1b00_00000000",
                  "itemId": "T1.Product_line",
                  "itemLabel": "Product Line"
                }, {
                  "id": "model0000015f112a1b00_00000001",
                  "itemId": "T1.Revenue",
                  "itemLabel": "Revenue"
                }]
              }]
            },
            "slotmapping": {
              "slots": [{
                "name": "categories",
                "dataItems": ["model0000015f112a1b00_00000000"],
                "caption": "Bars"
              }, {
                "name": "values",
                "dataItems": ["model0000015f112a1b00_00000001"],
                "caption": "Length"
              }]
            },
            "type": "live",
            "name": "",
            "visId": "com.ibm.vis.rave2bundlecolumn"
          }
        }
      };

      sampleModule = {
        "version": "4.0",
        "container": "A_DashDb.A_DashDb.null.GOSALEST",
        "dataSource": [{
          "schema": "GOSALEST",
          "jdbc": {
            "jdbcUrl": "jdbc:db2://dashdb-txn-flex-yp-dal09-300.services.dal.bluemix.net:50000/BLUDB",
            "driverClassName": "com.ibm.db2.jcc.DB2Driver"
          },
          "user": dbuser,
          "password": dbpwd,
          "table": [{
            "tableItem": [{
              "column": {
                "datatype": "SMALLINT",
                "nullable": true,
                "vendorType": "SMALLINT",
                "name": "Year"
              }
            }, {
              "column": {
                "datatype": "VARCHAR(24)",
                "nullable": true,
                "vendorType": "VARCHAR",
                "name": "Product line"
              }
            }, {
              "column": {
                "datatype": "VARCHAR(11)",
                "nullable": true,
                "vendorType": "VARCHAR",
                "name": "Order method type"
              }
            }, {
              "column": {
                "datatype": "VARCHAR(14)",
                "nullable": true,
                "vendorType": "VARCHAR",
                "name": "Retailer country"
              }
            }, {
              "column": {
                "datatype": "DECIMAL(11,2)",
                "nullable": true,
                "vendorType": "DECIMAL",
                "name": "Revenue"
              }
            }, {
              "column": {
                "datatype": "SMALLINT",
                "nullable": true,
                "vendorType": "SMALLINT",
                "name": "Quantity"
              }
            }],
            "name": "T1"
          }],
          "name": "A_DashDb..GOSALEST"
        }],
        "querySubject": [{
          "ref": ["T1"],
          "item": [{
            "queryItem": {
              "identifier": "Year_",
              "label": "Year",
              "expression": "Year",
              "usage": "identifier",
              "datatype": "SMALLINT",
              "nullable": true,
              "regularAggregate": "countDistinct",
              "taxonomy": [{
                "domain": "cognos",
                "family": "cYear",
                "class": "cTime"
              }]
            }
          }, {
            "queryItem": {
              "identifier": "Product_line",
              "label": "Product Line",
              "expression": "Product line",
              "usage": "identifier",
              "datatype": "VARCHAR(24)",
              "nullable": true,
              "regularAggregate": "countDistinct"
            }
          }, {
            "queryItem": {
              "identifier": "Order_method_type",
              "label": "Order Method Type",
              "expression": "Order method type",
              "usage": "identifier",
              "datatype": "VARCHAR(11)",
              "nullable": true,
              "regularAggregate": "countDistinct"
            }
          }, {
            "queryItem": {
              "identifier": "Retailer_country",
              "label": "Retailer Country",
              "expression": "Retailer country",
              "usage": "identifier",
              "datatype": "VARCHAR(14)",
              "nullable": true,
              "regularAggregate": "countDistinct",
              "taxonomy": [{
                "domain": "cognos",
                "family": "cCountry",
                "class": "cGeoLocation"
              }]
            }
          }, {
            "queryItem": {
              "identifier": "Revenue",
              "label": "Revenue",
              "expression": "Revenue",
              "usage": "fact",
              "datatype": "DECIMAL(11,2)",
              "nullable": true,
              "regularAggregate": "total"
            }
          }, {
            "queryItem": {
              "identifier": "Quantity",
              "label": "Quantity",
              "expression": "Quantity",
              "usage": "fact",
              "datatype": "SMALLINT",
              "nullable": true,
              "regularAggregate": "total"
            }
          }],
          "identifier": "T1",
          "label": "T1"
        }],
        "filter": [],
        "calculation": [],
        "relationship": [],
        "identifier": "Ab_Ab_nl_GT_pe.base",
        "label": "GOSALEST"
      };

      sampleCSVModule = {
        "version": "5.0",
        "dataSource": [{
          "csvUrl": "/daas/dataSetDemo.csv",
          "databaseType": "PARQUET",
          "table": [{
            "numberOfRows": 84672,
            "tableItem": [{
              "column": {
                "datatype": "BIGINT",
                "vendorType": "INT64",
                "name": "Year_",
                "description": "Year"
              }
            }, {
              "column": {
                "datatype": "NVARCHAR(24)",
                "vendorType": "STRING(24)",
                "name": "Product_line",
                "description": "Product line"
              }
            }, {
              "column": {
                "datatype": "NVARCHAR(17)",
                "vendorType": "STRING(17)",
                "name": "Order_method_type",
                "description": "Order method type"
              }
            }, {
              "column": {
                "datatype": "NVARCHAR(16)",
                "vendorType": "STRING(16)",
                "name": "Retailer_country",
                "description": "Retailer country"
              }
            }, {
              "column": {
                "datatype": "DOUBLE",
                "vendorType": "FLOAT64",
                "name": "Revenue",
                "description": "Revenue"
              }
            }, {
              "column": {
                "datatype": "BIGINT",
                "vendorType": "INT64",
                "name": "Quantity",
                "description": "Quantity"
              }
            }],
            "name": "dataSetDemo_csv"
          }],
          "name": "dataSetDemo_csv"
        }],
        "querySubject": [{
          "ref": ["dataSetDemo_csv"],
          "item": [{
            "queryItem": {
              "identifier": "Year_",
              "description": "Year",
              "label": "Year",
              "hidden": false,
              "expression": "Year_",
              "usage": "attribute",
              "datatype": "BIGINT",
              "regularAggregate": "countDistinct",
              "taxonomy": [{
                "domain": "cognos",
                "family": "cYear",
                "class": "cTime"
              }]
            }
          }, {
            "queryItem": {
              "identifier": "Product_line",
              "description": "Product line",
              "label": "Product line",
              "hidden": false,
              "expression": "Product_line",
              "usage": "attribute",
              "datatype": "NVARCHAR(24)",
              "regularAggregate": "countDistinct"
            }
          }, {
            "queryItem": {
              "identifier": "Order_method_type",
              "description": "Order method type",
              "label": "Order method type",
              "hidden": false,
              "expression": "Order_method_type",
              "usage": "attribute",
              "datatype": "NVARCHAR(17)",
              "regularAggregate": "countDistinct"
            }
          }, {
            "queryItem": {
              "identifier": "Retailer_country",
              "description": "Retailer country",
              "label": "Retailer country",
              "hidden": false,
              "expression": "Retailer_country",
              "usage": "attribute",
              "datatype": "NVARCHAR(16)",
              "regularAggregate": "countDistinct",
              "taxonomy": [{
                "domain": "cognos",
                "family": "cCountry",
                "class": "cGeoLocation"
              }]
            }
          }, {
            "queryItem": {
              "identifier": "Revenue",
              "description": "Revenue",
              "label": "Revenue",
              "hidden": false,
              "expression": "Revenue",
              "usage": "fact",
              "datatype": "DOUBLE",
              "regularAggregate": "total"
            }
          }, {
            "queryItem": {
              "identifier": "Quantity",
              "description": "Quantity",
              "label": "Quantity",
              "hidden": false,
              "expression": "Quantity",
              "usage": "fact",
              "datatype": "BIGINT",
              "regularAggregate": "total"
            }
          }],
          "identifier": "dataSetDemo_csv",
          "label": "Data Set Demo Csv"
        }],
        "identifier": "ds.dataSetDemo_csv.base",
        "label": "dataSetDemo.csv"
      };
    }

    function getUrlParam(name) {
      var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
      return (results === null) ? '' : results[1];
    }

    function execute() {
      var script = document.getElementById('actionScript').textContent;
      try {
        eval(script);
      } catch (e) {
        alert('error encountered, see console.')
        console.error(e);
      }
    }

    function getNewSessionScript() {
      return '' +
        'window.newSession(\'' + clientId + '\',\'' + clientSecret + '\', {' +
        '<br>' + tab + '\'expiresIn\': 3600,' +
        '<br>' + tab + '\'webDomain\': \'SAMEORIGIN\'' +
        '<br>});';
    }

    /*$.getJSON("data", function(datos) {
        alert("Dato: " + datos["name"]);
        console.log(datos)
        $.each(datos["primos"], function(idx,primo) {
            alert("Numero primo: " + primo);
        });
    });*/


    

    function getNewAPIScript() {
      return '' +
        'window.api = new CognosApi({' +
        '<br>' + tab + 'cognosRootURL: \'' + "https://dde-us-south.analytics.ibm.com" + '/daas/\',' +
        '<br>' + tab + 'sessionCode: \'' + (sessionObj ? sessionObj.sessionCode : '{{sessionCode}}') + '\',' +
        '<br>' + tab + 'language: \'' + 'en' + '\',' +
        '<br>' + tab + 'node: document.getElementById(\'containerDivId\')' +
        '<br>' + '});' +
        '<br>' + 'window.api.initialize().then(function() {' +
        '<br>' + tab + 'console.log(\'API created successfully.\');' +
        '<br>}, function(err) {' +
        '<br>' + tab + 'console.log(\'Failed to create API. \' + err.message);' +
        '<br>});';
    }

    function getOnErrorScript() {
      return 'window.onError = function(event) {' +
        '<br>' + tab + 'console.log(\'onError:\' + JSON.stringify(event));' +
        '<br>' + '};' +
        '<br>' + 'window.api.on(CognosApi.EVENTS.REQUEST_ERROR, window.onError);';
    }

    function getOffErrorScript() {
      return 'window.api.off(CognosApi.EVENTS.REQUEST_ERROR, window.onError);';
    }

    function getCloseAPIScript() {
      return '' +
        'window.api.close().then(function() {' +
        '<br>' + tab + 'console.log(\'API closed successfully.\')' +
        '<br>});';

    }

    function getUpdateModuleDefinitionsScript() {
      return '' +
        '/* Clone our test spec since we don\'t want this example to change it */' +
        '<br>' + 'var dbSpec = JSON.parse(JSON.stringify(sampleSpec));' +
        '<br>' +
        '<br>' + 'var getNewModulesCallback = function(ids) {' +
        '<br>' + tab + 'var newModules = [];' +
        '<br>' + tab + 'ids.forEach(function(id) {' +
        '<br>' + tab + tab + 'newModules.push({' +
        '<br>' + tab + tab + tab + 'id: id,' +
        '<br>' + tab + tab + tab + 'module: {' +
        '<br>' + tab + tab + tab + tab + 'newModuleDefinition: true' +
        '<br>' + tab + tab + tab + '},' +
        '<br>' + tab + tab + tab + 'name: \'newModuleName\',' +
        '<br>' + tab + tab + '});' +
        '<br>' + tab + '});' +
        '<br>' + tab + 'return Promise.resolve(newModules);' +
        '<br>' + '};  ' +
        '<br>' +
        '<br>' + '/* Log the before */' +
        '<br>' + 'console.log(dbSpec.dataSources.sources);' +
        '<br>' +
        '<br>' + 'window.api.updateModuleDefinitions(dbSpec, getNewModulesCallback).then(function(newDBSpec) {' +
        '<br>' + tab + 'console.log(newDBSpec.dataSources.sources);' +
        '<br>' + '});';
    }

    function getNewDashboardScript() {
      return 'window.api.dashboard.createNew().then(' +
        '<br>' + tab + 'function(dashboardAPI) {' +
        '<br>' + tab + tab + 'console.log(\'Dashboard created successfully.\');' +
        '<br>' + tab + tab + 'window.dashboardAPI = dashboardAPI;' +
        '<br>' + tab + '}' +
        '<br>' + ').catch(' +
        '<br>' + tab + 'function(err) {' +
        '<br>' + tab + tab + 'console.log(\'User hit cancel on the template picker page.\');' +
        '<br>' + tab + '}' +
        '<br>);'
    }


    function getOpenDashboardScript() {
      return 'window.api.dashboard.openDashboard({' +
        '<br>' + tab + 'dashboardSpec: sampleSpec' +
        '<br>}).then(' +
        '<br>' + tab + 'function(dashboardAPI) {' +
        '<br>' + tab + tab + 'console.log(\'Dashboard created successfully.\');' +
        '<br>' + tab + tab + 'window.dashboardAPI = dashboardAPI;' +
        '<br>' + tab + '}' +
        '<br>' + ').catch(' +
        '<br>' + tab + 'function(err) {' +
        '<br>' + tab + tab + 'console.log(err);' +
        '<br>' + tab + '}' +
        '<br>);'
    }


    function getAddSourcesScript() {
      return 'dashboardAPI.addSources([{' +
        '<br>' + tab + 'module: sampleBikeShareRidesDemographModule,' +
        '<br>' + tab + 'name: \'analysticar_patrones\',' +
        '<br>' + tab + 'id: \'myUniqueId221\'' +
        '<br>}])';
    }

    function getAddSampleScript() {
      return 'dashboardAPI.addSources([{' +
        '<br>' + tab + 'module: sampleBike,' +
        '<br>' + tab + 'name: \'Data_Transport_Sensor_v3_1\',' +
        '<br>' + tab + 'id: \'myUniqueId222\'' +
        '<br>}])';
    }


    function getAddDemographModuleScript() {
      return 'dashboardAPI.addSources([{' +
        '<br>' + tab + 'module: DemographModule,' +
        '<br>' + tab + 'name: \'sampleBikeShareRidesDemographModule\',' +
        '<br>' + tab + 'id: \'myUniqueId223\'' +
        '<br>}])';
    }


    function getAddProtectedSourcesScript() {
      return '' +
        'var protectedSampleModule = getProtectedSampleModule();' +
        '<br>' + 'dashboardAPI.addSources([{' +
        '<br>' + tab + 'module: protectedSampleModule,' +
        '<br>' + tab + 'name: \'Protected Source\',' +
        '<br>' + tab + 'id: \'myUniqueId456\'' +
        '<br>' + '}])';
    }

    function getAddCSVSourcesScript() {
      return 'dashboardAPI.addSources([{' +
        '<br>' + tab + 'module: sampleCSVModule,' +
        '<br>' + tab + 'name: \'Test CSV Source\',' +
        '<br>' + tab + 'id: \'myUniqueId789\'' +
        '<br>}])';
    }

    function getAddProtectedCSVSourcesScript() {
      return '' +
        'var protectedSampleModule = getProtectedSampleCSVModule();' +
        '<br>' + 'dashboardAPI.addSources([{' +
        '<br>' + tab + 'module: protectedSampleModule,' +
        '<br>' + tab + 'name: \'Protected CSV Source\',' +
        '<br>' + tab + 'id: \'myUniqueId987\'' +
        '<br>' + '}]);';
    }

    function getSetModeScript() {
      return '/**' +
        '<br>Available modes' +
        '<br>dashboardAPI.MODES.EDIT (authoring mode)' +
        '<br>dashboardAPI.MODES.VIEW (consumption mode)' +
        '<br>dashboardAPI.MODES.EDIT_GROUP (event group mode)' +
        '<br>*/' +
        '<br><br>dashboardAPI.setMode(dashboardAPI.MODES.EDIT);';
    }

    function getUndoScript() {
      return 'dashboardAPI.undo();';
    }

    function getRedoScript() {
      return 'dashboardAPI.redo();';
    }

    function getGetSpecScript() {
      return 'dashboardAPI.getSpec().then(function(spec){' +
        '<br>' + tab + 'console.log(JSON.stringify(spec));' +
        '<br>' + '});';
    }

    function getClearDirtyScript() {
      return 'dashboardAPI.clearDirty();';
    }

    function getTogglePropertiesScript() {
      return 'dashboardAPI.toggleProperties();';
    }

    function getOnEventScript() {
      return 'window.onDirty = function(event) {' +
        '<br>' + tab + 'console.log(\'onDirty:\' + JSON.stringify(event));' +
        '<br>' + '};' +
        '<br>' + 'dashboardAPI.on(dashboardAPI.EVENTS.DIRTY, window.onDirty);';
    }

    function getOffEventScript() {
      return 'dashboardAPI.off(dashboardAPI.EVENTS.DIRTY, window.onDirty);';
    }

    function setActionScript() {
      var selectedValue = document.getElementById('action').value;
      var fn = window['get' + selectedValue + 'Script'];
      var script = fn();
      document.getElementById('actionScript').innerHTML = script;
    }

    function _createSession(client_id, client_secret, payload) {
      var xhttp = new XMLHttpRequest();
      xhttp.open("POST", "v1/session", true);
      xhttp.setRequestHeader('Authorization', 'Basic ' + btoa(client_id + ':' + client_secret));
      xhttp.setRequestHeader('Content-Type', 'application/json');

      return new Promise(function(resolve, reject) {
        xhttp.onreadystatechange = function() {
          if (this.readyState == 4) {
            if (this.status == 201) {
              resolve(JSON.parse(this.responseText));
            } else {
              reject(new Error(this.statusText));
            }
          }
        };
        xhttp.send(JSON.stringify(payload));
      });
    }

    function getProtectedSampleModule() {
      return this._encryptModuleInfo(sampleModule);
    }

    function getProtectedSampleCSVModule() {
      return this._encryptModuleInfo(sampleCSVModule);
    }

    function _encryptModuleInfo(module) {
      var sampleProtectedModule = JSON.parse(JSON.stringify(module));
      return this._encryptObject(sampleProtectedModule);
    }

    function _encryptObject(obj, name) {
      Object.keys(obj).forEach(function(key) {
        var fullKey = name ? name + '.' + key : key;
        if (typeof obj[key] === 'object') {
          // encrypt the child object
          this._encryptObject(obj[key], fullKey);
        } else if (validPropertiesToEncrypt.indexOf(fullKey) !== -1) {
          obj[key] = this._encryptValue(obj[key]);
        }
      });
      return obj;
    }

    function _encryptValue(value) {
      var keyObj = KEYUTIL.getKey(sessionObj.keys[0]);
      var hex = KJUR.crypto.Cipher.encrypt(value, keyObj);

      return '{enc}' + hextob64(hex);
    }

    function deleteSession(client_id, client_secret) {
      var xhttp = new XMLHttpRequest();
      xhttp.open("DELETE", "v1/session", true);
      xhttp.setRequestHeader('Authorization', 'Basic ' + btoa(client_id + ':' + client_secret));
      xhttp.onreadystatechange = function() {
        if (this.readyState == 4) {
          if (this.status == 200) {
            resolve(JSON.parse(this.responseText));
          } else {
            reject();
          }
        }
      };
      xhttp.send();
    }

    function newSession(username, password, payload) {
      var containerDiv = document.getElementById('containerDivId');

      _createSession(username, password, payload).then(function(session) {
        sessionObj = session;

        window.onbeforeunload = function() {
          deleteSession(username, password);
        }
        containerDiv.innerHTML = '<h2>Session information</h2><pre>' + JSON.stringify(sessionObj, undefined, 4) + '</pre>';
      }, function(err) {
        sessionObj = null;
        containerDiv.innerHTML = '<h2>Failed to create session</h2>Please check your application credentials.';
      });
    }