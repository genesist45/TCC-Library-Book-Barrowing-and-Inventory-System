import { Head, Link } from "@inertiajs/react";
import PublicHeader from "@/components/common/PublicHeader";
import ScrollToTop from "@/components/common/ScrollToTop";
import {
    BookOpen,
    Users,
    Library,
    Heart,
    Target,
    Award,
    Clock,
    Shield
} from "lucide-react";

export default function About() {
    const features = [
        {
            icon: BookOpen,
            title: "Extensive Collection",
            description: "Access thousands of books, journals, magazines, and academic resources across various subjects and disciplines."
        },
        {
            icon: Users,
            title: "Community Focused",
            description: "We serve students, faculty, and community members with personalized borrowing services tailored to their needs."
        },
        {
            icon: Clock,
            title: "Convenient Hours",
            description: "Extended operating hours and efficient checkout processes to accommodate your busy schedule."
        },
        {
            icon: Shield,
            title: "Modern Management",
            description: "State-of-the-art inventory management system ensures accurate tracking and availability of all resources."
        }
    ];

    const values = [
        {
            icon: Target,
            title: "Our Mission",
            description: "To provide accessible, high-quality library resources and services that support lifelong learning, research, and the intellectual growth of our community."
        },
        {
            icon: Heart,
            title: "Our Vision",
            description: "To be a center of knowledge and innovation, fostering a love for reading and learning while preserving valuable educational resources for future generations."
        },
        {
            icon: Award,
            title: "Our Commitment",
            description: "We are dedicated to maintaining an organized, welcoming environment where everyone can discover, learn, and grow through the power of knowledge."
        }
    ];

    return (
        <>
            <Head title="About Us" />
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 font-jakarta">
                <PublicHeader />

                {/* Hero Section */}
                <section className="relative overflow-hidden pt-32 pb-20">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-purple-50" />
                    <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-indigo-100 opacity-50 blur-3xl" />
                    <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-purple-100 opacity-50 blur-3xl" />

                    <div className="container relative mx-auto px-4 sm:px-6">
                        <div className="mx-auto max-w-4xl text-center">
                            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-indigo-100 px-4 py-2 text-sm font-medium text-indigo-700">
                                <Library size={18} />
                                Tagoloan Community College Library
                            </div>
                            <h1 className="mb-6 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
                                About <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Our Library</span>
                            </h1>
                            <p className="mx-auto max-w-2xl text-lg text-gray-600 sm:text-xl">
                                Empowering minds through accessible knowledge and resources.
                                We're committed to fostering a culture of learning and discovery within our community.
                            </p>
                        </div>
                    </div>
                </section>

                {/* About Content Section */}
                <section className="py-16 sm:py-20">
                    <div className="container mx-auto px-4 sm:px-6">
                        <div className="mx-auto max-w-7xl">
                            <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
                                {/* Content */}
                                <div>
                                    <h2 className="mb-6 text-3xl font-bold text-gray-900 sm:text-4xl">
                                        Your Gateway to Knowledge
                                    </h2>
                                    <div className="space-y-4 text-gray-600">
                                        <p>
                                            The Tagoloan Community College Library serves as the academic heart of our institution,
                                            providing essential resources and services to support the educational journey of our students,
                                            faculty, and the broader community.
                                        </p>
                                        <p>
                                            Our library houses an extensive collection of books, periodicals, academic journals,
                                            and multimedia resources covering a wide range of subjects. Whether you're conducting
                                            research, studying for exams, or simply exploring new interests, our collection has
                                            something for everyone.
                                        </p>
                                        <p>
                                            With our modern Library Management System, we've streamlined the borrowing process
                                            to make accessing resources easier than ever. Our efficient inventory management
                                            ensures that you can quickly find and borrow the materials you need.
                                        </p>
                                    </div>
                                </div>

                                {/* Image/Stats Card */}
                                <div className="relative">
                                    <div className="rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 p-8 text-white shadow-xl sm:p-10">
                                        <h3 className="mb-8 text-2xl font-bold">Library Services</h3>
                                        <div className="grid grid-cols-2 gap-6">
                                            <div className="rounded-xl bg-white/10 p-4 backdrop-blur-sm">
                                                <p className="text-3xl font-bold">1000+</p>
                                                <p className="text-sm text-white/80">Books & Resources</p>
                                            </div>
                                            <div className="rounded-xl bg-white/10 p-4 backdrop-blur-sm">
                                                <p className="text-3xl font-bold">500+</p>
                                                <p className="text-sm text-white/80">Active Members</p>
                                            </div>
                                            <div className="rounded-xl bg-white/10 p-4 backdrop-blur-sm">
                                                <p className="text-3xl font-bold">50+</p>
                                                <p className="text-sm text-white/80">Subject Categories</p>
                                            </div>
                                            <div className="rounded-xl bg-white/10 p-4 backdrop-blur-sm">
                                                <p className="text-3xl font-bold">24/7</p>
                                                <p className="text-sm text-white/80">Online Catalog</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="bg-white py-16 sm:py-20">
                    <div className="container mx-auto px-4 sm:px-6">
                        <div className="mx-auto max-w-7xl">
                            <div className="mb-12 text-center">
                                <h2 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl">
                                    What We Offer
                                </h2>
                                <p className="mx-auto max-w-2xl text-gray-600">
                                    Comprehensive library services designed to support your academic and personal growth.
                                </p>
                            </div>

                            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                                {features.map((feature, index) => (
                                    <div
                                        key={index}
                                        className="group rounded-xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:shadow-lg hover:border-indigo-100"
                                    >
                                        <div className="mb-4 inline-flex rounded-lg bg-indigo-100 p-3 text-indigo-600 transition-colors group-hover:bg-indigo-600 group-hover:text-white">
                                            <feature.icon size={24} />
                                        </div>
                                        <h3 className="mb-2 text-lg font-semibold text-gray-900">{feature.title}</h3>
                                        <p className="text-sm text-gray-600">{feature.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Mission, Vision, Commitment Section */}
                <section className="py-16 sm:py-20">
                    <div className="container mx-auto px-4 sm:px-6">
                        <div className="mx-auto max-w-7xl">
                            <div className="mb-12 text-center">
                                <h2 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl">
                                    Our Values
                                </h2>
                                <p className="mx-auto max-w-2xl text-gray-600">
                                    Guided by our commitment to education and community service.
                                </p>
                            </div>

                            <div className="grid gap-8 lg:grid-cols-3">
                                {values.map((value, index) => (
                                    <div
                                        key={index}
                                        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-50 to-white p-8 shadow-sm transition-all hover:shadow-md"
                                    >
                                        <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-indigo-100 opacity-50 blur-2xl" />
                                        <div className="relative">
                                            <div className="mb-4 inline-flex rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 p-3 text-white">
                                                <value.icon size={24} />
                                            </div>
                                            <h3 className="mb-3 text-xl font-bold text-gray-900">{value.title}</h3>
                                            <p className="text-gray-600">{value.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="bg-gradient-to-r from-indigo-600 to-purple-600 py-16 sm:py-20">
                    <div className="container mx-auto px-4 sm:px-6">
                        <div className="mx-auto max-w-4xl text-center text-white">
                            <h2 className="mb-4 text-3xl font-bold sm:text-4xl">
                                Ready to Explore Our Collection?
                            </h2>
                            <p className="mb-8 text-lg text-white/90">
                                Browse our extensive catalog and discover resources for your learning journey.
                            </p>
                            <Link
                                href="/#catalogs-section"
                                className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 font-semibold text-indigo-600 shadow-lg transition hover:bg-gray-100"
                            >
                                <BookOpen size={20} />
                                Browse Catalog
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="bg-gray-900 py-8 text-center text-gray-400">
                    <div className="container mx-auto px-4">
                        <p>&copy; {new Date().getFullYear()} Tagoloan Community College Library. All rights reserved.</p>
                    </div>
                </footer>

                <ScrollToTop />
            </div>
        </>
    );
}
