import pudina from "@/public/images/products/pudina-jar.webp";
import saltPepper from "@/public/images/products/salt-pepper-jar.webp";
import periPeri from "@/public/images/products/peri-peri-jar.webp";

export function productImage(slug?: string) {
  switch (slug) {
    case "pudina": return pudina;
    case "peri-peri": return periPeri;
    default: return saltPepper;
  }
}
