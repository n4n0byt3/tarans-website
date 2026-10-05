import { products, PRODUCT } from "@/lib/products";
import { siteConfig } from "@/lib/site-config";

export default function sitemap() {
  const lastModified = new Date();
  const absolute = (path) => `${siteConfig.url}${path}`;

  return [
    {
      url: siteConfig.url,
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
      images: [absolute("/hero.png"), absolute("/about/founder.png")],
    },
    {
      url: absolute(PRODUCT.path),
      lastModified,
      changeFrequency: "weekly",
      priority: 0.9,
      images: [absolute(PRODUCT.image.src), ...products.map((p) => absolute(p.image))],
    },
    ...["/shipping", "/returns", "/terms", "/privacy"].map((path) => ({
      url: absolute(path),
      lastModified,
      changeFrequency: "yearly",
      priority: 0.3,
    })),
  ];
}
