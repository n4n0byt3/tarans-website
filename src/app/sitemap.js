import { products } from "@/lib/products";
import { siteConfig } from "@/lib/site-config";
import { productPath } from "@/lib/seo";

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
    ...products.map((product) => ({
      url: absolute(productPath(product)),
      lastModified,
      changeFrequency: "weekly",
      priority: 0.8,
      images: [absolute(product.image)],
    })),
    ...["/shipping", "/returns", "/terms", "/privacy"].map((path) => ({
      url: absolute(path),
      lastModified,
      changeFrequency: "yearly",
      priority: 0.3,
    })),
  ];
}
