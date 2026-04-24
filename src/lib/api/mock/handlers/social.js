import { store } from '../store.js';

export const socialHandlers = [
  {
    method: 'GET',
    pattern: '/socials',
    handler: () => ({ data: store.socials }),
  },
  {
    method: 'GET',
    pattern: '/socials/templates',
    handler: () => ({
      data: {
        instagram: '🏡 {{property_title}}\n📍 {{neighborhood}}, {{city}}\n💰 {{price}}\n🛏 {{bedrooms}} · 🛁 {{bathrooms}} · 📐 {{size_m2}} m²\n\n{{short_description}}\n\n👉 Book a viewing: {{booking_link}}\n\n#dublinhomes #{{neighborhood_tag}} #propertytour #realestate',
        tiktok: '🏡 {{property_title}}\n💰 {{price}} · 🛏 {{bedrooms}} · 🛁 {{bathrooms}}\n\nDM for a viewing 📲\n\n#fyp #housetour #{{neighborhood_tag}} #dublin #realestate',
        youtube: '{{property_title}} · {{neighborhood}}, {{city}}\n\n{{short_description}}\n\nPrice: {{price}}\nBedrooms: {{bedrooms}} · Bathrooms: {{bathrooms}} · Size: {{size_m2}} m²\n\nBook a viewing: {{booking_link}}',
        facebook: 'New listing · {{property_title}} in {{neighborhood}}\n\n{{short_description}}\n\n💰 {{price}} · 🛏 {{bedrooms}} · 🛁 {{bathrooms}} · 📐 {{size_m2}} m²\n\nBook a viewing: {{booking_link}}',
        linkedin: 'New listing · {{property_title}}\n\n{{short_description}}\n\nLocated in {{neighborhood}}, {{city}}. Bedrooms: {{bedrooms}} · Bathrooms: {{bathrooms}} · {{size_m2}} m².\n\nBook a viewing: {{booking_link}}',
        gmb: '{{property_title}} — {{neighborhood}}, {{city}}. {{short_description}} Price: {{price}}. Book a viewing: {{booking_link}}',
      },
    }),
  },
  {
    method: 'PUT',
    pattern: '/socials/templates',
    handler: ({ body }) => ({ data: body }),
  },
];
