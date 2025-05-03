import React from 'react';

function Footer(props) {
    return (
        <div className="footB bg-gray-900 text-gray-300 py-8 px-4">
            <section className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">

                <div>
                    <h2 className="text-xl font-semibold mb-4">BankName</h2>
                    <p className="text-sm">
                        © {new Date().getFullYear()} BankName, Inc. All rights reserved.
                    </p>
                    <p className="text-xs mt-2">Member FDIC | Equal Housing Lender</p>
                </div>

                <div>
                    <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                    <ul className="text-sm space-y-2">
                        <li><a href="/privacy" className="hover:underline">Privacy Policy</a></li>
                        <li><a href="/terms" className="hover:underline">Terms of Service</a></li>
                        <li><a href="/support" className="hover:underline">Support</a></li>
                        <li><a href="/careers" className="hover:underline">Careers</a></li>
                    </ul>
                </div>

                <div>
                    <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
                    <p className="text-sm">
                        1234 Finance Ave.<br />
                        Money City, USA 56789<br />
                        Phone: (123) 456-7890<br />
                        Email: support@bankname.com
                    </p>
                </div>

            </section>
        </div>
    );
}

export default Footer;
