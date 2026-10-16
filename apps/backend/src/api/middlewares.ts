import { defineMiddlewares } from "@medusajs/framework/http"

export default defineMiddlewares({
  routes: [
    {
      matcher: "/admin/blog",
      method: "POST",
      bodyParser: false,
    },
  ],
})
