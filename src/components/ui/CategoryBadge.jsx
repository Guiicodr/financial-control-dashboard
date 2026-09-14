import { useTranslation } from "react-i18next";
import { CATEGORY_COLORS } from "../../lib/finance";
import "../../styles/ui/primitives.css";

function CategoryBadge({ category }) {
  const { t } = useTranslation();
  if (!category) return null;
  const color = CATEGORY_COLORS[category] || CATEGORY_COLORS.OUTROS;

  return (
    <span className="category-badge">
      <span className="category-dot" style={{ background: color }} aria-hidden="true" />
      {t("categories." + category)}
    </span>
  );
}

export default CategoryBadge;

