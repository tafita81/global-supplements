// SPA Fallback - Redirect 404 to index with path
(function() {
  var redirect = sessionStorage.redirect;
  delete sessionStorage.redirect;
  if (redirect && redirect !== location.pathname) {
    history.replaceState(null, null, redirect);
  }
})();
