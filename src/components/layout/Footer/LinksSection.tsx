import React from "react";
import { FooterLinks } from "./footer.types";
import { Link } from "react-router-dom";
import { useProducts } from "../../../context/ProductContext";

const footerLinksData: FooterLinks[] = [
  {
    id: 1,
    title: "shop",
    children: [
      {
        id: 11,
        label: "all books",
        url: "/shop",
      },
      {
        id: 12,
        label: "wishlist",
        url: "/wishlist",
      },
      {
        id: 13,
        label: "cart",
        url: "/cart",
      },
    ],
  },
  // Categories section is now dynamic
  {
    id: 3,
    title: "company",
    children: [
      {
        id: 31,
        label: "about us",
        url: "/about-us",
      },
      {
        id: 32,
        label: "contact us",
        url: "/contact-us",
      },
    ],
  },
  {
    id: 4,
    title: "policies",
    children: [
      {
        id: 41,
        label: "pricing policy",
        url: "/pricing-policy",
      },
      {
        id: 42,
        label: "shipping policy",
        url: "/shipping-policy",
      },
      {
        id: 43,
        label: "terms & conditions",
        url: "/terms-conditions",
      },
      {
        id: 44,
        label: "privacy policy",
        url: "/privacy-policy",
      },
      {
        id: 45,
        label: "cancellation & refund",
        url: "/cancellation-refund",
      },
    ],
  },
];

const LinksSection = () => {
  const { categories } = useProducts();

  // Create dynamic categories section
  const dynamicCategoriesSection = {
    id: 2,
    title: "categories",
    children: categories.slice(0, 6).map((category, index) => ({
      id: 20 + index,
      label: category.main_category_name.toLowerCase(),
      url: "/shop"
    }))
  };

  // Insert dynamic categories section at position 2 (after shop section)
  const dynamicFooterLinksData = [
    footerLinksData[0], // shop section
    dynamicCategoriesSection, // dynamic categories
    ...footerLinksData.slice(1) // company and policies sections
  ];

  return (
    <>
      {dynamicFooterLinksData.map((item) => (
        <section className="flex flex-col mt-5" key={item.id}>
          <h3 className="font-medium text-sm md:text-base uppercase tracking-widest mb-6">
            {item.title}
          </h3>
          {item.children.map((link) => (
            <Link
              to={link.url}
              key={link.id}
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="text-black/60 text-sm md:text-base mb-4 w-fit capitalize hover:text-black transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </section>
      ))}
    </>
  );
};

export default LinksSection;
