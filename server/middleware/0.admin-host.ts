// Split the dashboard/API onto a dedicated admin host (e.g. one protected by
// Cloudflare Access). When NUXT_ADMIN_HOST is set:
// - on the admin host, `/` goes to the dashboard;
// - on every other host, the dashboard and API return 404 so the short-link
//   host only serves redirects.
const ADMIN_PATH = /^\/(?:dashboard|api|_docs)(?:\/|$)/

export default eventHandler((event) => {
  const adminHost = String(useRuntimeConfig(event).adminHost || '').trim().toLowerCase()
  if (!adminHost)
    return

  const host = getRequestURL(event).hostname.toLowerCase()
  if (host === adminHost) {
    if (event.path === '/')
      return sendRedirect(event, '/dashboard', 302)
    return
  }

  if (ADMIN_PATH.test(event.path)) {
    throw createError({ status: 404, statusText: 'Not Found' })
  }
})
