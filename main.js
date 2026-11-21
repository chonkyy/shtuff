const grid = document.getElementById("grid");

for (const project of PROJECTS) {
  const link = document.createElement("a");
  link.className = "item";
  link.href = project.url;
  link.setAttribute("aria-label", project.name);
  link.onclick = (e) => {
    e.preventDefault();
    openPreview(project, e);
  };

  const thumb = document.createElement("div");
  thumb.className = "thumb";

  const img = document.createElement("img");
  img.src = project.image;
  img.alt = "";
  img.loading = "lazy";
  // No screenshot yet? Show the first letter instead of a broken image.
  img.onerror = () => {
    img.remove();
    thumb.classList.add("empty");
    thumb.textContent = project.name.charAt(0);
  };
  thumb.append(img);

  link.append(thumb);
  grid.append(link);
}

// Close a modal dialog when the dimmed backdrop around it is clicked.
function closeOnBackdrop(dialog) {
  dialog.addEventListener("click", (e) => {
    if (e.target !== dialog) return;
    const r = dialog.getBoundingClientRect();
    const outside = e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom;
    if (outside) dialog.close();
  });
}

// About overlay. Escape closes it natively.
const about = document.getElementById("about");
document.getElementById("about-open").onclick = () => about.showModal();
document.getElementById("about-close").onclick = () => about.close();
closeOnBackdrop(about);

// Website preview overlay, inspired by Zen browser's Glance.
// Some sites refuse to be shown inside another page; for those we show a message instead.
const NO_EMBED_HOSTS = ["github.com", "gitlab.com", "x.com", "twitter.com", "linkedin.com"];

const preview = document.getElementById("preview");
const previewFrame = document.getElementById("preview-frame");
const previewBlocked = document.getElementById("preview-blocked");

function openPreview(project, e) {
  const url = new URL(project.url, location.href);
  const blocked = NO_EMBED_HOSTS.some((h) => url.hostname === h || url.hostname.endsWith("." + h));

  previewFrame.title = project.name;
  document.getElementById("preview-open").href = url.href;
  document.getElementById("preview-blocked-open").href = url.href;

  previewBlocked.hidden = !blocked;
  previewFrame.hidden = blocked;
  previewFrame.src = blocked ? "about:blank" : url.href;

  preview.showModal();

  // Grow out of the thumbnail that was clicked.
  const r = preview.getBoundingClientRect();
  const x = e.clientX || r.left + r.width / 2;
  const y = e.clientY || r.top + r.height / 2;
  preview.style.transformOrigin = `${x - r.left}px ${y - r.top}px`;
}

document.getElementById("preview-close").onclick = () => preview.close();
// Unload the site on close so nothing keeps playing in the background.
preview.addEventListener("close", () => (previewFrame.src = "about:blank"));
closeOnBackdrop(preview);
