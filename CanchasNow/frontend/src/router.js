const routes = {};

export function addRoute(path, component) { routes[path] = component; }

export function navigate(path) { window.location.hash = `#${path}`; }

export function getRoute() { return window.location.hash.slice(1) || '/'; }

export function startRouter(root) {
  const render = async () => {
    const path = getRoute();
    const component = routes[path] || routes['/'];
    root.innerHTML = await component();
    window.scrollTo(0, 0);
  };
  window.addEventListener('hashchange', render);
  render();
}
