import { UserIcon, HomeIcon, ChatBubbleLeftRightIcon, ClipboardDocumentListIcon, StarIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";

export default function HowItWorks() {
  // Steps for Buyers
  const buyerSteps = [
    {
      title: "Sign Up",
      description: "Create your Buyer account and start exploring rental properties.",
      icon: UserIcon, // Use component reference
    },
    {
      title: "Browse Properties",
      description: "Explore available rentals with filters to find your perfect home.",
      icon: HomeIcon,
    },
    {
      title: "Contact Agents",
      description: "Chat directly with agents using our InChat system to schedule visits or ask questions.",
      icon: ChatBubbleLeftRightIcon,
    },
  ];

  // Steps for Agents
  const agentSteps = [
    {
      title: "Sign Up",
      description: "Create your Agent account to list your rental properties for free.",
      icon: UserIcon,
    },
    {
      title: "Manage Listings",
      description: "Upload, edit, and track your property listings easily.",
      icon: ClipboardDocumentListIcon,
    },
    {
      title: "Respond to Leads",
      description: "Reply to buyer inquiries and track activities in one place.",
      icon: ChatBubbleLeftRightIcon,
    },
    {
      title: "Get Featured",
      description: "Early users enjoy 3 months of free featured listings on our homepage.",
      icon: StarIcon,
    },
  ];

  // Function to render steps with animation
  const renderSteps = (steps: typeof buyerSteps) =>
    steps.map((step, index) => {
      const Icon = step.icon;
      return (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ delay: index * 0.2, duration: 0.6 }}
          className="relative flex items-start gap-4 mb-10 hover:-translate-y-1 hover:scale-105 transition-transform duration-300 cursor-pointer"
        >
          {/* Connector Line */}
          {index !== steps.length - 1 && (
            <motion.div
              initial={{ height: 0 }}
              whileInView={{ height: "calc(100% + 1.5rem)" }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="absolute left-5 top-12 w-1 bg-gradient-to-b from-secondary-blue/70 to-transparent"
            />
          )}

          {/* Step Number */}
          <motion.div
            whileHover={{ scale: 1.2 }}
            className="relative z-10 flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full bg-btn-colors font-bold text-white text-lg"
          >
            {index + 1}
            <motion.div
              whileHover={{ backgroundColor: "rgba(59, 130, 246, 0.4)" }}
              className="absolute -inset-2 rounded-full bg-btn-colors/20 z-[-1]"
            />
          </motion.div>

          {/* Step Content */}
          <div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 mb-2 group"
            >
              <Icon className="w-6 h-6 text-primary-blue transition-colors duration-300 group-hover:text-btn-colors" />
              <h4 className="font-semibold text-lg font-head">{step.title}</h4>
            </motion.div>
            <p className="text-gray-=500 font-normal font-jetbrain text-sm">{step.description}</p>
          </div>
        </motion.div>
      );
    });

  return (
    <section className="py-16 bg-primary-blue">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold font-head text-white mb-4">How Rental Wave Works</h2>
        <p className="text-gray-200 font-jetbrain mb-12">
          Whether you’re a Buyer or Agent, here’s how you can make the most of Rental Wave.
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Buyer Card */}
          <div className="bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200 rounded-3xl shadow-lg p-8 hover:shadow-xl transition">
            <h3 className="text-xl font-head text-primary-blue font-bold mb-8 text-left">For Buyers</h3>
            {renderSteps(buyerSteps)}
          </div>

          {/* Agent Card */}
          <div className="bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200 rounded-3xl shadow-lg p-8 hover:shadow-xl transition">
            <h3 className="text-xl font-head text-primary-blue font-bold mb-8 text-left">For Agents</h3>
            {renderSteps(agentSteps)}
          </div>
        </div>
      </div>
    </section>
  );
}
