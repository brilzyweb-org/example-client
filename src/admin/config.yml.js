// Auto-generated from public/admin/config.yml
// Do not edit manually - edit public/admin/config.yml instead
export default `backend:
  name: gitea
  repo: sergius/example-client
  branch: main
  base_url: https://git.brilzy.com
  api_root: https://git.brilzy.com/api/v1
  auth_endpoint: /login/oauth/authorize
  # Client ID из Gitea OAuth2 Application.
  # Redirect URI должен быть: https://webpreneurstudio.com/admin/
  app_id: 507f93a2-2195-4ae0-8b2c-8aa32a69463d

media_folder: "uploads"
public_folder: "/uploads"

collections:
  - name: "site_content"
    label: "Контент сайта"
    files:
      - name: "content"
        label: "content.json"
        file: "content.json"
        format: "json"
        fields:
          - label: "Site"
            name: "site"
            widget: "object"
            fields:
              # ВАЖНО: это системное поле. Клиент не должен его менять.
              # Синк привязывает сайт по repoName (sergius/example-client -> example-client),
              # так что даже ручная правка не "уведёт" контент в другой сайт.
              - label: "ID (system)"
                name: "id"
                widget: "hidden"
                default: "example-client"
              - label: "Title"
                name: "title"
                widget: "string"
              - label: "Description"
                name: "description"
                widget: "text"

          - label: "Pages"
            name: "pages"
            widget: "object"
            fields:
              - label: "Home"
                name: "home"
                widget: "object"
                fields:
                  - label: "Title"
                    name: "title"
                    widget: "string"
                  - label: "Content"
                    name: "content"
                    widget: "markdown"
              - label: "About"
                name: "about"
                widget: "object"
                fields:
                  - label: "Title"
                    name: "title"
                    widget: "string"
                  - label: "Content"
                    name: "content"
                    widget: "markdown"

          - label: "Posts"
            name: "posts"
            widget: "list"
            fields:
              - label: "Title"
                name: "title"
                widget: "string"
              - label: "Content"
                name: "content"
                widget: "markdown"

          - label: "Technologies"
            name: "technologies"
            widget: "list"
            fields:
              - label: "Name"
                name: "name"
                widget: "string"
              - label: "Description"
                name: "description"
                widget: "text"
                required: false
              - label: "Category"
                name: "category"
                widget: "string"
                required: false
              - label: "Icon"
                name: "icon"
                widget: "string"
                required: false
`;
