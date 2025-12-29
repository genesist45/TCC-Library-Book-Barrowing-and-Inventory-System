import { Head, Link } from "@inertiajs/react";
import PublicHeader from "@/components/common/PublicHeader";
import ScrollToTop from "@/components/common/ScrollToTop";
import {
    MapPin,
    Phone,
    Mail,
    Clock,
    Facebook,
    Globe,
    MessageCircle,
    ExternalLink
} from "lucide-react";

export default function Contact() {
    const contactInfo = [
        {
            icon: MapPin,
            title: "Visit Us",
            details: [
                "Tagoloan Community College",
                "Tagoloan, Misamis Oriental",
                "Philippines"
            ],
            color: "from-blue-500 to-cyan-500"
        },
        {
            icon: Phone,
            title: "Call Us",
            details: [
                "+63 XXX XXX XXXX",
                "Mon-Fri: 8:00 AM - 5:00 PM"
            ],
            color: "from-green-500 to-emerald-500"
        },
        {
            icon: Mail,
            title: "Email Us",
            details: [
                "library@tcc.edu.ph",
                "support@tcc.edu.ph"
            ],
            color: "from-purple-500 to-pink-500"
        },
        {
            icon: Clock,
            title: "Library Hours",
            details: [
                "Monday - Friday: 8:00 AM - 6:00 PM",
                "Saturday: 8:00 AM - 12:00 PM",
                "Sunday: Closed"
            ],
            color: "from-orange-500 to-red-500"
        }
    ];

    const socialLinks = [
        {
            name: "Facebook",
            icon: Facebook,
            url: "https://facebook.com/tcclib",
            color: "bg-blue-600 hover:bg-blue-700",
            description: "Follow us for updates and announcements"
        },
        {
            name: "Messenger",
            icon: MessageCircle,
            url: "https://m.me/tcclib",
            color: "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600",
            description: "Quick inquiries and assistance"
        },
        {
            name: "Website",
            icon: Globe,
            url: "https://tcc.edu.ph",
            color: "bg-indigo-600 hover:bg-indigo-700",
            description: "Visit our main college website"
        }
    ];

    return (
        <>
            <Head title="Contact Us" />
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 font-jakarta">
                <PublicHeader />

                {/* Hero Section */}
                <section className="relative overflow-hidden pt-32 pb-16">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-purple-50" />
                    <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-indigo-100 opacity-50 blur-3xl" />
                    <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-purple-100 opacity-50 blur-3xl" />

                    <div className="container relative mx-auto px-4 sm:px-6">
                        <div className="mx-auto max-w-4xl text-center">
                            <h1 className="mb-6 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
                                Get in <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Touch</span>
                            </h1>
                            <p className="mx-auto max-w-2xl text-lg text-gray-600 sm:text-xl">
                                Have questions or need assistance? We're here to help!
                                Reach out to us through any of the channels below.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Contact Cards Section */}
                <section className="py-12 sm:py-16">
                    <div className="container mx-auto px-4 sm:px-6">
                        <div className="mx-auto max-w-7xl">
                            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                                {contactInfo.map((info, index) => (
                                    <div
                                        key={index}
                                        className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm transition-all hover:shadow-lg"
                                    >
                                        <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-gradient-to-br opacity-10 blur-xl group-hover:opacity-20"
                                            style={{ background: `linear-gradient(135deg, var(--tw-gradient-from), var(--tw-gradient-to))` }} />

                                        <div className={`mb-4 inline-flex rounded-xl bg-gradient-to-r ${info.color} p-3 text-white shadow-lg`}>
                                            <info.icon size={24} />
                                        </div>
                                        <h3 className="mb-3 text-lg font-bold text-gray-900">{info.title}</h3>
                                        <div className="space-y-1">
                                            {info.details.map((detail, idx) => (
                                                <p key={idx} className="text-sm text-gray-600">{detail}</p>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Social Media Section */}
                <section className="bg-white py-16 sm:py-20">
                    <div className="container mx-auto px-4 sm:px-6">
                        <div className="mx-auto max-w-4xl">
                            <div className="mb-12 text-center">
                                <h2 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl">
                                    Connect With Us
                                </h2>
                                <p className="mx-auto max-w-2xl text-gray-600">
                                    Follow us on social media to stay updated with the latest news, events, and library resources.
                                </p>
                            </div>

                            <div className="grid gap-6 sm:grid-cols-3">
                                {socialLinks.map((social, index) => (
                                    <a
                                        key={index}
                                        href={social.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group flex flex-col items-center rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-sm transition-all hover:shadow-lg hover:border-gray-200"
                                    >
                                        <div className={`mb-4 rounded-full ${social.color} p-4 text-white shadow-lg transition-transform group-hover:scale-110`}>
                                            <social.icon size={32} />
                                        </div>
                                        <h3 className="mb-2 text-xl font-bold text-gray-900">{social.name}</h3>
                                        <p className="mb-4 text-sm text-gray-600">{social.description}</p>
                                        <span className="inline-flex items-center gap-1 text-sm font-medium text-indigo-600">
                                            Visit <ExternalLink size={14} />
                                        </span>
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Map Section (Optional - Decorative) */}
                <section className="py-16 sm:py-20">
                    <div className="container mx-auto px-4 sm:px-6">
                        <div className="mx-auto max-w-7xl">
                            <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 p-8 text-white shadow-xl sm:p-12">
                                <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-center">
                                    <div>
                                        <h2 className="mb-4 text-3xl font-bold sm:text-4xl">
                                            Visit Our Library
                                        </h2>
                                        <p className="mb-6 text-white/90">
                                            Located at the heart of Tagoloan Community College campus,
                                            our library is easily accessible to all students and community members.
                                            Come visit us and explore our extensive collection!
                                        </p>
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-3">
                                                <MapPin size={20} className="text-white/80" />
                                                <span>Tagoloan, Misamis Oriental, Philippines</span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <Clock size={20} className="text-white/80" />
                                                <span>Open Monday to Saturday</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-center">
                                        <div className="relative h-64 w-full rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
                                            <div className="text-center">
                                                <MapPin size={48} className="mx-auto mb-3 text-white/60" />
                                                <p className="text-white/80">Interactive Map</p>
                                                <p className="text-sm text-white/60">Coming Soon</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Quick Links Section */}
                <section className="bg-gray-50 py-16 sm:py-20">
                    <div className="container mx-auto px-4 sm:px-6">
                        <div className="mx-auto max-w-4xl text-center">
                            <h2 className="mb-4 text-2xl font-bold text-gray-900 sm:text-3xl">
                                Looking for Something Else?
                            </h2>
                            <p className="mb-8 text-gray-600">
                                Explore more about our library and its resources.
                            </p>
                            <div className="flex flex-wrap justify-center gap-4">
                                <Link
                                    href="/about"
                                    className="rounded-lg border border-gray-200 bg-white px-6 py-3 font-medium text-gray-700 shadow-sm transition hover:shadow-md hover:border-gray-300"
                                >
                                    About Us
                                </Link>
                                <Link
                                    href="/#catalogs-section"
                                    className="rounded-lg bg-indigo-600 px-6 py-3 font-medium text-white shadow-sm transition hover:bg-indigo-700"
                                >
                                    Browse Catalog
                                </Link>
                            </div>
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
