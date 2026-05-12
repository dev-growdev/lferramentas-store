import { SchemaObjectSiteEditor } from "../../cms-helper";

const buildSchema = () => {
  return {
    "properties": {
      "type": {
        "title": "Escolha uma opção",
        "enumNames": ["Rota", "Título"],
        "enum": ["rota", "titulo"],
        "default": "rota",
        "widget": {
          "ui:widget": "radio"
        }
      }
    },
    "dependencies": {
      "type": {
        "oneOf": [
          {
            "properties": {
              "type": {
                "enum": ["rota"]
              },
              "__editorItemTitle": {
                "title": "Título do Site Editor",
                "type": "string"
              },
              "text": {
                "title": "Texto a ser exibido",
                "type": "string"
              },
              "href": {
                "title": "Redirecionamento do link",
                "type": "string"
              }
            }
          },
          {
            "properties": {
              "type": {
                "enum": ["titulo"]
              },
              "__editorItemTitle": {
                "title": "Título do Site Editor",
                "type": "string"
              },
              "text": {
                "title": "Texto a ser exibido",
                "type": "string"
              }
            }
          }
        ]
      }
    }
  }
}

export const GlobalContextSchemaAvantiInstMenu = (): SchemaObjectSiteEditor => ({
  "type": "object",
  "properties": {
    "items": {
      "minItems": 0,
      "type": "array",
      "title": "Menu Institucional",
      "items": buildSchema()
    }
  }
} as any)
