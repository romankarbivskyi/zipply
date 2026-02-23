interface WebSiteMetadata {
  url: string;
  domain: string;
  domainClean: string;
  siteName: string;
  title: string;
  description: string;
  ogImage: string;
  favicon: string;
  faviconDark: string;
  touchIcon: string;
}

export const getMetadata = async (url: string) => {
  try {
    const res = await fetch("https://mute-poetry-f42b.jurre-2b5.workers.dev/", {
      body: JSON.stringify({
        url: url,
      }),
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "zipply",
      },
      method: "POST",
    });

    const data = await res.json();
    return data.site as WebSiteMetadata;
  } catch {
    return null;
  }
};
