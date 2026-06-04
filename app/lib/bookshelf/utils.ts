import { main_category, sub_category } from "../../constants/bookshelf/ndc_v9";


export const getSubCategory = (mainCategory: string, subCategory: string) => {
  const mainCat = main_category[mainCategory as keyof typeof main_category];
  const subGroup = sub_category[mainCategory as keyof typeof sub_category] as
    | Record<string, string>
    | undefined;
  const subCat = subGroup?.[subCategory] ?? subCategory;
  return `${mainCat} > ${subCat}`;
}