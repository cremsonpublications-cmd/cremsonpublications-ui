import React from "react";
import { FooterLinks } from "./footer.types";
import { Link } from "react-router-dom";

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
  {
    id: 2,
    title: "categories",
    children: [
      {
        id: 21,
        label: "science",
        url: "/shop?category=science",
      },
      {
        id: 22,
        label: "mathematics",
        url: "/shop?category=mathematics",
      },
      {
        id: 23,
        label: "english",
        url: "/shop?category=english",
      },
      {
        id: 24,
        label: "sociology",
        url: "/shop?category=sociology",
      },
    ],
  },
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
  return (
    <>
      {footerLinksData.map((item) => (
        <section className="flex flex-col mt-5" key={item.id}>
          <h3 className="font-medium text-sm md:text-base uppercase tracking-widest mb-6">
            {item.title}
          </h3>
          {item.children.map((link) => (
            <Link
              to={link.url}
              key={link.id}
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
