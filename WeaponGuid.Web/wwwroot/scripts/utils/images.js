export function setImageSource(image, url, options = {}) {
  const { loading, onMissing } = options;
  let attempts = 0;

  if (loading) {
    image.loading = loading;
  }

  image.dataset.imageUrl = url;
  image.onerror = () => {
    if (image.dataset.imageUrl !== url) {
      return;
    }

    attempts += 1;
    if (attempts === 1) {
      image.src = withRetryToken(url);
      return;
    }

    image.onerror = null;
    onMissing?.();
  };
  image.onload = () => {
    image.onerror = null;
  };
  image.src = url;
}

function withRetryToken(url) {
  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}retry=${Date.now()}`;
}
