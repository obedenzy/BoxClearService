import { Helmet } from "react-helmet";

export default function AboutPage() {
  return (
    <>
      <Helmet>
        <title>About Us | BoxClear</title>
        <meta name="description" content="We're a family-run business dedicated to clearing your moving boxes with care and sustainability." />
        <meta name="keywords" content="family-run box removal, sustainable moving box service" />
      </Helmet>
      
      <section className="py-16 md:py-24 bg-[#00C853]/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-[#00C853] mb-6">About BoxClear</h1>
              <p className="text-[#37474F] text-lg mb-6">We're a family-run business dedicated to clearing your moving boxes with care and sustainability.</p>
              <p className="text-[#37474F] mb-6">Founded in 2020, BoxClear started with a simple mission: help people get rid of cardboard boxes while ensuring they don't end up in landfills. As a family that had moved several times, we understood the hassle of dealing with piles of boxes after settling in.</p>
              <p className="text-[#37474F] mb-8">Today, we serve hundreds of residential and commercial clients, with a 98% recycling rate and a commitment to exceptional service.</p>
              
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-xl font-semibold text-[#00C853] mb-4">Our Mission</h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="h-6 w-6 rounded-full bg-[#00C853] flex items-center justify-center text-white mr-3 mt-0.5 flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3">
                        <path d="M15 1.943v20.114c-2-1.457-4.4-1.625-6.5-1.625-2.3 0-4.7.5-6.5 1.5V2.557C4.2 1.557 6.6 1 8.9 1c2.3 0 4.6.557 6.1 1.943z" />
                      </svg>
                    </div>
                    <p>Provide eco-friendly removal of cardboard and packing materials</p>
                  </div>
                  <div className="flex items-start">
                    <div className="h-6 w-6 rounded-full bg-[#00C853] flex items-center justify-center text-white mr-3 mt-0.5 flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3">
                        <path d="M8.965 18a3.5 3.5 0 01-6.93 0H1V6a1 1 0 011-1h14a1 1 0 011 1v2h3l3 4.056V18h-2.035a3.5 3.5 0 01-6.93 0h-5.07zM15 15a1 1 0 100 2 1 1 0 000-2zm-9 1a1 1 0 112 0 1 1 0 01-2 0z" />
                      </svg>
                    </div>
                    <p>Deliver fast, reliable service that exceeds customer expectations</p>
                  </div>
                  <div className="flex items-start">
                    <div className="h-6 w-6 rounded-full bg-[#00C853] flex items-center justify-center text-white mr-3 mt-0.5 flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3">
                        <path d="M10.59 13.41c.41.39.41 1.03 0 1.42-.39.39-1.03.39-1.42 0a5.003 5.003 0 01-1.65-8.72c.93-.93 2.08-1.48 3.4-1.61.57-.06 1.08.36 1.08.94V7.5c0 .55-.45 1-1 1h-2c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5h5c.83 0 1.5-.67 1.5-1.5v-5c0-.83-.67-1.5-1.5-1.5S13 3.67 13 4.5v.18c-1.69.12-3.3.88-4.5 2.07a7 7 0 00-1.91 6.62c.19.74.49 1.41.91 2.03" />
                      </svg>
                    </div>
                    <p>Create positive community impact through sustainable business practices</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative rounded-xl overflow-hidden shadow-lg">
              <svg className="absolute inset-0 w-full h-full text-gray-100" fill="currentColor" viewBox="0 0 300 300" preserveAspectRatio="none">
                <rect x="0" y="0" width="300" height="300" />
              </svg>
              <div className="relative p-10 flex items-center justify-center h-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-[#00C853]/30" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M5 3a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2H5zm0 3a1 1 0 011-1h12a1 1 0 011 1v7l-3-3-4 4-3-3-4 4v-2l3-3 3 3 4-4 3 3V6z" />
                </svg>
                <p className="absolute bottom-2 text-sm text-center text-gray-500">Team photo with service truck</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
