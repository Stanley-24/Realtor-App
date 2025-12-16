import Property from "../../../models/property.model";
import User from "../../../models/user.model";

export const createTestData = async () => {
  // create agent
  const agent = await User.create({
    fullName: "Agent Test",
    email: "agent@test.com",
    role: "Agent",
    password: "12345678",
  });

  // create properties
  const properties = await Property.insertMany([
    {
      title: "Lagos House",
      description: "Nice",
      location: "Lagos",
      type: "House",
      status: "Available",
      price: 500_000,
      bedrooms: 3,
      bathrooms: 2,
      isFeatured: true,
      agent: agent._id,
    },
    {
      title: "Abuja Apartment",
      description: "Luxury",
      location: "Abuja",
      type: "Apartment",
      status: "Rented",
      price: 300_000,
      bedrooms: 2,
      bathrooms: 1,
      isFeatured: false,
      agent: agent._id,
    },
    {
      title: "Ikeja Office",
      description: "Commercial space",
      location: "Ikeja",
      type: "Commercial",
      status: "Available",
      price: 800_000,
      bedrooms: 0,
      bathrooms: 2,
      isFeatured: false,
      agent: agent._id,
    },
  ]);

  return { agent, properties };
};
